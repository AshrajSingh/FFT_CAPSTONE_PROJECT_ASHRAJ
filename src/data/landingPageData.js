import {
  MapPin,
  Scale as Scales,
  ShoppingCart,
  ShieldCheck,
  Layers,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';

export const userFlowData = {
  retailer: [
    {
      step: '01',
      action: 'Click Here: Set Location',
      title: '1. Enter Your Shop Pin Code',
      desc: 'Enter your store pin code or select your local APMC yard. StockLink automatically finds licensed grain mills and FMCG distributors delivering directly to your shop.',
      preview: 'Pin: 411028 (APMC Yard) • 38 Active Wholesalers',
      icon: MapPin,
      ctaAction: 'Pin Code Selected (411028 - Pune APMC)'
    },
    {
      step: '02',
      action: 'Search & Compare',
      title: '2. Compare Live Mill Rates',
      desc: 'Click on any staple (Rice, Oil, Wheat, Sugar, Pulses). Compare today’s mandi benchmark against wholesale bulk slab prices with verified live stock.',
      preview: 'Basmati Rice: Save ₹250/bag • 140 Bags In Stock',
      icon: Scales,
      ctaAction: 'Live Rates Compared: Basmati Rice (Save ₹250/bag)'
    },
    {
      step: '03',
      action: 'Auto-Batch Cart',
      title: '3. Auto-Split Cart & Check MOQ',
      desc: 'Click "+ Add" across multiple suppliers. StockLink automatically batches orders by supplier and validates minimum order quantity rules in real time.',
      preview: 'Split-Cart: Sai Mills (2 SKUs) + National Oil (1 SKU)',
      icon: ShoppingCart,
      ctaAction: 'Split-Cart Batched & MOQ Verified (100% Validated)'
    },
    {
      step: '04',
      action: 'Confirm & Receive',
      title: '4. Lock Stock & Track Delivery',
      desc: 'Click "Direct Checkout". Stock is atomically reserved at the mill with zero risk of ghosting or cancelation. Track your mandi dispatch with GST bills.',
      preview: 'Order #SL-8842 Confirmed • Mandi Gate Dispatch Live',
      icon: CheckCircle2,
      ctaAction: 'Order #SL-8842 Dispatched with Doorstep Live Tracking'
    }
  ],
  wholesaler: [
    {
      step: '01',
      action: 'Click Here: Register',
      title: '1. Onboard Warehouse & GST',
      desc: 'Complete quick 2-minute registration with your warehouse location, APMC trade license, and delivery coverage radius.',
      preview: 'Verified Supplier Badge • GSTIN & APMC Mandi License Active',
      icon: ShieldCheck,
      ctaAction: 'Warehouse Verified (Mandi Yard Sector 19)'
    },
    {
      step: '02',
      action: 'List Inventory',
      title: '2. Set Base Rates & Tier Slabs',
      desc: 'Enter your base wholesale rates, live warehouse quantity, and bulk tier slabs (1-10, 11-50, 50+ bags). Updates broadcast to all local stores.',
      preview: '6 Active SKUs Listed • Real-time Sync to 120+ Retailers',
      icon: Layers,
      ctaAction: 'Bulk Tier Slabs Published (1-10, 11-50, 50+ bags)'
    },
    {
      step: '03',
      action: 'Automated Orders',
      title: '3. Receive MOQ-Compliant Orders',
      desc: 'Incoming retailer orders are pre-checked against your minimum order quantities. No phone haggling, no under-volume orders, and zero manual quote reconciliations.',
      preview: 'Order Batch #WB-410 Received • 170 Bags (MOQ Validated)',
      icon: TrendingUp,
      ctaAction: 'Batch Order #WB-410 Received (MOQ Pre-Validated)'
    },
    {
      step: '04',
      action: 'Dispatch & Settle',
      title: '4. Dispatch Goods & Receive T+1 Payout',
      desc: 'Print automated pick-and-pack slips, assign delivery vehicle, and get direct digital settlements upon confirmed delivery receipt at the shop.',
      preview: 'Direct Bank Settlement • Automated Low-Stock Reorder Alerts',
      icon: CheckCircle2,
      ctaAction: 'Vehicle Dispatched (MH-12-Q-4029) • Settlement Scheduled'
    }
  ]
};

export const matrixProducts = [
  {
    id: 1,
    name: 'Basmati Rice Super (50kg)',
    category: 'grains',
    storePrice: '₹3,400',
    wholesalePrice: '₹3,150',
    diff: '+₹250 (7.4%)',
    stock: '140 Bags',
    supplier: 'Sai Grain Mills'
  },
  {
    id: 2,
    name: 'Sunflower Refined Oil (15L)',
    category: 'oils',
    storePrice: '₹1,850',
    wholesalePrice: '₹1,690',
    diff: '+₹160 (8.6%)',
    stock: '85 Tins',
    supplier: 'National Oil Depot'
  },
  {
    id: 3,
    name: 'MP Sharbati Wheat Flour (50kg)',
    category: 'grains',
    storePrice: '₹1,550',
    wholesalePrice: '₹1,420',
    diff: '+₹130 (8.4%)',
    stock: '220 Bags',
    supplier: 'Sai Grain Mills'
  },
  {
    id: 4,
    name: 'Pure Cane Sugar M-30 (50kg)',
    category: 'grains',
    storePrice: '₹2,100',
    wholesalePrice: '₹1,950',
    diff: '+₹150 (7.1%)',
    stock: '95 Bags',
    supplier: 'Deccan Sugars'
  },
  {
    id: 5,
    name: 'Desi Toor Dal Premium (50kg)',
    category: 'pulses',
    storePrice: '₹6,800',
    wholesalePrice: '₹6,250',
    diff: '+₹550 (8.1%)',
    stock: '40 Bags',
    supplier: 'Kisan Agro Traders'
  }
];

export const wholesalerInventory = [
  {
    id: 'SKU-101',
    name: 'Basmati Rice Super (50kg)',
    basePrice: '₹3,150.00',
    stock: '120 Bags',
    tier: '1-10 [₹3150] | 11-50 [₹3080] | 51+ [₹2990]',
    status: 'Optimal',
    statusType: 'optimal'
  },
  {
    id: 'SKU-102',
    name: 'Sunflower Refined Oil (15L)',
    basePrice: '₹1,690.00',
    stock: '85 Tins',
    tier: '1-5 [₹1690] | 6-20 [₹1640] | 21+ [₹1590]',
    status: 'Optimal',
    statusType: 'optimal'
  },
  {
    id: 'SKU-103',
    name: 'MP Sharbati Wheat (50kg)',
    basePrice: '₹1,420.00',
    stock: '220 Bags',
    tier: '1-20 [₹1420] | 21-100 [₹1380] | 101+ [₹1340]',
    status: 'Optimal',
    statusType: 'optimal'
  },
  {
    id: 'SKU-104',
    name: 'Premium Toor Dal (50kg)',
    basePrice: '₹6,250.00',
    stock: '18 Bags',
    tier: '1-5 [₹6250] | 6-15 [₹6100] | 16+ [₹5980]',
    status: 'Low Stock',
    statusType: 'low'
  },
  {
    id: 'SKU-105',
    name: 'Refined Sugar M-30 (50kg)',
    basePrice: '₹1,950.00',
    stock: '95 Bags',
    tier: '1-10 [₹1950] | 11-50 [₹1890] | 51+ [₹1840]',
    status: 'Optimal',
    statusType: 'optimal'
  },
  {
    id: 'SKU-106',
    name: 'Kabuli Chana Bold (25kg)',
    basePrice: '₹3,600.00',
    stock: '4 Bags',
    tier: '1-5 [₹3600] | 6-20 [₹3480] | 21+ [₹3350]',
    status: 'Critical Alert',
    statusType: 'low'
  }
];

export const retailerMockupData = {
  market: 'APMC Yard, Sector 19',
  initialCartItemsCount: 3,
  cartGroups: [
    {
      wholesaler: 'Sai Grain Mills',
      skuCount: '2 SKUs (170 Bags)',
      total: '₹4,570 • MOQ Met'
    },
    {
      wholesaler: 'National Oil Depot',
      skuCount: '1 SKU (85 Tins)',
      total: '₹1,690 • MOQ Met'
    }
  ],
  total: '₹6,260',
  savings: '₹410'
};

export const wholesalerMetrics = {
  revenue: '₹12.4L',
  revenueChange: '+28.4% month-over-month volume from verified retail buyers',
  lowStockAlertCount: 4,
  lowStockDescription:
    'SKUs reached critical threshold. Automatic re-order triggers broadcast to supply partners.'
};
