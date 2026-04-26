import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import { store } from './services/store';
import LoginPage from './screens/LoginPage';
import OTPPage from './screens/OTPPage';
import ProfileSetupPage from './screens/ProfileSetupPage';
import DashboardPage from './screens/DashboardPage';
import OrdersPage from './screens/OrdersPage';
import PricesPage from './screens/PricesPage';
import ProfilePage from './screens/ProfilePage';
import CreateListingPage from './screens/CreateListingPage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  if (!store.isLoggedIn()) return <Navigate to="/login" replace />;
  if (!store.hasProfile()) return <Navigate to="/setup" replace />;
  return <>{children}</>;
}

function BottomNav() {
  const loc = useLocation();
  const hidden = ['/login', '/otp', '/setup'].some(p => loc.pathname.startsWith(p));
  if (hidden) return null;

  const tabs = [
    { to: '/dashboard', icon: '🏠', label: 'Home' },
    { to: '/orders', icon: '📦', label: 'Orders' },
    { to: '/prices', icon: '📈', label: 'Prices' },
    { to: '/profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <nav style={nav.bar}>
      {tabs.map(t => (
        <NavLink key={t.to} to={t.to}
          style={({ isActive }) => ({ ...nav.tab, ...(isActive ? nav.active : {}) })}>
          <span style={{ fontSize: 24 }}>{t.icon}</span>
          <span style={nav.label}>{t.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <BottomNav />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/otp" element={<OTPPage />} />
        <Route path="/setup" element={<ProfileSetupPage />} />
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/orders" element={<PrivateRoute><OrdersPage /></PrivateRoute>} />
        <Route path="/prices" element={<PrivateRoute><PricesPage /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="/create-listing" element={<PrivateRoute><CreateListingPage /></PrivateRoute>} />
        <Route path="*" element={<Navigate to={store.isLoggedIn() ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

const nav: Record<string, React.CSSProperties> = {
  bar: { position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #eee', display: 'flex', zIndex: 1000, boxShadow: '0 -2px 16px rgba(0,0,0,0.10)' },
  tab: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px 0 12px', textDecoration: 'none', color: '#aaa', gap: 3 },
  active: { color: '#2d7a2d' },
  label: { fontSize: 11, fontWeight: 600 },
};
