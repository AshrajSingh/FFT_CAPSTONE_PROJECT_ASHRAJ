import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.resolve(__dirname, '../frontend/dist');

// Load environment variables from backend/.env or current working directory
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/stocklink';

// Enable trust proxy for cloud deployment platforms (Render, Railway, Heroku)
app.set('trust proxy', 1);

// CORS configuration supporting production frontend URLs
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000'
];

if (process.env.CLIENT_URL) {
  const configured = process.env.CLIENT_URL.split(',').map((url) => url.trim());
  allowedOrigins.push(...configured);
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., server-to-server, health check, Postman)
      if (!origin) return callback(null, true);

      const isAllowed =
        allowedOrigins.includes(origin) ||
        allowedOrigins.includes('*') ||
        (process.env.NODE_ENV !== 'production') ||
        origin.endsWith('.vercel.app') ||
        origin.endsWith('.netlify.app') ||
        origin.endsWith('.onrender.com');

      if (isAllowed) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json());

// Request logging middleware in development
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  }
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'StockLink B2B Commerce Backend API',
    mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected (in-memory fallback active)',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Authentication routes
app.use('/api/auth', authRoutes);

// Dashboard & Catalogue routes
app.use('/api/dashboard', dashboardRoutes);

// Serve static frontend assets if built
if (fs.existsSync(frontendDistPath)) {
  console.log(`[Production] Serving frontend static assets from: ${frontendDistPath}`);
  app.use(express.static(frontendDistPath));

  // Catch-all route for Single Page Application client-side routing
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

// 404 Handler for unmatched API endpoints
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint or resource not found: ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Connect to MongoDB with resilient timeout
async function connectDB() {
  try {
    mongoose.set('strictQuery', false);
    const serverSelectionTimeoutMS = process.env.NODE_ENV === 'production' ? 10000 : 3000;
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS
    });
    console.log(`MongoDB Connected successfully to: ${MONGODB_URI.replace(/:[^:@]+@/, ':****@')}`);
  } catch (err) {
    console.warn(`MongoDB connection notice: ${err.message}`);
    console.warn('Running with resilient in-memory session store. MongoDB Atlas/Local connection can be configured via MONGODB_URI.');
  }
}

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(` StockLink Backend Server running on port ${PORT}`);
    console.log(` Health check: http://localhost:${PORT}/api/health`);
    console.log(` Auth endpoints: http://localhost:${PORT}/api/auth/login`);
    console.log(` Dashboard endpoints: http://localhost:${PORT}/api/dashboard/*`);
    console.log(`====================================================`);
  });
});
