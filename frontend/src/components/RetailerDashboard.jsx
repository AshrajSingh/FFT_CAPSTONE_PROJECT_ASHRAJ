import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  Bell,
  LogOut,
  MapPin,
  Wheat,
  Droplets,
  Box,
  Package,
  CheckCircle2,
  TrendingDown,
  Star,
  Zap,
} from 'lucide-react';
import stocklinkLogo from '../assets/stocklink-logo.png';
import '../styles/Dashboard.css';

/* ─── Mock catalogue ────────────────────────────────────────── */
const PRODUCT_ICONS = {
  grain:   <Wheat   size={30} color="#7C6F8A" />,
  oil:     <Droplets size={30} color="#7C6F8A" />,
  pack:    <Box      size={30} color="#7C6F8A" />,
  generic: <Package  size={30} color="#7C6F8A" />,
};

const ALL_PRODUCTS = [
  { id:1,  name:'Basmati Rice (Extra Long)',   supplier:'Balaji Agro Mills',         location:'Yeshwanthpur, Bengaluru', stock:250, price:80,  unit:'kg', bulkMin:10,  icon:'grain', tag:'Grains', rating:4.8 },
  { id:2,  name:'Refined Sunflower Oil 1 L',   supplier:'Ravi Oil Industries',        location:'Vashi, Navi Mumbai',      stock:180, price:90,  unit:'lt', bulkMin:12,  icon:'oil',   tag:'Dairy',  rating:4.6 },
  { id:3,  name:'Premium Wheat Flour (Atta)',   supplier:'Golden Grain Mills',         location:'Whitefield, Bengaluru',   stock:320, price:38,  unit:'kg', bulkMin:25,  icon:'grain', tag:'Grains', rating:4.9 },
  { id:4,  name:'Toor Dal (Split Pigeon Pea)',  supplier:'Shalimar Agro Traders',      location:'Dadar, Mumbai',           stock:210, price:90,  unit:'kg', bulkMin:10,  icon:'grain', tag:'Spices', rating:4.7 },
  { id:5,  name:'Groundnut Oil (Cold Press)',   supplier:'Heritage Oils Pvt Ltd',      location:'Pune APMC',               stock:140, price:145, unit:'lt', bulkMin:10,  icon:'oil',   tag:'Dairy',  rating:4.5 },
  { id:6,  name:'Masoor Dal (Whole Red)',        supplier:'Krishana Dal Mills',         location:'Byculla, Mumbai',         stock:290, price:72,  unit:'kg', bulkMin:15,  icon:'grain', tag:'Grains', rating:4.7 },
  { id:7,  name:'PP Woven Bags (50 kg)',         supplier:'Bharat Packaging Works',     location:'Chembur, Mumbai',         stock:500, price:18,  unit:'pc', bulkMin:50,  icon:'pack',  tag:'Spices', rating:4.4 },
  { id:8,  name:'Urad Dal (White Split)',        supplier:'Deccan Grains Export',       location:'Pune Mandi',              stock:175, price:95,  unit:'kg', bulkMin:10,  icon:'grain', tag:'Grains', rating:4.6 },
  { id:9,  name:'Moong Dal (Washed)',            supplier:'Sai Agro Processors',        location:'Nagpur APMC',             stock:260, price:88,  unit:'kg', bulkMin:10,  icon:'grain', tag:'Grains', rating:4.8 },
  { id:10, name:'HDPE Shrink Film Roll',         supplier:'Sudarshan Polymers Ltd',     location:'Turbhe, Navi Mumbai',     stock:120, price:220, unit:'kg', bulkMin:25,  icon:'pack',  tag:'Spices', rating:4.3 },
  { id:11, name:'Mustard Oil (Kachi Ghani)',     supplier:'Rajasthan Oils Cooperative', location:'Jaipur APMC',             stock:200, price:130, unit:'lt', bulkMin:10,  icon:'oil',   tag:'Dairy',  rating:4.9 },
  { id:12, name:'Chana Dal (Bengal Gram)',       supplier:'Central India Dal Mills',    location:'Nagpur APMC',             stock:240, price:68,  unit:'kg', bulkMin:20,  icon:'grain', tag:'Grains', rating:4.6 },
];

const DISTANCE_OPTIONS = ['<5km','10km','15km+'];
const QUICK_TAGS       = ['Dairy','Grains','Spices'];

export default function RetailerDashboard() {
  const navigate = useNavigate();

  const [user] = useState(() => {
    try { const r = localStorage.getItem('stocklink_user'); return r ? JSON.parse(r) : null; }
    catch { return null; }
  });

  useEffect(() => {
    if (!user)             { navigate('/login'); return; }
    if (!user.isOnboarded)   navigate('/retailer/onboarding');
  }, [user, navigate]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeDist,  setActiveDist]  = useState('<5km');
  const [activeTag,   setActiveTag]   = useState(null);
  const [cart,        setCart]        = useState([]);
  const [addedId,     setAddedId]     = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('stocklink_token');
    localStorage.removeItem('stocklink_user');
    navigate('/login');
  };

  const handleAdd = (product) => {
    setCart(prev => {
      const ex = prev.find(p => p.id === product.id);
      if (ex) return prev.map(p => p.id === product.id ? { ...p, qty: p.qty + 1 } : p);
      return [...prev, { ...product, qty: 1 }];
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1300);
  };

  const cartCount = cart.reduce((s, p) => s + p.qty, 0);

  const filtered = ALL_PRODUCTS.filter(p => {
    const matchSearch = !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTag = !activeTag || p.tag === activeTag;
    return matchSearch && matchTag;
  });

  const initials     = (user?.storeName || user?.name || 'R').slice(0, 2).toUpperCase();
  const displayName  = user?.storeName || user?.name || 'Rajesh K.';

  return (
    <div className="db-page">

      {/* ════════════════════ TOPBAR ════════════════════ */}
      <header className="db-topbar">
        <div className="db-brand" onClick={() => navigate('/')}>
          <img src={stocklinkLogo} alt="StockLink" className="db-brand-logo" />
          <span className="db-brand-name">StockLink</span>
        </div>

        <nav className="db-nav-links">
          <button className="db-nav-link active">Explore Suppliers</button>
          <button className="db-nav-link">My Orders</button>
          <button className="db-nav-link">Stock Alerts</button>
        </nav>

        <div className="db-topbar-right">
          {/* Cart */}
          <button className="db-cart-btn">
            <ShoppingCart size={15} />
            Source Cart
            {cartCount > 0 && <span className="db-cart-count">{cartCount}</span>}
          </button>

          {/* Bell */}
          <button className="db-notif-btn" title="Notifications">
            <Bell size={16} />
            <span className="db-notif-badge" />
          </button>

          {/* User */}
          <div className="db-user-chip">
            <div className="db-user-avatar">{initials}</div>
            <div className="db-user-info">
              <span className="db-user-role">Retailer · Buyer</span>
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

        {/* ── Welcome Banner ── */}
        <div className="rd-welcome-banner">
          <div className="rd-welcome-text">
            <div className="rd-welcome-badge">
              <CheckCircle2 size={11} /> GSTIN Verified Buyer
            </div>
            <h1 className="rd-welcome-title">Welcome back, {displayName.split(' ')[0]} 👋</h1>
            <p className="rd-welcome-sub">
              Explore live mandi stock from local mills · Compare bulk rates · Lock inventory in real-time
            </p>
          </div>
          <div className="rd-welcome-stats">
            <div className="rd-welcome-stat">
              <div className="rd-welcome-stat-val">12</div>
              <div className="rd-welcome-stat-lbl">Active<br />Suppliers</div>
            </div>
            <div className="rd-welcome-stat">
              <div className="rd-welcome-stat-val">3</div>
              <div className="rd-welcome-stat-lbl">Orders<br />In Transit</div>
            </div>
            <div className="rd-welcome-stat">
              <div className="rd-welcome-stat-val" style={{ color: '#4ade80' }}>12.8%</div>
              <div className="rd-welcome-stat-lbl">Below<br />APMC Rate</div>
            </div>
          </div>
        </div>

        {/* ── Search & Filter Bar ── */}
        <div className="rd-filter-bar">
          {/* Search */}
          <div className="rd-filter-group">
            <div className="rd-filter-label">Search Filter</div>
            <div className="rd-search-wrap">
              <Search size={15} className="rd-search-icon" />
              <input
                type="text"
                className="rd-search-input"
                placeholder="Search Rice, Flour, Packaging..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Distance */}
          <div className="rd-filter-group">
            <div className="rd-filter-label">Distance</div>
            <div className="rd-dist-pills">
              {DISTANCE_OPTIONS.map(d => (
                <button
                  key={d}
                  className={`rd-dist-pill ${activeDist === d ? 'active' : ''}`}
                  onClick={() => setActiveDist(d)}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="rd-filter-group">
            <div className="rd-filter-label">Quick Tags</div>
            <div className="rd-tag-pills">
              {QUICK_TAGS.map(t => (
                <button
                  key={t}
                  className={`rd-tag-pill ${activeTag === t ? 'active' : ''}`}
                  onClick={() => setActiveTag(activeTag === t ? null : t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Products ── */}
        <div>
          <div className="db-section-head">
            <h2>Available Products</h2>
            <span>{filtered.length} products · {activeDist}</span>
          </div>

          <div className="rd-product-grid">
            {filtered.map(p => (
              <div className="rd-product-card" key={p.id}>
                {/* Image area */}
                <div className="rd-product-img-wrap">
                  <span className="rd-live-badge">
                    <span className="rd-live-dot" />
                    LIVE
                  </span>
                  <div className="rd-product-img-placeholder">
                    {PRODUCT_ICONS[p.icon]}
                  </div>
                </div>

                {/* Body */}
                <div className="rd-product-body">
                  <div className="rd-product-name">{p.name}</div>

                  <div className="rd-product-supplier">
                    <MapPin size={11} />
                    {p.location}
                  </div>

                  <div className="rd-stock-status">
                    <span className="rd-stock-dot" />
                    LIVE · {p.stock} units left
                  </div>

                  <div className="rd-price-row">
                    <span className="rd-price">₹{p.price}/{p.unit}</span>
                    <span className="rd-bulk-note">Bulk disc. ≥{p.bulkMin} units</span>
                  </div>

                  {/* Rating */}
                  <div style={{ display:'flex', alignItems:'center', gap:'0.3rem' }}>
                    <Star size={11} fill="#FFA062" color="#FFA062" />
                    <span style={{ fontSize:'0.68rem', fontWeight:700, color:'var(--sl-text-muted)' }}>{p.rating}</span>
                  </div>
                </div>

                {/* CTA */}
                <button
                  className={`rd-add-btn ${addedId === p.id ? 'added' : ''}`}
                  onClick={() => handleAdd(p)}
                >
                  {addedId === p.id
                    ? <><CheckCircle2 size={13} /> ADDED TO CART</>
                    : <><ShoppingCart size={13} /> ADD TO SOURCE CART</>
                  }
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
