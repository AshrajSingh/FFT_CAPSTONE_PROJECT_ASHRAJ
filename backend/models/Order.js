import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name:      { type: String, required: true },
  qty:       { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  unit:      { type: String, default: 'kg' },
  total:     { type: Number, required: true }
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber:     { type: String, required: true, unique: true },
    retailerId:      { type: String, required: true },
    retailerName:    { type: String, default: 'Retailer Store' },
    wholesalerId:    { type: String, default: 'wholesaler_default' },
    wholesalerName:  { type: String, default: 'Balaji Agro Mills' },
    items:           [orderItemSchema],
    subtotal:        { type: Number, required: true, min: 0 },
    tax:             { type: Number, default: 0 },
    totalAmount:     { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'processing', 'dispatched', 'delivered', 'cancelled'],
      default: 'pending'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'cod'],
      default: 'cod'
    },
    deliveryAddress: { type: String, default: '' },
    deliveryDate:    { type: Date }
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

/* ---------- Seed Data & In-Memory Store for Orders ---------- */
const now = new Date();
const daysAgo = (d) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000).toISOString();

export const INITIAL_ORDERS = [
  {
    id: 'ord_101',
    orderNumber: 'SL-ORD-7401',
    retailerId: 'demo_retailer',
    retailerName: 'Rajesh Supermarket & Provisions',
    wholesalerId: 'demo_wholesaler',
    wholesalerName: 'Balaji Agro Mills',
    items: [
      { productId: 'prod_1', name: 'Basmati Rice (Extra Long)', qty: 25, unitPrice: 85, unit: 'kg', total: 2125 },
      { productId: 'prod_3', name: 'Premium Wheat Flour (Atta)', qty: 50, unitPrice: 40, unit: 'kg', total: 2000 }
    ],
    subtotal: 4125,
    tax: 206,
    totalAmount: 4331,
    status: 'dispatched',
    paymentStatus: 'paid',
    deliveryAddress: 'Shop #14, APMC Market Yard, Bengaluru - 560022',
    createdAt: daysAgo(1)
  },
  {
    id: 'ord_102',
    orderNumber: 'SL-ORD-7402',
    retailerId: 'demo_retailer',
    retailerName: 'Rajesh Supermarket & Provisions',
    wholesalerId: 'demo_wholesaler',
    wholesalerName: 'Ravi Oil Industries',
    items: [
      { productId: 'prod_2', name: 'Refined Sunflower Oil 1 L', qty: 40, unitPrice: 92, unit: 'lt', total: 3680 }
    ],
    subtotal: 3680,
    tax: 184,
    totalAmount: 3864,
    status: 'processing',
    paymentStatus: 'pending',
    deliveryAddress: 'Shop #14, APMC Market Yard, Bengaluru - 560022',
    createdAt: daysAgo(2)
  },
  {
    id: 'ord_103',
    orderNumber: 'SL-ORD-7403',
    retailerId: 'demo_retailer',
    retailerName: 'Rajesh Supermarket & Provisions',
    wholesalerId: 'demo_wholesaler',
    wholesalerName: 'Golden Grain Mills',
    items: [
      { productId: 'prod_4', name: 'Toor Dal (Split Pigeon Pea)', qty: 30, unitPrice: 95, unit: 'kg', total: 2850 }
    ],
    subtotal: 2850,
    tax: 142,
    totalAmount: 2992,
    status: 'dispatched',
    paymentStatus: 'cod',
    deliveryAddress: 'Shop #14, APMC Market Yard, Bengaluru - 560022',
    createdAt: daysAgo(3)
  },
  {
    id: 'ord_104',
    orderNumber: 'SL-ORD-7389',
    retailerId: 'demo_retailer',
    retailerName: 'Rajesh Supermarket & Provisions',
    wholesalerId: 'demo_wholesaler',
    wholesalerName: 'Shalimar Agro Traders',
    items: [
      { productId: 'prod_6', name: 'Masoor Dal (Whole Red)', qty: 60, unitPrice: 75, unit: 'kg', total: 4500 },
      { productId: 'prod_9', name: 'Moong Dal (Washed)', qty: 40, unitPrice: 90, unit: 'kg', total: 3600 }
    ],
    subtotal: 8100,
    tax: 405,
    totalAmount: 8505,
    status: 'delivered',
    paymentStatus: 'paid',
    deliveryAddress: 'Shop #14, APMC Market Yard, Bengaluru - 560022',
    createdAt: daysAgo(7)
  },
  {
    id: 'ord_105',
    orderNumber: 'SL-ORD-7350',
    retailerId: 'retailer_koramangala',
    retailerName: 'Annapurna Stores',
    wholesalerId: 'demo_wholesaler',
    wholesalerName: 'Balaji Agro Mills',
    items: [
      { productId: 'prod_1', name: 'Basmati Rice (Extra Long)', qty: 100, unitPrice: 85, unit: 'kg', total: 8500 }
    ],
    subtotal: 8500,
    tax: 425,
    totalAmount: 8925,
    status: 'pending',
    paymentStatus: 'pending',
    deliveryAddress: 'Koramangala 4th Block, Bengaluru',
    createdAt: daysAgo(0)
  },
  {
    id: 'ord_106',
    orderNumber: 'SL-ORD-7341',
    retailerId: 'retailer_indiranagar',
    retailerName: 'Sri Krishna Kirana',
    wholesalerId: 'demo_wholesaler',
    wholesalerName: 'Balaji Agro Mills',
    items: [
      { productId: 'prod_3', name: 'Premium Wheat Flour (Atta)', qty: 120, unitPrice: 40, unit: 'kg', total: 4800 }
    ],
    subtotal: 4800,
    tax: 240,
    totalAmount: 5040,
    status: 'processing',
    paymentStatus: 'paid',
    deliveryAddress: '100ft Road, Indiranagar, Bengaluru',
    createdAt: daysAgo(1)
  },
  {
    id: 'ord_107',
    orderNumber: 'SL-ORD-7299',
    retailerId: 'retailer_jayanagar',
    retailerName: 'Mahalaxmi Wholesale & Retail',
    wholesalerId: 'demo_wholesaler',
    wholesalerName: 'Balaji Agro Mills',
    items: [
      { productId: 'prod_1', name: 'Basmati Rice (Extra Long)', qty: 250, unitPrice: 85, unit: 'kg', total: 21250 },
      { productId: 'prod_2', name: 'Refined Sunflower Oil 1 L', qty: 200, unitPrice: 92, unit: 'lt', total: 18400 }
    ],
    subtotal: 39650,
    tax: 1982,
    totalAmount: 41632,
    status: 'delivered',
    paymentStatus: 'paid',
    deliveryAddress: '4th Block, Jayanagar, Bengaluru',
    createdAt: daysAgo(12)
  }
];

export const inMemoryOrders = new Map(INITIAL_ORDERS.map(o => [o.id, { ...o }]));

export default Order;
