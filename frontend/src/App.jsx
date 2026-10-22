import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';

export default function App() {
  // Navigation state: 'landing' | 'auth'
  const [currentPage, setCurrentPage] = useState('landing');
  const [authConfig, setAuthConfig] = useState({
    mode: 'login', // 'login' | 'signup'
    role: 'retailer' // 'retailer' | 'wholesaler'
  });

  // Check URL hash on initial load or popstate
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.startsWith('#auth') || hash.startsWith('#login') || hash.startsWith('#signup')) {
        setCurrentPage('auth');
        const isSignup = hash.includes('signup') || hash.includes('register');
        const isWholesaler = hash.includes('wholesaler') || hash.includes('seller');
        setAuthConfig({
          mode: isSignup ? 'signup' : 'login',
          role: isWholesaler ? 'wholesaler' : 'retailer'
        });
      } else {
        setCurrentPage('landing');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (destination) => {
    if (typeof destination === 'string') {
      setCurrentPage(destination);
      window.location.hash = destination === 'auth' ? '#auth' : '';
    } else if (destination && destination.page === 'auth') {
      setCurrentPage('auth');
      const mode = destination.mode || 'login';
      const role = destination.role || 'retailer';
      setAuthConfig({ mode, role });
      window.location.hash = `#auth?mode=${mode}&role=${role}`;
    } else {
      setCurrentPage('landing');
      window.location.hash = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      {currentPage === 'landing' ? (
        <LandingPage onNavigate={handleNavigate} />
      ) : (
        <AuthPage
          initialMode={authConfig.mode}
          initialRole={authConfig.role}
          onNavigate={handleNavigate}
        />
      )}
    </>
  );
}
