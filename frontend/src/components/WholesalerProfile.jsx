import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building,
  Phone,
  Warehouse,
  Truck,
  CheckCircle2,
  AlertCircle,
  Save,
  LogOut,
  Bell,
  ShieldCheck
} from 'lucide-react';
import stocklinkLogo from '../assets/stocklink-logo.png';
import '../styles/Dashboard.css';
import '../styles/Profile.css';
import { getCurrentUser, apiGetMe, apiUpdateProfile, clearAuthSession } from '../services/api';

export default function WholesalerProfile() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    businessName: '',
    tradeName: '',
    contactPerson: '',
    phone: '',
    contactEmail: '',
    pan: '',
    address: '',
    pincode: '',
    deliveryRadius: 15,
    coveredPincodes: '',
    businessCategory: 'Agricultural Produce / Mandi Mill',
    operationStatus: 'active',
    mov: 5000,
    capacity: '',
    gstin: ''
  });

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'wholesaler') {
      navigate('/retailer/profile');
      return;
    }

    setFormData({
      businessName: user.businessName || user.name || '',
      tradeName: user.tradeName || '',
      contactPerson: user.contactPerson || user.name || '',
      phone: user.phone || '',
      contactEmail: user.contactEmail || user.email || '',
      pan: user.pan || '',
      address: user.address || '',
      pincode: user.pincode || '',
      deliveryRadius: user.deliveryRadius || 15,
      coveredPincodes: user.coveredPincodes || '',
      businessCategory: user.businessCategory || 'Agricultural Produce / Mandi Mill',
      operationStatus: user.operationStatus || 'active',
      mov: user.mov || 5000,
      capacity: user.capacity || '',
      gstin: user.gstin || ''
    });

    apiGetMe()
      .then(res => {
        if (res?.user) {
          const u = res.user;
          setFormData(prev => ({
            ...prev,
            businessName: u.businessName || u.name || prev.businessName,
            tradeName: u.tradeName || prev.tradeName,
            contactPerson: u.contactPerson || prev.contactPerson,
            phone: u.phone || prev.phone,
            contactEmail: u.contactEmail || u.email || prev.contactEmail,
            pan: u.pan || prev.pan,
            address: u.address || prev.address,
            pincode: u.pincode || prev.pincode,
            deliveryRadius: u.deliveryRadius || prev.deliveryRadius,
            coveredPincodes: u.coveredPincodes || prev.coveredPincodes,
            businessCategory: u.businessCategory || prev.businessCategory,
            operationStatus: u.operationStatus || prev.operationStatus,
            mov: u.mov !== undefined ? u.mov : prev.mov,
            capacity: u.capacity || prev.capacity,
            gstin: u.gstin || prev.gstin
          }));
        }
      })
      .catch(err => {
        console.warn('Could not sync latest profile from backend:', err);
      })
      .finally(() => setFetching(false));
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    clearAuthSession();
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setToast(null);

    if (!formData.businessName.trim()) {
      setToast({ type: 'error', message: 'Business Legal Name is required.' });
      setLoading(false);
      return;
    }
    if (formData.phone && !/^\d{10}$/.test(formData.phone.trim())) {
      setToast({ type: 'error', message: 'Mobile number must be 10 digits.' });
      setLoading(false);
      return;
    }

    try {
      const res = await apiUpdateProfile({
        businessName: formData.businessName,
        tradeName: formData.tradeName,
        contactPerson: formData.contactPerson,
        phone: formData.phone,
        contactEmail: formData.contactEmail,
        address: formData.address,
        pincode: formData.pincode,
        deliveryRadius: Number(formData.deliveryRadius) || 15,
        coveredPincodes: formData.coveredPincodes,
        businessCategory: formData.businessCategory,
        operationStatus: formData.operationStatus,
        mov: Number(formData.mov) || 0,
        capacity: formData.capacity
      });

      if (res?.success) {
        setToast({ type: 'success', message: 'Wholesaler profile updated successfully!' });
        setTimeout(() => setToast(null), 4000);
      } else {
        setToast({ type: 'error', message: res?.message || 'Failed to update profile.' });
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'An error occurred while saving.' });
    } finally {
      setLoading(false);
    }
  };

  const initials = (formData.tradeName || formData.businessName || 'W').slice(0, 2).toUpperCase();

  return (
    <div className="profile-container">

      {/* Topbar */}
      <header className="db-topbar">
        <div className="db-brand" onClick={() => navigate('/wholesaler/dashboard')}>
          <img src={stocklinkLogo} alt="StockLink" className="db-brand-logo" />
          <span className="db-brand-name">StockLink</span>
        </div>

        <nav className="db-nav-links">
          <button className="db-nav-link" onClick={() => navigate('/wholesaler/dashboard')}>Inventory Manager</button>
          <button className="db-nav-link" onClick={() => navigate('/wholesaler/dashboard')}>Order Fulfilment</button>
          <button className="db-nav-link" onClick={() => navigate('/wholesaler/dashboard')}>Analytics</button>
          <button className="db-nav-link active">Supplier Profile</button>
        </nav>

        <div className="db-topbar-right">
          <button className="db-notif-btn" title="Notifications">
            <Bell size={16} />
          </button>
          <div className="db-user-chip" style={{ cursor: 'pointer' }} onClick={() => navigate('/wholesaler/profile')}>
            <div className="db-user-avatar">{initials}</div>
            <div className="db-user-info">
              <span className="db-user-role">Wholesaler · Seller</span>
              <span className="db-user-name">{formData.tradeName || formData.businessName || 'Wholesaler'}</span>
            </div>
          </div>
          <button className="db-logout-btn" onClick={handleLogout}>
            <LogOut size={13} /> Log Out
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="profile-main">

        {/* Back Link */}
        <div className="profile-nav-bar">
          <button className="profile-back-btn" onClick={() => navigate('/wholesaler/dashboard')}>
            <ArrowLeft size={15} /> Back to Inventory Manager
          </button>
          <span style={{ fontSize: '0.82rem', color: 'var(--sl-text-muted)' }}>
            Wholesaler & Mill Enterprise Settings
          </span>
        </div>

        {/* Hero Card */}
        <div className="profile-hero-card">
          <div className="profile-hero-left">
            <div className="profile-avatar-large">{initials}</div>
            <div className="profile-hero-info">
              <h1>{formData.tradeName || formData.businessName || 'Wholesale Supplier'}</h1>
              <div className="profile-badges-row">
                <span className="profile-role-pill">Verified Wholesaler · Mill</span>
                <span className="profile-verified-badge">
                  <ShieldCheck size={13} />
                  {formData.gstin ? `GSTIN: ${formData.gstin}` : 'GSTIN Verified'}
                </span>
                <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                  • Status: <strong style={{ textTransform: 'capitalize', color: formData.operationStatus === 'active' ? '#4ade80' : '#f87171' }}>{formData.operationStatus}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Toast Alert */}
        {toast && (
          <div className={`profile-toast ${toast.type}`}>
            {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{toast.message}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Section 1: Business Registration */}
          <div className="profile-card">
            <div className="profile-card-title">
              <Building size={18} />
              <span>Business Registration & Entity Information</span>
            </div>

            <div className="profile-grid-2">
              <div className="profile-field-group">
                <label className="profile-label">Business Legal Name *</label>
                <input
                  type="text"
                  name="businessName"
                  className="profile-input"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="e.g. Balaji Agro Milling Industries Pvt Ltd"
                  required
                />
              </div>

              <div className="profile-field-group">
                <label className="profile-label">Trade / Brand Name</label>
                <input
                  type="text"
                  name="tradeName"
                  className="profile-input"
                  value={formData.tradeName}
                  onChange={handleChange}
                  placeholder="e.g. Balaji Agro Mills"
                />
              </div>

              <div className="profile-field-group">
                <label className="profile-label">Business PAN</label>
                <input
                  type="text"
                  name="pan"
                  className="profile-input-readonly"
                  value={formData.pan || 'N/A'}
                  readOnly
                  title="PAN is verified during onboarding"
                />
              </div>

              <div className="profile-field-group">
                <label className="profile-label">Commodity / Business Category</label>
                <select
                  name="businessCategory"
                  className="profile-input"
                  value={formData.businessCategory}
                  onChange={handleChange}
                >
                  <option value="Agricultural Produce / Mandi Mill">Agricultural Produce / Mandi Mill</option>
                  <option value="Edible Oils & Fats">Edible Oils & Fats</option>
                  <option value="Pulses & Legumes Mill">Pulses & Legumes Mill</option>
                  <option value="Flour & Grains Processor">Flour & Grains Processor</option>
                  <option value="Packaging Solutions & Bags">Packaging Solutions & Bags</option>
                  <option value="Spices & Condiments">Spices & Condiments</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Contact & Key Personnel */}
          <div className="profile-card">
            <div className="profile-card-title">
              <Phone size={18} />
              <span>Authorized Contact Personnel</span>
            </div>

            <div className="profile-grid-3">
              <div className="profile-field-group">
                <label className="profile-label">Contact Person Name</label>
                <input
                  type="text"
                  name="contactPerson"
                  className="profile-input"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  placeholder="e.g. Rajesh Kumar"
                />
              </div>

              <div className="profile-field-group">
                <label className="profile-label">Primary Mobile Number</label>
                <input
                  type="tel"
                  name="phone"
                  className="profile-input"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                />
              </div>

              <div className="profile-field-group">
                <label className="profile-label">Official Business Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  className="profile-input"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  placeholder="e.g. sales@balajiagro.com"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Warehouse & Fulfillment Logistics */}
          <div className="profile-card">
            <div className="profile-card-title">
              <Warehouse size={18} />
              <span>Warehouse & Mandi Fulfillment Logistics</span>
            </div>

            <div className="profile-grid-2">
              <div className="profile-field-group" style={{ gridColumn: 'span 2' }}>
                <label className="profile-label">Warehouse / Processing Mill Address</label>
                <textarea
                  name="address"
                  className="profile-input profile-textarea"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Plot No, Mandi Yard, Industrial Area, City..."
                />
              </div>

              <div className="profile-field-group">
                <label className="profile-label">Hub Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  className="profile-input"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="e.g. 560022"
                  maxLength={6}
                />
              </div>

              <div className="profile-field-group">
                <label className="profile-label">Direct Delivery Radius (km)</label>
                <input
                  type="number"
                  name="deliveryRadius"
                  className="profile-input"
                  value={formData.deliveryRadius}
                  onChange={handleChange}
                  min={1}
                  max={500}
                />
              </div>

              <div className="profile-field-group">
                <label className="profile-label">Minimum Order Value (MOV in ₹)</label>
                <input
                  type="number"
                  name="mov"
                  className="profile-input"
                  value={formData.mov}
                  onChange={handleChange}
                  min={0}
                  step={500}
                />
              </div>

              <div className="profile-field-group">
                <label className="profile-label">Covered Pincodes</label>
                <input
                  type="text"
                  name="coveredPincodes"
                  className="profile-input"
                  value={formData.coveredPincodes}
                  onChange={handleChange}
                  placeholder="e.g. 560022, 560010, 560086"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Operational Status & Capacity */}
          <div className="profile-card">
            <div className="profile-card-title">
              <Truck size={18} />
              <span>Operations & Processing Capacity</span>
            </div>

            <div className="profile-grid-2">
              <div className="profile-field-group">
                <label className="profile-label">Operation Status</label>
                <select
                  name="operationStatus"
                  className="profile-input"
                  value={formData.operationStatus}
                  onChange={handleChange}
                >
                  <option value="active">Active (Accepting Retailer Orders)</option>
                  <option value="inactive">Inactive / Paused (Temporarily Closed)</option>
                </select>
              </div>

              <div className="profile-field-group">
                <label className="profile-label">Storage / Milling Capacity</label>
                <input
                  type="text"
                  name="capacity"
                  className="profile-input"
                  value={formData.capacity}
                  onChange={handleChange}
                  placeholder="e.g. 500 Metric Tonnes / Month"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Statutory & Verification */}
          <div className="profile-card">
            <div className="profile-card-title">
              <ShieldCheck size={18} />
              <span>Verified Statutory Credentials</span>
            </div>

            <div className="profile-grid-2">
              <div className="profile-field-group">
                <label className="profile-label">Verified GSTIN</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="profile-input-readonly"
                    style={{ width: '100%', paddingRight: '2.5rem' }}
                    value={formData.gstin || '29AAAAA0000A1Z5'}
                    readOnly
                  />
                  <CheckCircle2 size={16} color="var(--sl-green, #22C55E)" style={{ position: 'absolute', right: 12 }} />
                </div>
              </div>

              <div className="profile-field-group">
                <label className="profile-label">Marketplace Verification Status</label>
                <input
                  type="text"
                  className="profile-input-readonly"
                  value="Verified Enterprise Wholesaler"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="profile-actions-bar">
            <button
              type="button"
              className="profile-cancel-btn"
              onClick={() => navigate('/wholesaler/dashboard')}
            >
              Discard Changes
            </button>

            <button
              type="submit"
              className="profile-save-btn"
              disabled={loading}
            >
              <Save size={15} />
              {loading ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </div>

        </form>
      </main>

      {/* Footer */}
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
