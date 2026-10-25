import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);

const server = app.listen(5099, async () => {
  console.log('Testing server running on port 5099...');

  const BASE = 'http://localhost:5099/api';
  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`  ✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Retailer Login
    const rLoginRes = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'retailer@test.com', password: 'password123', role: 'retailer' })
    });
    const rLogin = await rLoginRes.json();
    assert(rLogin.success === true && !!rLogin.token, 'Retailer Login returns JWT token');
    const rToken = rLogin.token;

    // 2. Wholesaler Login
    const wLoginRes = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'wholesaler@test.com', password: 'password123', role: 'wholesaler' })
    });
    const wLogin = await wLoginRes.json();
    assert(wLogin.success === true && !!wLogin.token, 'Wholesaler Login returns JWT token');
    const wToken = wLogin.token;

    // 3. GET /api/auth/me
    const meRes = await fetch(`${BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${rToken}` }
    });
    const me = await meRes.json();
    assert(me.success === true && me.user.role === 'retailer', 'GET /api/auth/me authenticates token');

    // 4. PUT /api/auth/profile (Retailer)
    const rProfRes = await fetch(`${BASE}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`
      },
      body: JSON.stringify({
        storeName: 'Mahalaxmi Supermarket',
        phone: '9876543210',
        address: 'MG Road, Bangalore',
        pincode: '560001',
        paymentCOD: true
      })
    });
    const rProf = await rProfRes.json();
    assert(rProf.success === true && rProf.user.storeName === 'Mahalaxmi Supermarket' && rProf.user.paymentCOD === true, 'PUT /api/auth/profile updates retailer profile');

    // 5. PUT /api/auth/profile (Wholesaler)
    const wProfRes = await fetch(`${BASE}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${wToken}`
      },
      body: JSON.stringify({
        businessName: 'Balaji Agro Milling Corp',
        tradeName: 'Balaji Agro Mills',
        phone: '9123456789',
        mov: 7500
      })
    });
    const wProf = await wProfRes.json();
    assert(wProf.success === true && wProf.user.tradeName === 'Balaji Agro Mills' && wProf.user.mov === 7500, 'PUT /api/auth/profile updates wholesaler profile');

    // 6. GET /api/dashboard/retailer
    const rDashRes = await fetch(`${BASE}/dashboard/retailer`, {
      headers: { Authorization: `Bearer ${rToken}` }
    });
    const rDash = await rDashRes.json();
    assert(rDash.success === true, 'GET /api/dashboard/retailer returns success');
    assert(typeof rDash.data.activeOrdersCount === 'number', `Retailer activeOrdersCount is numeric (${rDash.data.activeOrdersCount})`);
    assert(typeof rDash.data.totalSpend === 'number' && rDash.data.totalSpend > 0, `Retailer totalSpend is calculated (${rDash.data.totalSpendFormatted})`);
    assert(rDash.data.verifiedSuppliersCount >= 12, `Verified suppliers count is accurate (${rDash.data.verifiedSuppliersCount})`);
    assert(rDash.data.products.length >= 10, `Retailer products list returned (${rDash.data.products.length} products)`);

    // 7. GET /api/dashboard/wholesaler
    const wDashRes = await fetch(`${BASE}/dashboard/wholesaler`, {
      headers: { Authorization: `Bearer ${wToken}` }
    });
    const wDash = await wDashRes.json();
    assert(wDash.success === true, 'GET /api/dashboard/wholesaler returns success');
    assert(typeof wDash.data.totalRevenueRaw === 'number' && wDash.data.totalRevenueRaw > 0, `Wholesaler revenue calculated from eligible orders (${wDash.data.totalRevenue})`);
    assert(wDash.data.totalProducts >= 10, `Wholesaler total SKUs returned (${wDash.data.totalProducts})`);
    assert(wDash.data.totalInventoryUnits > 1000, `Wholesaler inventory units calculated (${wDash.data.totalInventoryUnits})`);
    assert(typeof wDash.data.lowStockCount === 'number', `Wholesaler low stock count detected (${wDash.data.lowStockCount})`);

    // 8. PUT /api/dashboard/wholesaler/product/:id
    const prodId = wDash.data.skus[0].id;
    const updProdRes = await fetch(`${BASE}/dashboard/wholesaler/product/${prodId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${wToken}`
      },
      body: JSON.stringify({ basePrice: 99 })
    });
    const updProd = await updProdRes.json();
    assert(updProd.success === true && updProd.product.basePrice === 99, `Wholesaler inline price update persisted (New price: ₹${updProd.product.basePrice})`);

    console.log(`\nAll API Tests Completed: ${passed} PASSED, ${failed} FAILED`);
  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  } finally {
    server.close(() => {
      process.exit(failed > 0 ? 1 : 0);
    });
  }
});
