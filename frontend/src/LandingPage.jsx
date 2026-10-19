import React, { useState } from 'react';
import {
  MapPin,
  Search,
  Scale as Scales,
  ShoppingCart,
  ShieldCheck,
  Layers,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Database,
  Server,
  Users
} from 'lucide-react';
import stocklinkLogo from './assets/stocklink-logo.png';
import {
  matrixProducts,
  retailerMockupData,
  userFlowData,
  wholesalerInventory,
  wholesalerMetrics
} from './data/landingPageData';
import './LandingPage.css';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItemsCount, setCartItemsCount] = useState(
    retailerMockupData.initialCartItemsCount
  );
  const [toastMessage, setToastMessage] = useState('');
  const [userFlowRole, setUserFlowRole] = useState('retailer');
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const currentSteps = userFlowData[userFlowRole];
  const activeStep = currentSteps[activeStepIndex] || currentSteps[0];

  const handleAddItem = (productName) => {
    setCartItemsCount((prev) => prev + 1);
    // setToastMessage(`Added ${productName} to Split-Cart!`);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const handleActionClick = (actionName) => {
    // setToastMessage(`Action: "${actionName}" triggered successfully.`);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const filteredProducts = matrixProducts.filter((product) => {
    const matchesCategory = activeTab === 'all' || product.category === activeTab;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="landing-page-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="stocklink-toast">
          <CheckCircle2 size={18} className="toast-icon" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =========================================================
          SECTION 1: TOP NAVIGATION BAR (STICKY)
          ========================================================= */}
      <header className="stocklink-nav">
        <div className="nav-container">
          {/* Left Brand Identity */}
          <a href="#discover" className="nav-brand">
            <img src={stocklinkLogo} alt="StockLink Logo" className="brand-logo-img" />
            <span className="brand-name">
              Stock<span>Link</span>
            </span>
          </a>

          {/* Center Smooth-Scroll Anchors */}
          <nav className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <a
              href="#discover"
              className="nav-anchor"
              onClick={() => setMobileMenuOpen(false)}
            >
              [Discover]
            </a>
            <a
              href="#retailers"
              className="nav-anchor"
              onClick={() => setMobileMenuOpen(false)}
            >
              [Retailers]
            </a>
            <a
              href="#wholesalers"
              className="nav-anchor"
              onClick={() => setMobileMenuOpen(false)}
            >
              [Wholesalers]
            </a>
            <a
              href="#how-it-works"
              className="nav-anchor"
              onClick={() => setMobileMenuOpen(false)}
            >
              [How It Works]
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="nav-auth-group">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => handleActionClick('Log In')}
            >
              Log In
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => handleActionClick('Sign Up')}
            >
              Sign Up
            </button>
            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              <Layers size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================
          SECTION 2: HERO & VALUE PROPOSITION
          ========================================================= */}
      <section id="discover" className="hero-section">
        <div className="hero-content">
          <h1 className="hero-heading">DIRECT WHOLESALE. REAL-TIME STOCK.</h1>
          <p className="hero-subheading">
            Empowering local retailers with hyper-local price discovery and live stock counts.
          </p>

          <div className="hero-cta-group">
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => handleActionClick('Get Wholesale Access')}
            >
              GET WHOLESALE ACCESS
              <ArrowRight size={18} />
            </button>
            <button
              type="button"
              className="btn btn-slate btn-lg"
              onClick={() => handleActionClick('Register Your Inventory')}
            >
              REGISTER YOUR INVENTORY
            </button>
          </div>

          <div className="value-cards-header">
            <span className="value-cards-tag">VALUE CARDS</span>
          </div>

          <div className="value-cards-grid">
            {/* Card 1 */}
            <div className="value-card">
              <div className="value-icon-box">
                <ShieldCheck size={28} />
              </div>
              <h3 className="value-card-title">ZERO GHOSTING.</h3>
              <p className="value-card-desc">
                Promotes direct buyer-seller connection with verified stock counts.
              </p>
            </div>

            {/* Card 2 */}
            <div className="value-card">
              <div className="value-icon-box">
                <Layers size={28} />
              </div>
              <h3 className="value-card-title">LIVE INVENTORY.</h3>
              <p className="value-card-desc">
                Shows exact live stock levels before ordering.
              </p>
            </div>

            {/* Card 3 */}
            <div className="value-card">
              <div className="value-icon-box">
                <Scales size={28} />
              </div>
              <h3 className="value-card-title">SMART PRICE COMPARE.</h3>
              <p className="value-card-desc">
                Instantly compare bulk rates across local mills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 3: RETAILER WORKFLOW (HYPERLOCAL REVOLUTION)
          ========================================================= */}
      <section id="retailers" className="section-wrapper retailer-workflow-section">
        <div className="section-inner">
          <h2 className="section-title">THE HYPERLOCAL REVOLUTION FOR RETAILERS</h2>
          <p className="section-subtitle">
            Modernize your daily inventory restocking with full transparency into local mandi rates and immediate delivery scheduling.
          </p>

          <div className="workflow-split-layout">
            {/* Left: 4-Step Vertical Process */}
            <div className="workflow-steps-list">
              {/* Step 1 */}
              <div className="workflow-step-card">
                <div className="step-indicator-wrapper">
                  <div className="step-icon-bubble">
                    <MapPin size={22} />
                  </div>
                  <div className="step-connector-line"></div>
                </div>
                <div className="step-content">
                  <h4 className="step-title">1. ENTER LOCATION</h4>
                  <p className="step-description">
                    Enter your pin code or regional market to discover active local grain mills and licensed FMCG distributors.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="workflow-step-card">
                <div className="step-indicator-wrapper">
                  <div className="step-icon-bubble">
                    <Search size={22} />
                  </div>
                  <div className="step-connector-line"></div>
                </div>
                <div className="step-content">
                  <h4 className="step-title">2. FIND LOCAL WHOLESALERS</h4>
                  <p className="step-description">
                    Browse verified regional distributors, check real-time operating status, and inspect minimum order quantity tiers.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="workflow-step-card">
                <div className="step-indicator-wrapper">
                  <div className="step-icon-bubble">
                    <Scales size={22} />
                  </div>
                  <div className="step-connector-line"></div>
                </div>
                <div className="step-content">
                  <h4 className="step-title">3. COMPARE LIVE STOCK & PRICES</h4>
                  <p className="step-description">
                    Compare bulk wholesale rates against local mandi benchmarks and check real-time warehouse count before committing funds.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="workflow-step-card">
                <div className="step-indicator-wrapper">
                  <div className="step-icon-bubble">
                    <ShoppingCart size={22} />
                  </div>
                </div>
                <div className="step-content">
                  <h4 className="step-title">4. DIRECT ORDERING</h4>
                  <p className="step-description">
                    Direct batch procurement without intermediary brokers, with instant MOQ validation and consolidated split-cart dispatch.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: UI Wireframe Mockup (Matrix + Split-Cart) */}
            <div className="retailer-mockup-wrapper">
              {/* Mockup Header */}
              <div className="mockup-window-header">
                <div className="window-controls">
                  <span className="window-dot red"></span>
                  <span className="window-dot yellow"></span>
                  <span className="window-dot green"></span>
                </div>
                <span className="mockup-window-title">RETAILER PLATFORM OVERVIEW</span>
                <div className="mockup-live-status">
                  <span className="pulse-circle"></span>
                  LIVE MATRIX
                </div>
              </div>

              {/* Mockup Toolbar */}
              <div className="mockup-toolbar">
                <div className="mockup-search-box">
                  <Search size={15} />
                  <input
                    type="text"
                    placeholder="Search commodities (rice, oil, wheat)..."
                    value={searchTerm}
                    // onChange={(e) => setSearchTerm(e.target.value)}
                    className="mockup-input-field"
                  />
                </div>
                <div className="mockup-location-badge">
                  <MapPin size={14} />
                  <span>Market: {retailerMockupData.market}</span>
                </div>
              </div>

              {/* Matrix Table */}
              <div className="matrix-table-container">
                <table className="matrix-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Mandi Base</th>
                      <th>StockLink Best</th>
                      <th>Margin Diff</th>
                      <th>Live Stock</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((item) => (
                      <tr key={item.id}>
                        <td className="prod-name-cell">{item.name}</td>
                        <td>{item.storePrice}</td>
                        <td>{item.wholesalePrice}</td>
                        <td>
                          <span className="diff-positive">{item.diff}</span>
                        </td>
                        <td>
                          <span className="stock-tag">{item.stock}</span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="action-add-btn"
                            onClick={() => handleAddItem(item.name)}
                          >
                            + Add
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Split Cart Drawer Preview */}
              <div className="split-cart-preview">
                <div className="split-cart-header">
                  <div className="split-cart-title">
                    <ShoppingCart size={15} />
                    <span>Split Cart Drawer ({cartItemsCount} Items)</span>
                  </div>
                  <div className="moq-badge">
                    <CheckCircle2 size={13} />
                    <span>MOQ Verified</span>
                  </div>
                </div>

                <div className="split-cart-groups">
                  {retailerMockupData.cartGroups.map((group, index) => (
                    <div className="cart-group-box" key={group.wholesaler}>
                      <div className="cart-group-wholesaler">
                        Wholesaler {index + 1}: {group.wholesaler}
                      </div>
                      <div className="cart-group-meta">
                        <span>{group.skuCount}</span>
                        <span>{group.total}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="split-cart-footer">
                  <span className="cart-total-text">
                    Total: {retailerMockupData.total} (Savings: {retailerMockupData.savings})
                  </span>
                  <button
                    type="button"
                    className="cart-checkout-btn"
                    onClick={() => handleActionClick('Split-Cart Checkout')}
                  >
                    Direct Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 4: WHOLESALER EFFICIENCY ENGINE
          ========================================================= */}
      <section id="wholesalers" className="section-wrapper wholesaler-section">
        <div className="section-inner">
          <h2 className="section-title text-white">STREAMLINED EFFICIENCY FOR WHOLESALERS</h2>
          <p className="section-subtitle text-light">
            Automate order intake, eliminate phone reconciliations, and broadcast tier pricing instantly across regional store networks.
          </p>

          <div className="wholesaler-grid">
            {/* Left: Inventory Control Panel Mock Table */}
            <div className="wholesaler-panel-card">
              <div className="panel-header">
                <div className="panel-title-group">
                  <Database size={18} />
                  <span className="panel-title">INVENTORY CONTROL PANEL</span>
                </div>
                <div className="live-sync-indicator">
                  <span className="pulse-circle"></span>
                  <span>SYNCED TO CLUSTER</span>
                </div>
              </div>

              <div className="panel-table-container">
                <table className="panel-table">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Base Price</th>
                      <th>Stock Level</th>
                      <th>Tiered Pricing</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wholesalerInventory.map((item) => (
                      <tr key={item.id}>
                        <td className="prod-name-cell">{item.name}</td>
                        <td>{item.basePrice}</td>
                        <td>{item.stock}</td>
                        <td>
                          <span className="tier-code">{item.tier}</span>
                        </td>
                        <td>
                          <span className={`badge-status ${item.statusType}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column: Metric Cards & Feature Bullets */}
            <div className="wholesaler-sidebar">
              {/* Metric Card 1: Revenue */}
              <div className="metric-card-ochre">
                <div className="metric-card-header">
                  <span className="metric-label">TOTAL REVENUE</span>
                  <TrendingUp size={24} />
                </div>
                <div className="metric-value-huge">{wholesalerMetrics.revenue}</div>
                <div className="metric-subtext">
                  {wholesalerMetrics.revenueChange}
                </div>
              </div>

              {/* Warning Card 2: Low Stock */}
              <div className="warning-card-danger">
                <div className="warning-icon-wrapper">
                  <AlertTriangle size={24} />
                </div>
                <div className="warning-content">
                  <div className="warning-title">
                    LOW STOCK ALERTS: {wholesalerMetrics.lowStockAlertCount}
                  </div>
                  <div className="warning-desc">
                    {wholesalerMetrics.lowStockAlertCount} {wholesalerMetrics.lowStockDescription}
                  </div>
                </div>
              </div>

              {/* Feature Bullets */}
              <div className="wholesaler-bullets-card">
                <div className="feature-bullet-item">
                  <div className="feature-bullet-icon">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <h5 className="feature-bullet-title">INSTANT LIVE UPDATES</h5>
                    <p className="feature-bullet-desc">
                      Modify bulk price slabs or warehouse batch reserves, and updates propagate across connected buyers in under 50ms.
                    </p>
                  </div>
                </div>

                <div className="feature-bullet-item">
                  <div className="feature-bullet-icon">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h5 className="feature-bullet-title">AUTOMATED MOQ VALIDATION</h5>
                    <p className="feature-bullet-desc">
                      Eliminate under-volume orders automatically through strict schema rules without manual back-and-forth negotiations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 5: USER FLOW OVERVIEW (HOW STOCKLINK WORKS)
          ========================================================= */}
      <section id="how-it-works" className="section-wrapper userflow-section">
        <div className="section-inner">
          <div className="userflow-header-wrapper">
            <h2 className="section-title">HOW STOCKLINK WORKS: STEP-BY-STEP USER FLOW</h2>
            <p className="section-subtitle">
              No complicated onboarding or phone negotiations. Experience crystal-clear wholesale discovery, instant price lock, and guaranteed doorstep fulfillment.
            </p>

            <div className="userflow-tabs-container">
              <button
                type="button"
                className={`userflow-tab-btn ${userFlowRole === 'retailer' ? 'active' : ''}`}
                onClick={() => {
                  setUserFlowRole('retailer');
                  setActiveStepIndex(0);
                }}
              >
                <Users size={16} />
                <span>For Retailers (Buying Wholesale)</span>
              </button>
              <button
                type="button"
                className={`userflow-tab-btn ${userFlowRole === 'wholesaler' ? 'active' : ''}`}
                onClick={() => {
                  setUserFlowRole('wholesaler');
                  setActiveStepIndex(0);
                }}
              >
                <Layers size={16} />
                <span>For Wholesalers (Supplying Stock)</span>
              </button>
            </div>
          </div>

          {/* 4 Interactive Step Cards */}
          <div className="userflow-steps-grid">
            {currentSteps.map((stepItem, idx) => {
              const StepIcon = stepItem.icon;
              const isActive = activeStepIndex === idx;
              return (
                <div
                  key={stepItem.step}
                  className={`userflow-step-card ${isActive ? 'active-step' : ''}`}
                  onClick={() => {
                    setActiveStepIndex(idx);
                    handleActionClick(stepItem.ctaAction);
                  }}
                >
                  <div className="userflow-step-top">
                    <span className="userflow-step-number">{stepItem.step}</span>
                    <div className="userflow-step-icon">
                      <StepIcon size={20} />
                    </div>
                  </div>

                  <span className="userflow-action-pill">{stepItem.action}</span>
                  <h4 className="userflow-step-title">{stepItem.title}</h4>
                  <p className="userflow-step-desc">{stepItem.desc}</p>

                  <div className="userflow-mini-preview">
                    <CheckCircle2 size={13} />
                    <span>{stepItem.preview}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* User Flow Focus Banner */}
          <div className="userflow-interactive-banner">
            <div className="userflow-banner-info">
              <span className="userflow-banner-badge">Step {activeStep.step} Active</span>
              <span className="userflow-banner-text">
                {activeStep.title} — {activeStep.preview}
              </span>
            </div>
            <button
              type="button"
              className="userflow-banner-btn"
              onClick={() => handleActionClick(activeStep.ctaAction)}
            >
              <span>Simulate This Step</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Trust Guarantees Row */}
          <div className="userflow-trust-row">
            <div className="userflow-trust-item">
              <ShieldCheck size={24} className="trust-item-icon" />
              <div>
                <div className="trust-item-title">Zero Ghosting Guarantee</div>
                <div className="trust-item-desc">Physical inventory and warehouse stocks verified before listing</div>
              </div>
            </div>

            <div className="userflow-trust-item">
              <CheckCircle2 size={24} className="trust-item-icon" />
              <div>
                <div className="trust-item-title">Automated MOQ Pre-Validation</div>
                <div className="trust-item-desc">No order cancellations or awkward phone renegotiations</div>
              </div>
            </div>

            <div className="userflow-trust-item">
              <TrendingUp size={24} className="trust-item-icon" />
              <div>
                <div className="trust-item-title">Direct Mandi Pricing</div>
                <div className="trust-item-desc">Transparent wholesale rates directly from local mills & distributors</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 6: CTA FOOTER BANNER & LINKS
          ========================================================= */}
      <footer className="footer-cta-section">
        <div className="footer-cta-card">
          <h2 className="footer-cta-heading">READY TO FIX YOUR B2B ITCH?</h2>
          <p className="footer-cta-subhead">
            Join hundreds of forward-thinking retailers and wholesale suppliers standardizing commodity trading with full transparency.
          </p>
          <div className="footer-cta-buttons">
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => handleActionClick('Get Wholesale Access')}
            >
              GET WHOLESALE ACCESS
              <ArrowRight size={18} />
            </button>
            <button
              type="button"
              className="btn btn-outline-light btn-lg"
              onClick={() => handleActionClick('Register Your Inventory')}
            >
              REGISTER YOUR INVENTORY
            </button>
          </div>
        </div>

        <div className="footer-bottom-bar section-inner">
          <ul className="footer-nav-links">
            <li>
              <a
                href="#contact"
                className="footer-link"
                onClick={(e) => {
                  e.preventDefault();
                  handleActionClick('Contact');
                }}
              >
                Contact
              </a>
            </li>
            <li>
              <a
                href="#faq"
                className="footer-link"
                onClick={(e) => {
                  e.preventDefault();
                  handleActionClick('FAQ');
                }}
              >
                FAQ
              </a>
            </li>
            <li>
              <a
                href="#careers"
                className="footer-link"
                onClick={(e) => {
                  e.preventDefault();
                  handleActionClick('Careers');
                }}
              >
                Careers
              </a>
            </li>
            <li>
              <a
                href="#privacy"
                className="footer-link"
                onClick={(e) => {
                  e.preventDefault();
                  handleActionClick('Privacy');
                }}
              >
                Privacy
              </a>
            </li>
            <li>
              <a
                href="#terms"
                className="footer-link"
                onClick={(e) => {
                  e.preventDefault();
                  handleActionClick('Terms');
                }}
              >
                Terms
              </a>
            </li>
          </ul>

          <div className="footer-legal-copy">
            &copy; 2026 StockLink Wholesale Network Inc. All rights reserved. Direct wholesale and real-time stock infrastructure.
          </div>
        </div>
      </footer>
    </div>
  );
}
