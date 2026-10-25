import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  Phone,
  MapPin,
  CreditCard,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Save,
  LogOut,
  ShoppingCart,
  Bell
} from 'lucide-react';
import stocklinkLogo from '../assets/stocklink-logo.png';
import '../styles/Dashboard.css';
import '../styles/Profile.css';
import { getCurrentUser, apiGetMe, apiUpdateProfile, clearAuthSession } from '../services/api';

export default function RetailerProfile() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: string }

  const [formData, setFormData] = useState({
    storeName: '',
    registeredName: '',
    contactPerson: '',
    phone: '',
    contactEmail: '',
    pan: '',
    address: '',
    pincode: '',
    deliveryRadius: 3,
    coveredPincodes: '',
    businessCategory: 'Grocery & Kirana',
    paymentCOD: false,
    paymentBankTransfer: false,
    paymentCard: false,
    docType: 'GSTIN',
    docNumber: '',
    gstin: ''
  });

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'retailer') {
      navigate('/wholesaler/profile');
      return;
    }

    // Populate from current user session
    setFormData({
      storeName: user.storeName || user.businessName || user.name || '',
      registeredName: user.registeredName || user.name || '',
      contactPerson: user.contactPerson || user.name || '',
      phone: user.phone || '',
      contactEmail: user.contactEmail || user.email || '',
      pan: user.pan || '',
      address: user.address || '',
      pincode: user.pincode || '',
      deliveryRadius: user.deliveryRadius || 3,
      coveredPincodes: user.coveredPincodes || '',
      businessCategory: user.businessCategory || 'Grocery & Kirana',
      paymentCOD: Boolean(user.paymentCOD),
      paymentBankTransfer: Boolean(user.paymentBankTransfer),
      paymentCard: Boolean(user.paymentCard),
      docType: user.docType || 'GSTIN',
      docNumber: user.docNumber || user.gstin || '',
      gstin: user.gstin || ''
    });

    // Fetch fresh from backend
    apiGetMe()
      .then(res => {
        if (res?.user) {
          const u = res.user;
          setFormData(prev => ({
            ...prev,
            storeName: u.storeName || u.businessName || u.name || prev.storeName,
            registeredName: u.registeredName || u.name || prev.registeredName,
            contactPerson: u.contactPerson || prev.contactPerson,
            phone: u.phone || prev.phone,
            contactEmail: u.contactEmail || u.email || prev.contactEmail,
            pan: u.pan || prev.pan,
            address: u.address || prev.address,
            pincode: u.pincode || prev.pincode,
            deliveryRadius: u.deliveryRadius || prev.deliveryRadius,
            coveredPincodes: u.coveredPincodes || prev.coveredPincodes,
            businessCategory: u.businessCategory || prev.businessCategory,
            paymentCOD: Boolean(u.paymentCOD),
            paymentBankTransfer: Boolean(u.paymentBankTransfer),
            paymentCard: Boolean(u.paymentCard),
            docType: u.docType || prev.docType,
            docNumber: u.docNumber || u.gstin || prev.docNumber,
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
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLogout = () => {
    clearAuthSession();
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setToast(null);

    // Basic validation
    if (!formData.storeName.trim()) {
      setToast({ type: 'error', message: 'Store Name is required.' });
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
        storeName: formData.storeName,
        registeredName: formData.registeredName,
        contactPerson: formData.contactPerson,
        phone: formData.phone,
        contactEmail: formData.contactEmail,
        address: formData.address,
        pincode: formData.pincode,
        deliveryRadius: Number(formData.deliveryRadius) || 3,
        coveredPincodes: formData.coveredPincodes,
        businessCategory: formData.businessCategory,
        paymentCOD: formData.paymentCOD,
        paymentBankTransfer: formData.paymentBankTransfer,
        paymentCard: formData.paymentCard
      });

      if (res?.success) {
        setToast({ type: 'success', message: 'Retailer profile updated successfully!' });
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

  const initials = (formData.storeName || formData.registeredName || 'R').slice(0, 2).toUpperCase();

  return (
    <div className="profile-container">

      {/* Topbar */}
      <header className="db-topbar">
        <div className="db-brand" onClick={() => navigate('/retailer/dashboard')}>
          <img src={stocklinkLogo} alt="StockLink" className="db-brand-logo" />
          <span className="db-brand-name">StockLink</span>
        </div>

        <nav className="db-nav-links">
          <button className="db-nav-link" onClick={() => navigate('/retailer/dashboard')}>Explore Suppliers</button>
          <button className="db-nav-link" onClick={() => navigate('/retailer/dashboard')}>My Orders</button>
          <button className="db-nav-link" onClick={() => navigate('/retailer/dashboard')}>Stock Alerts</button>
          <button className="db-nav-link active">My Profile</button>
        </nav>

        <div className="db-topbar-right">
          <button className="db-cart-btn" onClick={() => navigate('/retailer/dashboard')}>
            <ShoppingCart size={15} /> Source Cart
          </button>
          <button className="db-notif-btn" title="Notifications">
            <Bell size={16} />
          </button>
          <div className="db-user-chip" style={{ cursor: 'pointer' }} onClick={() => navigate('/retailer/profile')}>
            <div className="db-user-avatar">{initials}</div>
            <div className="db-user-info">
              <span className="db-user-role">Retailer · Buyer</span>
              <span className="db-user-name">{formData.storeName || 'My Store'}</span>
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
          <button className="profile-back-btn" onClick={() => navigate('/retailer/dashboard')}>
            <ArrowLeft size={15} /> Back to Dashboard
          </button>
          <span style={{ fontSize: '0.82rem', color: 'var(--sl-text-muted)' }}>
            Retailer Account Settings
          </span>
        </div>

        {/* Hero Card */}
        <div className="profile-hero-card">
          <div className="profile-hero-left">
            <div className="profile-avatar-large">{initials}</div>
            <div className="profile-hero-info">
              <h1>{formData.storeName || 'Retailer Store'}</h1>
              <div className="profile-badges-row">
                <span className="profile-role-pill">Retailer & Buyer</span>
                <span className="profile-verified-badge">
                  <CheckCircle2 size={13} />
                  {formData.gstin ? `GSTIN: ${formData.gstin}` : 'Verified Business'}
                </span>
                <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                  • {formData.businessCategory || 'Grocery & Kirana'}
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

          {/* Section 1: Business Identity */}
          <div className="profile-card">
            <div className="profile-card-title">
              <Building2 size={18} />
              <span>Business & Store Identification</span>
            </div>

            <div className="profile-grid-2">
              <div className="profile-field-group">
                <label className="profile-label">Store Trade Name *</label>
                <input
                  type="text"
                  name="storeName"
                  className="profile-input"
                  value={formData.storeName}
                  onChange={handleChange}
                  placeholder="e.g. Rajesh Supermarket & Provisions"
                  required
                />
              </div>

              <div className="profile-field-group">
                <label className="profile-label">Registered Legal Name</label>
                <input
                  type="text"
                  name="registeredName"
                  className="profile-input"
                  value={formData.registeredName}
                  onChange={handleChange}
                  placeholder="e.g. Rajesh Trading Enterprise LLP"
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
                <label className="profile-label">Primary Business Category</label>
                <select
                  name="businessCategory"
                  className="profile-input"
                  value={formData.businessCategory}
                  onChange={handleChange}
                >
                  <option value="Grocery & Kirana">Grocery & Kirana</option>
                  <option value="Supermarket">Supermarket</option>
                  <option value="HoReCa (Hotel/Restaurant/Cafe)">HoReCa (Hotel/Restaurant/Cafe)</option>
                  <option value="Food Processing">Food Processing</option>
                  <option value="General Merchant">General Merchant</option>
                  <option value="Wholesale Reseller">Wholesale Reseller</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Contact & Key Personnel */}
          <div className="profile-card">
            <div className="profile-card-title">
              <Phone size={18} />
              <span>Contact & Communication Details</span>
            </div>

            <div className="profile-grid-3">
              <div className="profile-field-group">
                <label className="profile-label">Authorized Contact Person</label>
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
                <label className="profile-label">Store Email Address</label>
                <input
                  type="email"
                  name="contactEmail"
                  className="profile-input"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  placeholder="e.g. store@stocklink.in"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Delivery Location & Pincodes */}
          <div className="profile-card">
            <div className="profile-card-title">
              <MapPin size={18} />
              <span>Store Address & Logistics Preferences</span>
            </div>

            <div className="profile-grid-2">
              <div className="profile-field-group" style={{ gridColumn: 'span 2' }}>
                <label className="profile-label">Store Physical Address</label>
                <textarea
                  name="address"
                  className="profile-input profile-textarea"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Door No, Street Name, Mandi/Market Area, Landmark..."
                />
              </div>

              <div className="profile-field-group">
                <label className="profile-label">Primary Pincode</label>
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
                <label className="profile-label">Max Procurement Delivery Radius (km)</label>
                <input
                  type="number"
                  name="deliveryRadius"
                  className="profile-input"
                  value={formData.deliveryRadius}
                  onChange={handleChange}
                  min={1}
                  max={100}
                />
              </div>

              <div className="profile-field-group" style={{ gridColumn: 'span 2' }}>
                <label className="profile-label">Nearby / Covered Pincodes (comma separated)</label>
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

          {/* Section 4: Payment Preferences */}
          <div className="profile-card">
            <div className="profile-card-title">
              <CreditCard size={18} />
              <span>Procurement & Settlement Preferences</span>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--sl-text-muted)', marginBottom: '1rem' }}>
              Select payment methods accepted by your store for wholesale deliveries.
            </p>

            <div className="profile-checkbox-group">
              <label className={`profile-checkbox-card ${formData.paymentCOD ? 'selected' : ''}`}>
                <input
                  type="checkbox"
                  name="paymentCOD"
                  checked={formData.paymentCOD}
                  onChange={handleChange}
                />
                <span className="profile-checkbox-label">Cash on Delivery (COD)</span>
              </label>

              <label className={`profile-checkbox-card ${formData.paymentBankTransfer ? 'selected' : ''}`}>
                <input
                  type="checkbox"
                  name="paymentBankTransfer"
                  checked={formData.paymentBankTransfer}
                  onChange={handleChange}
                />
                <span className="profile-checkbox-label">Bank Transfer / NEFT</span>
              </label>

              <label className={`profile-checkbox-card ${formData.paymentCard ? 'selected' : ''}`}>
                <input
                  type="checkbox"
                  name="paymentCard"
                  checked={formData.paymentCard}
                  onChange={handleChange}
                />
                <span className="profile-checkbox-label">Debit / Credit Card</span>
              </label>
            </div>
          </div>

          {/* Section 5: Statutory & Verification */}
          <div className="profile-card">
            <div className="profile-card-title">
              <FileCheck size={18} />
              <span>Statutory Verification Credentials</span>
            </div>

            <div className="profile-grid-2">
              <div className="profile-field-group">
                <label className="profile-label">Verification Document Type</label>
                <input
                  type="text"
                  className="profile-input-readonly"
                  value={formData.docType || 'GSTIN'}
                  readOnly
                />
              </div>

              <div className="profile-field-group">
                <label className="profile-label">Verified Document Number</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="profile-input-readonly"
                    style={{ width: '100%', paddingRight: '2.5rem' }}
                    value={formData.docNumber || formData.gstin || 'VERIFIED ONBOARDING'}
                    readOnly
                  />
                  <CheckCircle2 size={16} color="var(--sl-green, #22C55E)" style={{ position: 'absolute', right: 12 }} />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="profile-actions-bar">
            <button
              type="button"
              className="profile-cancel-btn"
              onClick={() => navigate('/retailer/dashboard')}
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
