import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true, trim: true },
    supplierId:   { type: String, default: 'wholesaler_default' },
    supplierName: { type: String, default: 'Balaji Agro Mills', trim: true },
    location:     { type: String, default: 'Yeshwanthpur, Bengaluru', trim: true },
    basePrice:    { type: Number, required: true, min: 0 },
    stock:        { type: Number, required: true, min: 0, default: 100 },
    unit:         { type: String, default: 'kg', trim: true },
    bulkMin:      { type: Number, default: 10 },
    icon:         { type: String, default: 'generic' },
    tag:          { type: String, default: 'Grains' },
    rating:       { type: Number, default: 4.5 },
    apmcBenchmark:{ type: Number, default: 0 },
    status:       { type: String, enum: ['active', 'low_stock', 'out_of_stock', 'inactive'], default: 'active' }
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

/* ---------- Seed Data & In-Memory Store for Resilient Fallback ---------- */
export const INITIAL_PRODUCTS = [
  { id: 'prod_1',  name: 'Basmati Rice (Extra Long)',   supplierName: 'Balaji Agro Mills',         location: 'Yeshwanthpur, Bengaluru', stock: 450, basePrice: 85,  unit: 'kg', bulkMin: 10,  icon: 'grain', tag: 'Grains', rating: 4.8, apmcBenchmark: 95 },
  { id: 'prod_2',  name: 'Refined Sunflower Oil 1 L',   supplierName: 'Ravi Oil Industries',        location: 'Vashi, Navi Mumbai',      stock: 320, basePrice: 92,  unit: 'lt', bulkMin: 12,  icon: 'oil',   tag: 'Dairy',  rating: 4.6, apmcBenchmark: 105 },
  { id: 'prod_3',  name: 'Premium Wheat Flour (Atta)',   supplierName: 'Golden Grain Mills',         location: 'Whitefield, Bengaluru',   stock: 600, basePrice: 40,  unit: 'kg', bulkMin: 25,  icon: 'grain', tag: 'Grains', rating: 4.9, apmcBenchmark: 46 },
  { id: 'prod_4',  name: 'Toor Dal (Split Pigeon Pea)',  supplierName: 'Shalimar Agro Traders',      location: 'Dadar, Mumbai',           stock: 280, basePrice: 95,  unit: 'kg', bulkMin: 10,  icon: 'grain', tag: 'Spices', rating: 4.7, apmcBenchmark: 110 },
  { id: 'prod_5',  name: 'Groundnut Oil (Cold Press)',   supplierName: 'Heritage Oils Pvt Ltd',      location: 'Pune APMC',               stock: 150, basePrice: 148, unit: 'lt', bulkMin: 10,  icon: 'oil',   tag: 'Dairy',  rating: 4.5, apmcBenchmark: 165 },
  { id: 'prod_6',  name: 'Masoor Dal (Whole Red)',        supplierName: 'Krishana Dal Mills',         location: 'Byculla, Mumbai',         stock: 390, basePrice: 75,  unit: 'kg', bulkMin: 15,  icon: 'grain', tag: 'Grains', rating: 4.7, apmcBenchmark: 86 },
  { id: 'prod_7',  name: 'PP Woven Bags (50 kg)',         supplierName: 'Bharat Packaging Works',     location: 'Chembur, Mumbai',         stock: 1200,basePrice: 18,  unit: 'pc', bulkMin: 50,  icon: 'pack',  tag: 'Spices', rating: 4.4, apmcBenchmark: 22 },
  { id: 'prod_8',  name: 'Urad Dal (White Split)',        supplierName: 'Deccan Grains Export',       location: 'Pune Mandi',              stock: 210, basePrice: 98,  unit: 'kg', bulkMin: 10,  icon: 'grain', tag: 'Grains', rating: 4.6, apmcBenchmark: 112 },
  { id: 'prod_9',  name: 'Moong Dal (Washed)',            supplierName: 'Sai Agro Processors',        location: 'Nagpur APMC',             stock: 340, basePrice: 90,  unit: 'kg', bulkMin: 10,  icon: 'grain', tag: 'Grains', rating: 4.8, apmcBenchmark: 104 },
  { id: 'prod_10', name: 'HDPE Shrink Film Roll',         supplierName: 'Sudarshan Polymers Ltd',     location: 'Turbhe, Navi Mumbai',     stock: 8,   basePrice: 225, unit: 'kg', bulkMin: 25,  icon: 'pack',  tag: 'Spices', rating: 4.3, apmcBenchmark: 250 },
  { id: 'prod_11', name: 'Mustard Oil (Kachi Ghani)',     supplierName: 'Rajasthan Oils Cooperative', location: 'Jaipur APMC',             stock: 180, basePrice: 132, unit: 'lt', bulkMin: 10,  icon: 'oil',   tag: 'Dairy',  rating: 4.9, apmcBenchmark: 150 },
  { id: 'prod_12', name: 'Chana Dal (Bengal Gram)',       supplierName: 'Central India Dal Mills',    location: 'Nagpur APMC',             stock: 9,   basePrice: 68,  unit: 'kg', bulkMin: 20,  icon: 'grain', tag: 'Grains', rating: 4.6, apmcBenchmark: 78 }
];

export const inMemoryProducts = new Map(INITIAL_PRODUCTS.map(p => [p.id, { ...p }]));

export default Product;
