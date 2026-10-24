import { z } from 'zod';

export const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
export const PAN_REGEX   = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

/* ---------- Auth ---------- */
export const loginSchema = z.object({
  email:    z.string().trim().email('Please provide a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role:     z.enum(['retailer', 'wholesaler'], {
    errorMap: () => ({ message: "Role must be either 'retailer' or 'wholesaler'" })
  }),
  name: z.string().trim().optional()
});

/* ---------- Wholesaler onboarding ---------- */
export const wholesalerOnboardingSchema = z.object({
  /* Section 1 – Business Registration */
  businessLegalName: z.string().trim().min(2, 'Business legal name is required'),
  tradeName:         z.string().trim().optional(),
  businessPan:       z.string().trim().regex(PAN_REGEX, 'Invalid PAN format (e.g. AAAAA0000A)').optional().or(z.literal('')),
  contactPerson:     z.string().trim().min(2, 'Contact person name is required'),
  mobile:            z.string().trim().regex(/^\d{10}$/, 'Enter a valid 10-digit mobile number'),
  contactEmail:      z.string().trim().email('Enter a valid email address'),

  /* Section 2 – GST Verification */
  gstin: z.string().trim().toUpperCase()
          .regex(GSTIN_REGEX, 'Invalid 15-character Indian GSTIN'),

  /* Section 3 – Fulfillment Preferences */
  businessCategory: z.string().trim().min(1, 'Please select a business category'),
  operationStatus:  z.enum(['active', 'inactive']).default('active'),
  mov:              z.union([z.string(), z.number()]).transform(Number),
  deliveryRadius:   z.union([z.string(), z.number()]).transform(Number).default(15),
  coveredPincodes:  z.string().trim().optional()
});

/* ---------- Retailer onboarding ---------- */
export const retailerOnboardingSchema = z.object({
  /* Section 1 – Retailer Profile */
  storeName:          z.string().trim().min(2, 'Store name is required'),
  registeredName:     z.string().trim().min(2, 'Registered name is required'),
  retailerPan:        z.string().trim().regex(PAN_REGEX, 'Invalid PAN format').optional().or(z.literal('')),
  businessAddress:    z.string().trim().min(5, 'Business address is required'),
  shopLicense:        z.string().trim().optional(),
  contactPerson:      z.string().trim().min(2, 'Contact person is required'),
  storeEmail:         z.string().trim().email('Enter a valid store email'),
  contactMobile:      z.string().trim().regex(/^\d{10}$/, 'Enter a valid 10-digit mobile number'),

  /* Section 2 – Verification */
  docType:            z.string().trim().min(1, 'Select a document type'),
  docNumber:          z.string().trim().min(4, 'Enter a valid document number'),

  /* Section 3 – Buying & Delivery Preferences */
  businessCategory:   z.string().trim().min(1, 'Please select a business category'),
  operationStatus:    z.enum(['active', 'inactive']).default('active'),
  mov:                z.union([z.string(), z.number()]).transform(Number),
  deliveryRadius:     z.union([z.string(), z.number()]).transform(Number).default(3),
  coveredPincodes:    z.string().trim().optional(),
  paymentCOD:         z.boolean().optional().default(false),
  paymentBankTransfer:z.boolean().optional().default(false),
  paymentCard:        z.boolean().optional().default(false)
});

/* ---------- Legacy single-step GST schema (kept for backward compat) ---------- */
export const gstinSchema = z.object({
  gstin:         z.string().trim().toUpperCase().regex(GSTIN_REGEX, 'Invalid GSTIN format'),
  businessName:  z.string().trim().optional(),
  contactPerson: z.string().trim().optional(),
  phone:         z.string().trim().optional(),
  address:       z.string().trim().optional(),
  pincode:       z.string().trim().optional(),
  category:      z.string().trim().optional(),
  mov:           z.union([z.string(), z.number()]).optional(),
  capacity:      z.string().trim().optional()
});

/* ---------- Middleware factory ---------- */
export const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors.map((e) => ({
          field:   e.path.join('.'),
          message: e.message
        }))
      });
    }
    return res.status(400).json({ success: false, message: 'Malformed request data' });
  }
};
