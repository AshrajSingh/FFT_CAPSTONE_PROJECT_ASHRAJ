import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import RetailerOnboarding from './components/RetailerOnboarding';
import WholesalerOnboarding from './components/WholesalerOnboarding';
import RetailerDashboard from './components/RetailerDashboard';
import WholesalerDashboard from './components/WholesalerDashboard';
import RetailerProfile from './components/RetailerProfile';
import WholesalerProfile from './components/WholesalerProfile';

/**
 * Landing Page Wrapper to translate LandingPage onNavigate events
 * into React Router navigation.
 */
function LandingRouteWrapper() {
  const navigate = useNavigate();

  const handleNavigate = (dest) => {
    if (!dest) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (dest === 'auth' || dest.page === 'auth') {
      const mode = dest.mode || 'login';
      const role = dest.role || 'retailer';
      navigate(`/login?mode=${mode}&role=${role}`);
    } else {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return <LandingPage onNavigate={handleNavigate} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Marketplace Landing Page */}
        <Route path="/" element={<LandingRouteWrapper />} />

        {/* Authentication Page (Accessible via /login and /auth) */}
        <Route path="/login" element={<AuthPage />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* Retailer & Wholesaler Onboarding Pages (Linked directly after Auth) */}
        <Route path="/retailer/onboarding" element={<RetailerOnboarding />} />
        <Route path="/wholesaler/onboarding" element={<WholesalerOnboarding />} />

        {/* Role Dashboards (Directed after Onboarding verification) */}
        <Route path="/retailer/dashboard" element={<RetailerDashboard />} />
        <Route path="/wholesaler/dashboard" element={<WholesalerDashboard />} />

        {/* Role Profile Settings */}
        <Route path="/retailer/profile" element={<RetailerProfile />} />
        <Route path="/wholesaler/profile" element={<WholesalerProfile />} />

        {/* Fallback wildcard route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
