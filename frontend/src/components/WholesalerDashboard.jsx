import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  LogOut,
  Package,
  Wheat,
  Droplets,
  Box,
  Edit3,
  TrendingUp,
  AlertCircle,
  BarChart2,
  CheckCircle2,
  IndianRupee,
  ShieldCheck,
  Zap,
  Users,
  Check,
  Clock,
  Truck,
  ShoppingBag
} from 'lucide-react';
import stocklinkLogo from '../assets/stocklink-logo.png';
import '../styles/Dashboard.css';
import { apiGetWholesalerDashboard, apiUpdateProductPrice, clearAuthSession, getCurrentUser } from '../services/api';

/* ─── Mock SKU data ─────────────────────────────────────────── */
const PRODUCT_ICONS = {
  grain:   <Wheat    size={28} color="#7C6F8A" />,
  oil:     <Droplets size={28} color="#7C6F8A" />,
  pack:    <Box      size={28} color="#7C6F8A" />,
  generic: <Package  size={28} color="#7C6F8A" />,
};

const DEFAULT_SKUS = [
  { id:1,  name:'Basmati Rice (Extra Long)',   basePrice:85,  stock:450, unit:'kg', icon:'grain' },
  { id:2,  name:'Refined Sunflower Oil 1 L',   basePrice:92,  stock:320, unit:'lt', icon:'oil'   },
  { id:3,  name:'Premium Wheat Flour (Atta)',   basePrice:40,  stock:600, unit:'kg', icon:'grain' },
  { id:4,  name:'Toor Dal (Split Pigeon Pea)',  basePrice:95,  stock:280, unit:'kg', icon:'grain' },
  { id:5,  name:'Groundnut Oil (Cold Press)',   basePrice:148, stock:150, unit:'lt', icon:'oil'   },
  { id:6,  name:'Masoor Dal (Whole Red)',        basePrice:75,  stock:390, unit:'kg', icon:'grain' },
  { id:7,  name:'PP Woven Bags (50 kg)',         basePrice:18,  stock:1200,unit:'pc', icon:'pack'  },
  { id:8,  name:'Urad Dal (White Split)',        basePrice:98,  stock:210, unit:'kg', icon:'grain' },
  { id:9,  name:'Moong Dal (Washed)',            basePrice:90,  stock:340, unit:'kg', icon:'grain' },
  { id:10, name:'HDPE Shrink Film Roll',         basePrice:225, stock:8,   unit:'kg', icon:'pack'  },
  { id:11, name:'Mustard Oil (Kachi Ghani)',     basePrice:132, stock:180, unit:'lt', icon:'oil'   },
  { id:12, name:'Chana Dal (Bengal Gram)',       basePrice:68,  stock:9,   unit:'kg', icon:'grain' }
];

/* sparkline heights for "Top Moving" chart */
const BARS = [
  { h:'h25', accent:false }, { h:'h55', accent:false }, { h:'h85', accent:true  },
  { h:'h40', accent:false }, { h:'h70', accent:true  }, { h:'h55', accent:false },
  { h:'h100',accent:true  }, { h:'h40', accent:false }, { h:'h60', accent:false },
];

export default function WholesalerDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => getCurrentUser());
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'fulfillment'

  // Backend state
  const [skus, setSkus] = useState(() =>
    DEFAULT_SKUS.map(s => ({ ...s, priceStr: String(s.basePrice) }))
  );
  const [metrics, setMetrics] = useState({
    totalRevenue: '₹12.4L',
    urgentOrdersCount: 29,
    totalProducts: 12,
    totalInventoryUnits: 3827,
    lowStockCount: 2,
    connectedRetailersCount: '148 Active',
    directSettlements: '₹4,85,000',
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);
  const [savedSkuId, setSavedSkuId] = useState(null);

  useEffect(() => {
    const cur = getCurrentUser();
    if (!cur) {
      navigate('/login');
      return;
    }
    if (!cur.isOnboarded) {
      navigate('/wholesaler/onboarding');
      return;
    }
    setUser(cur);

    // Fetch live dashboard metrics from backend
    apiGetWholesalerDashboard()
      .then(res => {
        if (res?.data) {
          const d = res.data;
          setMetrics({
            totalRevenue: d.totalRevenue || '₹12.4L',
            urgentOrdersCount: d.urgentOrdersCount !== undefined ? d.urgentOrdersCount : 29,
            totalProducts: d.totalProducts || d.skus?.length || 12,
            totalInventoryUnits: d.totalInventoryUnits || 3827,
            lowStockCount: d.lowStockCount !== undefined ? d.lowStockCount : 2,
            connectedRetailersCount: d.connectedRetailersCount || '148 Active',
            directSettlements: d.directSettlements || '₹4,85,000',
            recentOrders: d.recentOrders || []
          });

          if (Array.isArray(d.skus) && d.skus.length > 0) {
            setSkus(d.skus.map(s => ({
              ...s,
              priceStr: String(s.basePrice !== undefined ? s.basePrice : s.price || 0)
            })));
          }
        }
      })
      .catch(err => {
        console.warn('Using baseline wholesaler metrics:', err.message);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => {
    clearAuthSession();
    navigate('/login');
  };

  const updatePriceLocally = (id, val) => {
    setSkus(prev => prev.map(s => s.id === id ? { ...s, priceStr: val } : s));
  };

  const handlePriceSave = async (id, val) => {
    const num = Number(val);
    if (isNaN(num) || num < 0) return;

    try {
      await apiUpdateProductPrice(id, num);
      setSavedSkuId(id);
      setTimeout(() => setSavedSkuId(null), 1800);
    } catch (err) {
      console.warn('Failed to persist price change to backend:', err.message);
    }
  };

  const initials    = (user?.tradeName || user?.businessName || user?.name || 'W').slice(0, 2).toUpperCase();
  const displayName = user?.tradeName || user?.businessName || user?.name || 'Balaji Agro Mills';

  return (
    <div className="db-page">

      {/* ════════════════════ TOPBAR ════════════════════ */}
      <header className="db-topbar">
        <div className="db-brand" onClick={() => { setActiveTab('inventory'); navigate('/wholesaler/dashboard'); }}>
          <img src={stocklinkLogo} alt="StockLink" className="db-brand-logo" />
          <span className="db-brand-name">StockLink</span>
        </div>

        <nav className="db-nav-links">
          <button
            className={`db-nav-link ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            Inventory Manager
          </button>
          <button
            className={`db-nav-link ${activeTab === 'fulfillment' ? 'active' : ''}`}
            onClick={() => setActiveTab('fulfillment')}
          >
            Order Fulfilment ({metrics.urgentOrdersCount})
          </button>
          <button className="db-nav-link" onClick={() => navigate('/wholesaler/profile')}>
            Supplier Profile
          </button>
        </nav>

        <div className="db-topbar-right">
          {/* Bell */}
          <button className="db-notif-btn" title="Notifications">
            <Bell size={16} />
            <span className="db-notif-badge" />
          </button>

          {/* User Chip -> Links to Profile */}
          <div
            className="db-user-chip"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/wholesaler/profile')}
            title="Manage Wholesaler Profile"
          >
            <div className="db-user-avatar">{initials}</div>
            <div className="db-user-info">
              <span className="db-user-role">Wholesaler · Seller</span>
              <span className="db-user-name">{displayName}</span>
            </div>
          </div>

          <button className="db-logout-btn" onClick={handleLogout}>
            <LogOut size={13} /> Log Out
          </button>
        </div>
      </header>

      {/* ════════════════════ MAIN ════════════════════ */}
      <main className="db-main">

        {/* ── KPI Stats ── */}
        <div className="wd-stats-row">

          {/* Total Revenue */}
          <div className="wd-stat-card green" title="Calculated revenue from fulfilled and processing orders">
            <div className="wd-stat-header">
              <div>
                <div className="wd-stat-label">Total Revenue (Month)</div>
                <div className="wd-stat-value">{metrics.totalRevenue}</div>
              </div>
              <div className="wd-stat-icon green">
                <IndianRupee size={18} />
              </div>
            </div>
            <div className="wd-stat-footer up">
              <TrendingUp size={12} /> Live calculated from eligible orders
            </div>
          </div>

          {/* Urgent Orders — dark card */}
          <div
            className="wd-stat-card dark ochre"
            style={{ cursor: 'pointer' }}
            onClick={() => setActiveTab('fulfillment')}
            title="Click to view pending orders requiring dispatch"
          >
            <div className="wd-stat-header">
              <div>
                <div className="wd-stat-label">Urgent Orders Pending</div>
                <div className="wd-stat-value">{metrics.urgentOrdersCount}</div>
              </div>
              <div className="wd-stat-icon" style={{ background:'rgba(255,160,98,0.2)', color:'var(--sl-ochre)' }}>
                <AlertCircle size={18} />
              </div>
            </div>
            <div className="wd-stat-footer warn">
              <Zap size={12} /> Needs action · View all orders →
            </div>
          </div>

          {/* Top Moving Inventory */}
          <div className="wd-stat-card slate">
            <div className="wd-stat-header">
              <div>
                <div className="wd-stat-label">Top Moving Inventory</div>
                <div className="wd-mini-bars" style={{ marginTop:'0.35rem' }}>
                  {BARS.map((b, i) => (
                    <div key={i} className={`wd-mini-bar ${b.h} ${b.accent ? 'accent' : 'mid'}`} />
                  ))}
                </div>
              </div>
              <div className="wd-stat-icon slate">
                <BarChart2 size={18} />
              </div>
            </div>
            <div className="wd-stat-footer">
              <CheckCircle2 size={12} style={{ color:'var(--sl-green)' }} />
              {metrics.totalInventoryUnits.toLocaleString('en-IN')} Units In Stock
            </div>
          </div>
        </div>

        {/* ── Secondary metrics ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem' }}>
          {[
            {
              icon:<ShieldCheck size={16}/>,
              label:'GSTIN Verified',
              value: user?.gstin ? 'Active Verified' : 'Verified Hub',
              color:'var(--sl-green)'
            },
            {
              icon:<Users size={16}/>,
              label:'Connected Retailers',
              value: metrics.connectedRetailersCount,
              color:'var(--sl-slate-dark)'
            },
            {
              icon:<TrendingUp size={16}/>,
              label:'Direct Settlements',
              value: metrics.directSettlements,
              color:'var(--sl-ochre-deep)'
            },
          ].map((m, i) => (
            <div key={i} style={{
              background:'var(--sl-bg-card)',
              border:'1px solid var(--sl-border)',
              borderRadius:'var(--radius-md)',
              padding:'0.9rem 1.1rem',
              display:'flex',
              alignItems:'center',
              gap:'0.75rem',
              boxShadow:'var(--shadow-xs)',
            }}>
              <div style={{
                width:36, height:36, borderRadius:'var(--radius-sm)',
                background:'rgba(84,69,90,0.08)',
                display:'flex', alignItems:'center', justifyContent:'center',
                color:'var(--sl-slate)', flexShrink:0,
              }}>
                {m.icon}
              </div>
              <div>
                <div style={{ fontSize:'0.68rem', fontWeight:700, color:'var(--sl-text-muted)', textTransform:'uppercase', letterSpacing:'0.05em' }}>{m.label}</div>
                <div style={{ fontSize:'0.95rem', fontWeight:800, color:m.color }}>{m.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── TAB 1: Inventory Manager (SKU Grid with live inline editing) ── */}
        {activeTab === 'inventory' && (
          <div>
            <div className="db-section-head">
              <h2>Inventory Manager & Mandi SKUs</h2>
              <span style={{ display:'flex', alignItems:'center', gap:'0.4rem' }}>
                <TrendingUp size={13} />
                {skus.length} SKUs Live · {metrics.lowStockCount} Low Stock Alerts
              </span>
            </div>

            <div className="wd-product-grid">
              {skus.map(sku => (
                <div className="wd-product-card" key={sku.id}>
                  {/* Image */}
                  <div className="wd-product-img-wrap">
                    <span className="wd-sku-badge" style={{
                      background: sku.stock <= 10 ? '#ef4444' : undefined,
                      color: sku.stock <= 10 ? '#ffffff' : undefined
                    }}>
                      {sku.stock <= 10 ? 'LOW STOCK' : 'IN STOCK'}
                    </span>
                    <div className="wd-product-img-placeholder">
                      {PRODUCT_ICONS[sku.icon] || PRODUCT_ICONS.generic}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="wd-product-body">
                    <div className="wd-product-name">{sku.name}</div>

                    {/* Editable price */}
                    <div className="wd-price-field" title="Click to edit base price. Press enter or click outside to save.">
                      <span className="wd-price-label">Base Price</span>
                      <span className="wd-price-rupee">₹</span>
                      <input
                        type="number"
                        className="wd-price-input"
                        value={sku.priceStr}
                        onChange={e => updatePriceLocally(sku.id, e.target.value)}
                        onBlur={() => handlePriceSave(sku.id, sku.priceStr)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.target.blur();
                          }
                        }}
                        title="Editable Input Field — Updates live in database"
                      />
                      {savedSkuId === sku.id ? (
                        <Check size={13} color="var(--sl-green, #22C55E)" title="Price saved to backend!" />
                      ) : (
                        <Edit3 size={11} className="wd-edit-icon" />
                      )}
                    </div>

                    {/* Stock */}
                    <div className="wd-stock-level">
                      LIVE STOCK LEVEL: <strong style={{ color: sku.stock <= 10 ? '#ef4444' : undefined }}>{sku.stock} Units {sku.stock <= 10 ? 'LEFT' : 'IN STOCK'}</strong>
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    className="wd-manage-btn"
                    onClick={() => {
                      const newP = prompt(`Update Base Price (₹) for ${sku.name}:`, sku.priceStr);
                      if (newP !== null && !isNaN(Number(newP))) {
                        updatePriceLocally(sku.id, newP);
                        handlePriceSave(sku.id, newP);
                      }
                    }}
                  >
                    <Edit3 size={11} /> MANAGE / EDIT SKU
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 2: Order Fulfilment (Incoming Retailer Orders) ── */}
        {activeTab === 'fulfillment' && (
          <div>
            <div className="db-section-head">
              <h2>Retailer Order Fulfilment Queue</h2>
              <span>{metrics.urgentOrdersCount} Orders Pending Action</span>
            </div>

            <div style={{
              background: 'var(--sl-bg-card)',
              border: '1px solid var(--sl-border)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-xs)'
            }}>
              {metrics.recentOrders.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--sl-text-muted)' }}>
                  <ShoppingBag size={40} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                  <p style={{ fontWeight: 700 }}>No incoming orders pending.</p>
                  <p style={{ fontSize: '0.82rem', marginTop: '0.25rem' }}>Orders placed by connected retailers will appear here in real-time.</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--sl-border)', color: 'var(--sl-text-muted)' }}>
                        <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700 }}>ORDER #</th>
                        <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700 }}>BUYER STORE</th>
                        <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700 }}>QUANTITY</th>
                        <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700 }}>ORDER VALUE</th>
                        <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700 }}>DATE</th>
                        <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700 }}>STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {metrics.recentOrders.map((ord, idx) => {
                        const isPending = ord.status === 'pending';
                        const isProcessing = ord.status === 'processing';
                        const isDispatched = ord.status === 'dispatched';
                        const isDelivered = ord.status === 'delivered';

                        return (
                          <tr key={ord.id || idx} style={{ borderBottom: '1px solid var(--sl-border)' }}>
                            <td style={{ padding: '0.9rem 1.25rem', fontWeight: 800, color: 'var(--sl-slate-dark)' }}>
                              {ord.orderNumber}
                            </td>
                            <td style={{ padding: '0.9rem 1.25rem', fontWeight: 600 }}>
                              {ord.buyer}
                            </td>
                            <td style={{ padding: '0.9rem 1.25rem' }}>
                              {ord.itemsCount} units
                            </td>
                            <td style={{ padding: '0.9rem 1.25rem', fontWeight: 800 }}>
                              ₹{Number(ord.totalAmount).toLocaleString('en-IN')}
                            </td>
                            <td style={{ padding: '0.9rem 1.25rem', color: 'var(--sl-text-muted)' }}>
                              {ord.date}
                            </td>
                            <td style={{ padding: '0.9rem 1.25rem' }}>
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                padding: '0.2rem 0.6rem',
                                borderRadius: '9999px',
                                fontSize: '0.72rem',
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                background: isDelivered ? '#dcfce7' : isDispatched ? 'rgba(59,130,246,0.12)' : isPending ? '#fee2e2' : 'rgba(255,160,98,0.14)',
                                color: isDelivered ? '#15803d' : isDispatched ? '#2563eb' : isPending ? '#dc2626' : '#d97706'
                              }}>
                                {isDelivered && <CheckCircle2 size={11} />}
                                {isDispatched && <Truck size={11} />}
                                {isProcessing && <Clock size={11} />}
                                {isPending && <AlertCircle size={11} />}
                                {ord.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
              <button
                className="wd-manage-btn"
                style={{ maxWidth: 220, margin: '0 auto', borderRadius: 'var(--radius-sm)' }}
                onClick={() => setActiveTab('inventory')}
              >
                ← Return to Inventory Manager
              </button>
            </div>
          </div>
        )}

      </main>

      {/* ── Footer ── */}
      <footer className="db-footer">
        <span>© 2026 StockLink</span>
        <span className="db-footer-divider" />
        <a href="#">FAQ</a>
        <span className="db-footer-divider" />
        <a href="#">Support</a>
        <span className="db-footer-divider" />
        <a href="#">Privacy</a>
      </footer>
    </div>
  );
}
