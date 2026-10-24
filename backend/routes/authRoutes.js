import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import {
  loginSchema,
  gstinSchema,
  wholesalerOnboardingSchema,
  retailerOnboardingSchema,
  validate
} from '../middleware/validate.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();
const inMemoryUsers = new Map();          // fallback when MongoDB is down

const isDbConnected = () => mongoose.connection.readyState === 1;
const getJwtSecret  = () => process.env.JWT_SECRET || 'stocklink_super_secret_jwt_key_2026_dev';

/* ---------- helpers ---------- */
const createToken = (user) =>
  jwt.sign(
    {
      id:           user._id ? user._id.toString() : user.id,
      email:        user.email,
      role:         user.role,
      name:         user.name,
      businessName: user.businessName || user.name,
      isOnboarded:  user.isOnboarded,
      gstin:        user.gstin || ''
    },
    getJwtSecret(),
    { expiresIn: '7d' }
  );

const fmt = (u) => ({
  id:              u._id ? u._id.toString() : u.id,
  name:            u.name,
  businessName:    u.businessName || u.name,
  tradeName:       u.tradeName       || '',
  storeName:       u.storeName       || '',
  registeredName:  u.registeredName  || '',
  contactPerson:   u.contactPerson   || '',
  email:           u.email,
  contactEmail:    u.contactEmail    || u.email,
  role:            u.role,
  phone:           u.phone           || '',
  pan:             u.pan             || '',
  gstin:           u.gstin           || '',
  docType:         u.docType         || '',
  docNumber:       u.docNumber       || '',
  address:         u.address         || '',
  pincode:         u.pincode         || '',
  coveredPincodes: u.coveredPincodes || '',
  deliveryRadius:  u.deliveryRadius  || 0,
  businessCategory:u.businessCategory|| '',
  operationStatus: u.operationStatus || 'active',
  mov:             u.mov             || 0,
  capacity:        u.capacity        || '',
  shopLicense:     u.shopLicense     || '',
  paymentCOD:          u.paymentCOD          || false,
  paymentBankTransfer: u.paymentBankTransfer || false,
  paymentCard:         u.paymentCard         || false,
  isOnboarded:     u.isOnboarded
});

/* ============================================================
   POST /api/auth/login
   ============================================================ */
router.post('/login', validate(loginSchema), async (req, res) => {
  try {
    const { email, password, role, name } = req.body;
    const norm = email.toLowerCase().trim();

    let user = isDbConnected()
      ? await User.findOne({ email: norm })
      : inMemoryUsers.get(norm) || null;

    if (!user) {
      // Auto-create on first login
      const hashed = await bcrypt.hash(password, 10);
      const displayName = name || `${role === 'retailer' ? 'Demo Retailer' : 'Demo Wholesaler'} (${norm.split('@')[0]})`;
      const payload = {
        name: displayName, businessName: displayName,
        email: norm, password: hashed, role,
        gstin: '', isOnboarded: false
      };
      user = isDbConnected()
        ? await User.create(payload)
        : { ...payload, id: 'demo_' + Date.now(), _id: 'demo_' + Date.now() };
      if (!isDbConnected()) inMemoryUsers.set(norm, user);
    } else {
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials.' });
      if (user.role !== role) {
        user.role = role;
        if (isDbConnected()) await user.save();
        else inMemoryUsers.set(norm, user);
      }
    }

    return res.json({ success: true, message: 'Authenticated', token: createToken(user), user: fmt(user) });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

/* ============================================================
   POST /api/auth/onboard/wholesaler
   Saves all 3 sections of the Wholesaler Onboarding form.
   ============================================================ */
router.post('/onboard/wholesaler', authMiddleware, validate(wholesalerOnboardingSchema), async (req, res) => {
  try {
    const b = req.body;
    const uid = req.user.id || req.user._id;

    const fields = {
      businessName:     b.businessLegalName,
      tradeName:        b.tradeName        || '',
      pan:              b.businessPan      || '',
      contactPerson:    b.contactPerson,
      phone:            b.mobile,
      contactEmail:     b.contactEmail,
      gstin:            b.gstin.toUpperCase(),
      businessCategory: b.businessCategory,
      operationStatus:  b.operationStatus  || 'active',
      mov:              Number(b.mov)      || 0,
      deliveryRadius:   Number(b.deliveryRadius) || 15,
      coveredPincodes:  b.coveredPincodes  || '',
      name:             b.businessLegalName,
      isOnboarded:      true
    };

    let updated;
    if (isDbConnected()) {
      updated = await User.findByIdAndUpdate(uid, { $set: fields }, { new: true }).select('-password');
    } else {
      for (const [k, v] of inMemoryUsers.entries()) {
        if (v.id === uid || v._id === uid || v.email === req.user.email) {
          Object.assign(v, fields);
          inMemoryUsers.set(k, v);
          updated = { ...v };
          break;
        }
      }
      if (!updated) updated = { ...req.user, ...fields };
    }

    if (!updated) return res.status(404).json({ success: false, message: 'User not found.' });

    const token = createToken(updated);
    localStorage_set(updated);          // helper below does nothing on server – fine
    return res.json({ success: true, message: 'Wholesaler onboarding complete!', token, user: fmt(updated) });
  } catch (err) {
    console.error('Wholesaler onboard error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

/* ============================================================
   POST /api/auth/onboard/retailer
   Saves all 3 sections of the Retailer Onboarding form.
   ============================================================ */
router.post('/onboard/retailer', authMiddleware, validate(retailerOnboardingSchema), async (req, res) => {
  try {
    const b   = req.body;
    const uid = req.user.id || req.user._id;

    const fields = {
      storeName:          b.storeName,
      registeredName:     b.registeredName,
      businessName:       b.storeName,
      name:               b.registeredName,
      pan:                b.retailerPan     || '',
      address:            b.businessAddress,
      shopLicense:        b.shopLicense     || '',
      contactPerson:      b.contactPerson,
      contactEmail:       b.storeEmail,
      phone:              b.contactMobile,
      docType:            b.docType,
      docNumber:          b.docNumber,
      gstin:              b.docType === 'GSTIN' ? b.docNumber.toUpperCase() : (req.user.gstin || ''),
      businessCategory:   b.businessCategory,
      operationStatus:    b.operationStatus || 'active',
      mov:                Number(b.mov)     || 0,
      deliveryRadius:     Number(b.deliveryRadius) || 3,
      coveredPincodes:    b.coveredPincodes || '',
      paymentCOD:             Boolean(b.paymentCOD),
      paymentBankTransfer:    Boolean(b.paymentBankTransfer),
      paymentCard:            Boolean(b.paymentCard),
      isOnboarded:        true
    };

    let updated;
    if (isDbConnected()) {
      updated = await User.findByIdAndUpdate(uid, { $set: fields }, { new: true }).select('-password');
    } else {
      for (const [k, v] of inMemoryUsers.entries()) {
        if (v.id === uid || v._id === uid || v.email === req.user.email) {
          Object.assign(v, fields);
          inMemoryUsers.set(k, v);
          updated = { ...v };
          break;
        }
      }
      if (!updated) updated = { ...req.user, ...fields };
    }

    if (!updated) return res.status(404).json({ success: false, message: 'User not found.' });

    const token = createToken(updated);
    return res.json({ success: true, message: 'Retailer onboarding complete!', token, user: fmt(updated) });
  } catch (err) {
    console.error('Retailer onboard error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

/* ============================================================
   POST /api/auth/verify-gst  (legacy single-step, kept intact)
   ============================================================ */
router.post('/verify-gst', authMiddleware, validate(gstinSchema), async (req, res) => {
  try {
    const { gstin, businessName, contactPerson, phone, address, pincode, category, mov, capacity } = req.body;
    const uid = req.user.id || req.user._id;
    const normG = gstin.toUpperCase().trim();
    const upd = { gstin: normG, isOnboarded: true };
    if (businessName)  { upd.businessName = businessName.trim(); upd.name = businessName.trim(); }
    if (contactPerson)   upd.contactPerson = contactPerson.trim();
    if (phone)           upd.phone   = phone.trim();
    if (address)         upd.address = address.trim();
    if (pincode)         upd.pincode = pincode.trim();
    if (category)        upd.businessCategory = category.trim();
    if (mov !== undefined && mov !== '') upd.mov = Number(mov);
    if (capacity)        upd.capacity = capacity.trim();

    let updated;
    if (isDbConnected()) {
      updated = await User.findByIdAndUpdate(uid, { $set: upd }, { new: true }).select('-password');
    } else {
      for (const [k, v] of inMemoryUsers.entries()) {
        if (v.id === uid || v._id === uid || v.email === req.user.email) {
          Object.assign(v, upd);
          inMemoryUsers.set(k, v);
          updated = { ...v }; delete updated.password;
          break;
        }
      }
      if (!updated) updated = { ...req.user, ...upd };
    }
    if (!updated) return res.status(404).json({ success: false, message: 'User not found.' });

    const token = createToken(updated);
    return res.json({ success: true, message: 'GSTIN verified on StockLink.', token, user: fmt(updated) });
  } catch (err) {
    console.error('verify-gst error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

/* GET /api/auth/me */
router.get('/me', authMiddleware, async (req, res) => {
  res.json({ success: true, user: fmt(req.user) });
});

// server-side noop (localStorage lives on client)
function localStorage_set() {}

export default router;
