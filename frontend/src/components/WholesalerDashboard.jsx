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
} from 'lucide-react';
import stocklinkLogo from '../assets/stocklink-logo.png';
import '../styles/Dashboard.css';

/* ─── Mock SKU data ─────────────────────────────────────────── */
const PRODUCT_ICONS = {
  grain:   <Wheat    size={28} color="#7C6F8A" />,
  oil:     <Droplets size={28} color="#7C6F8A" />,
  pack:    <Box      size={28} color="#7C6F8A" />,
  generic: <Package  size={28} color="#7C6F8A" />,
};

const INITIAL_SKUS = [
  { id:1,  name:'Basmati Rice (Extra Long)',   basePrice:85,  stock:450, unit:'kg', icon:'grain' },
  { id:2,  name:'Refined Sunflower Oil 1 L',   basePrice:92,  stock:320, unit:'lt', icon:'oil'   },
  { id:3,  name:'Premium Wheat Flour (Atta)',   basePrice:40,  stock:600, unit:'kg', icon:'grain' },
  { id:4,  name:'Toor Dal (Split Pigeon Pea)',  basePrice:95,  stock:280, unit:'kg', icon:'grain' },
  { id:5,  name:'Groundnut Oil (Cold Press)',   basePrice:148, stock:150, unit:'lt', icon:'oil'   },
  { id:6,  name:'Masoor Dal (Whole Red)',        basePrice:75,  stock:390, unit:'kg', icon:'grain' },
  { id:7,  name:'PP Woven Bags (50 kg)',         basePrice:18,  stock:1200,unit:'pc', icon:'pack'  },
  { id:8,  name:'Urad Dal (White Split)',        basePrice:98,  stock:210, unit:'kg', icon:'grain' },
  { id:9,  name:'Moong Dal (Washed)',            basePrice:90,  stock:340, unit:'kg', icon:'grain' },
  { id:10, name:'HDPE Shrink Film Roll',         basePrice:225, stock:80,  unit:'kg', icon:'pack'  },
  { id:11, name:'Mustard Oil (Kachi Ghani)',     basePrice:132, stock:180, unit:'lt', icon:'oil'   },
];

/* sparkline heights for "Top Moving" chart */
const BARS = [
  { h:'h25', accent:false }, { h:'h55', accent:false }, { h:'h85', accent:true  },
  { h:'h40', accent:false }, { h:'h70', accent:true  }, { h:'h55', accent:false },
  { h:'h100',accent:true  }, { h:'h40', accent:false }, { h:'h60', accent:false },
];

export default function WholesalerDashboard() {
  const navigate = useNavigate();

  const [user] = useState(() => {
    try { const r = localStorage.getItem('stocklink_user'); return r ? JSON.parse(r) : null; }
    catch { return null; }
  });

  useEffect(() => {
    if (!user)             { navigate('/login'); return; }
    if (!user.isOnboarded)   navigate('/wholesaler/onboarding');
  }, [user, navigate]);

  const [skus, setSkus] = useState(() =>
    INITIAL_SKUS.map(s => ({ ...s, priceStr: String(s.basePrice) }))
  );

  const handleLogout = () => {
    localStorage.removeItem('stocklink_token');
    localStorage.removeItem('stocklink_user');
    navigate('/login');
  };

  const updatePrice = (id, val) =>
    setSkus(prev => prev.map(s => s.id === id ? { ...s, priceStr: val } : s));

  const initials    = (user?.legalName || user?.name || 'W').slice(0, 2).toUpperCase();
  const displayName = user?.tradeName || user?.legalName || user?.name || 'Rajesh K.';

  return (
    <div className="db-page">

      {/* ════════════════════ TOPBAR ════════════════════ */}
      <header className="db-topbar">
        <div className="db-brand" onClick={() => navigate('/')}>
          <img src={stocklinkLogo} alt="StockLink" className="db-brand-logo" />
          <span className="db-brand-name">StockLink</span>
        </div>

        <nav className="db-nav-links">
          <button className="db-nav-link active">Inventory Manager</button>
          <button className="db-nav-link">Order Fulfilment</button>
          <button className="db-nav-link">Analytics</button>
        </nav>

        <div className="db-topbar-right">
          {/* Bell */}
          <button className="db-notif-btn" title="Notifications">
            <Bell size={16} />
            <span className="db-notif-badge" />
          </button>

          {/* User */}
          <div className="db-user-chip">
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
          <div className="wd-stat-card green">
            <div className="wd-stat-header">
              <div>
                <div className="wd-stat-label">Total Revenue (Month)</div>
                <div className="wd-stat-value">₹12.4L</div>
              </div>
              <div className="wd-stat-icon green">
                <IndianRupee size={18} />
              </div>
            </div>
            <div className="wd-stat-footer up">
              <TrendingUp size={12} /> +18.4% vs last month
            </div>
          </div>

          {/* Urgent Orders — dark card */}
          <div className="wd-stat-card dark ochre">
            <div className="wd-stat-header">
              <div>
                <div className="wd-stat-label">Urgent Orders Pending</div>
                <div className="wd-stat-value">29</div>
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
              Basmati · Sunflower Oil · Wheat
            </div>
          </div>
        </div>

        {/* ── Secondary metrics ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem' }}>
          {[
            { icon:<ShieldCheck size={16}/>, label:'GSTIN Verified', value:'Active', color:'var(--sl-green)' },
            { icon:<Users size={16}/>,       label:'Connected Retailers', value:'148 Active', color:'var(--sl-slate-dark)' },
            { icon:<TrendingUp size={16}/>,  label:'Direct Settlements', value:'₹4,85,000', color:'var(--sl-ochre-deep)' },
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

        {/* ── SKU Grid ── */}
        <div>
          <div className="db-section-head">
            <h2>Available Products</h2>
            <span style={{ display:'flex', alignItems:'center', gap:'0.4rem' }}>
              <TrendingUp size={13} />
              {skus.length} SKUs Live · Inline edit prices
            </span>
          </div>

          <div className="wd-product-grid">
            {skus.map(sku => (
              <div className="wd-product-card" key={sku.id}>
                {/* Image */}
                <div className="wd-product-img-wrap">
                  <span className="wd-sku-badge">IN STOCK</span>
                  <div className="wd-product-img-placeholder">
                    {PRODUCT_ICONS[sku.icon]}
                  </div>
                </div>

                {/* Body */}
                <div className="wd-product-body">
                  <div className="wd-product-name">{sku.name}</div>

                  {/* Editable price */}
                  <div className="wd-price-field">
                    <span className="wd-price-label">Base Price</span>
                    <span className="wd-price-rupee">₹</span>
                    <input
                      type="number"
                      className="wd-price-input"
                      value={sku.priceStr}
                      onChange={e => updatePrice(sku.id, e.target.value)}
                      title="Editable Input Field"
                    />
                    <Edit3 size={11} className="wd-edit-icon" />
                  </div>

                  {/* Stock */}
                  <div className="wd-stock-level">
                    LIVE STOCK LEVEL: <strong>{sku.stock} Units IN STOCK</strong>
                  </div>
                </div>

                {/* CTA */}
                <button className="wd-manage-btn">
                  <Edit3 size={11} /> MANAGE / EDIT SKU
                </button>
              </div>
            ))}
          </div>
        </div>
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
