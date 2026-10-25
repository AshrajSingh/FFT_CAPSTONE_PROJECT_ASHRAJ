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
export const inMemoryUsers = new Map();          // fallback when MongoDB is down

export const isDbConnected = () => mongoose.connection.readyState === 1;
export const getJwtSecret  = () => process.env.JWT_SECRET || 'stocklink_super_secret_jwt_key_2026_dev';

/* ---------- helpers ---------- */
export const createToken = (user) =>
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

export const fmt = (u) => ({
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

/* ============================================================
   PUT /api/auth/profile
   Updates authenticated user's profile details.
   Prevents tampering with role, password, _id, or isOnboarded.
   ============================================================ */
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const uid = req.user.id || req.user._id;
    const role = req.user.role;
    const b = req.body;

    const allowedUpdates = {};

    // Common profile fields
    if (b.contactPerson !== undefined)  allowedUpdates.contactPerson = String(b.contactPerson).trim();
    if (b.contactEmail !== undefined)   allowedUpdates.contactEmail = String(b.contactEmail).trim();
    if (b.phone !== undefined)          allowedUpdates.phone = String(b.phone).trim();
    if (b.address !== undefined)        allowedUpdates.address = String(b.address).trim();
    if (b.pincode !== undefined)        allowedUpdates.pincode = String(b.pincode).trim();
    if (b.coveredPincodes !== undefined)allowedUpdates.coveredPincodes = String(b.coveredPincodes).trim();
    if (b.deliveryRadius !== undefined) allowedUpdates.deliveryRadius = Number(b.deliveryRadius) || 0;
    if (b.businessCategory !== undefined) allowedUpdates.businessCategory = String(b.businessCategory).trim();

    // Role-specific profile fields
    if (role === 'retailer') {
      if (b.storeName !== undefined) {
        allowedUpdates.storeName = String(b.storeName).trim();
        allowedUpdates.businessName = String(b.storeName).trim();
      }
      if (b.registeredName !== undefined) {
        allowedUpdates.registeredName = String(b.registeredName).trim();
        allowedUpdates.name = String(b.registeredName).trim();
      }
      if (b.shopLicense !== undefined)         allowedUpdates.shopLicense = String(b.shopLicense).trim();
      if (b.paymentCOD !== undefined)          allowedUpdates.paymentCOD = Boolean(b.paymentCOD);
      if (b.paymentBankTransfer !== undefined) allowedUpdates.paymentBankTransfer = Boolean(b.paymentBankTransfer);
      if (b.paymentCard !== undefined)         allowedUpdates.paymentCard = Boolean(b.paymentCard);
    } else if (role === 'wholesaler') {
      if (b.businessName !== undefined || b.businessLegalName !== undefined) {
        const legalName = String(b.businessName || b.businessLegalName).trim();
        allowedUpdates.businessName = legalName;
        allowedUpdates.name = legalName;
      }
      if (b.tradeName !== undefined)       allowedUpdates.tradeName = String(b.tradeName).trim();
      if (b.operationStatus !== undefined) allowedUpdates.operationStatus = String(b.operationStatus).trim();
      if (b.mov !== undefined)             allowedUpdates.mov = Number(b.mov) || 0;
      if (b.capacity !== undefined)        allowedUpdates.capacity = String(b.capacity).trim();
    }

    let updated;
    if (isDbConnected()) {
      updated = await User.findByIdAndUpdate(uid, { $set: allowedUpdates }, { new: true }).select('-password');
    } else {
      for (const [k, v] of inMemoryUsers.entries()) {
        if (v.id === uid || v._id === uid || v.email === req.user.email) {
          Object.assign(v, allowedUpdates);
          inMemoryUsers.set(k, v);
          updated = { ...v };
          break;
        }
      }
      if (!updated) updated = { ...req.user, ...allowedUpdates };
    }

    if (!updated) return res.status(404).json({ success: false, message: 'User profile not found.' });

    const token = createToken(updated);
    return res.json({
      success: true,
      message: 'Profile updated successfully',
      token,
      user: fmt(updated)
    });
  } catch (err) {
    console.error('Profile update error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

/* GET /api/auth/me */
router.get('/me', authMiddleware, async (req, res) => {
  res.json({ success: true, user: fmt(req.user) });
});

export default router;
