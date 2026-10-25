import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authorization denied. No token provided or invalid format.'
      });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'stocklink_super_secret_jwt_key_2026_dev';

    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session token. Please log in again.'
      });
    }

    // Try finding user in database if connection is live and id is a valid Mongo ObjectId
    let user = null;
    if (decoded.id && mongoose.connection.readyState === 1 && mongoose.isValidObjectId(decoded.id)) {
      try {
        user = await User.findById(decoded.id).select('-password');
      } catch (dbErr) {
        // Fall back to decoded token payload
      }
    }

    // Populate req.user
    if (user) {
      req.user = user;
    } else {
      req.user = {
        id: decoded.id,
        _id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name,
        isOnboarded: decoded.isOnboarded,
        gstin: decoded.gstin || ''
      };
    }

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication processing error'
    });
  }
};

export default authMiddleware;
