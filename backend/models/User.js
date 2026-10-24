import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    /* Auth core */
    name:        { type: String, required: true, trim: true },
    email:       { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:    { type: String, required: true },
    role:        { type: String, enum: ['retailer', 'wholesaler'], required: true },
    isOnboarded: { type: Boolean, default: false },

    /* Shared */
    gstin:         { type: String, default: '', uppercase: true, trim: true },
    businessName:  { type: String, default: '', trim: true },
    contactPerson: { type: String, default: '', trim: true },
    phone:         { type: String, default: '', trim: true },
    pan:           { type: String, default: '', uppercase: true, trim: true },
    contactEmail:  { type: String, default: '', trim: true },

    /* Delivery / address */
    address:        { type: String, default: '', trim: true },
    pincode:        { type: String, default: '', trim: true },
    coveredPincodes:{ type: String, default: '', trim: true },
    deliveryRadius: { type: Number, default: 0 },

    /* Business prefs */
    businessCategory: { type: String, default: '', trim: true },
    operationStatus:  { type: String, default: 'active' },
    mov:              { type: Number, default: 0 },

    /* Wholesaler-specific */
    tradeName: { type: String, default: '', trim: true },
    capacity:  { type: String, default: '', trim: true },

    /* Retailer-specific */
    storeName:       { type: String, default: '', trim: true },
    registeredName:  { type: String, default: '', trim: true },
    shopLicense:     { type: String, default: '', trim: true },
    docType:         { type: String, default: '', trim: true },
    docNumber:       { type: String, default: '', trim: true },
    paymentCOD:          { type: Boolean, default: false },
    paymentBankTransfer: { type: Boolean, default: false },
    paymentCard:         { type: Boolean, default: false }
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
