import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import LoginPage from './screens/LoginPage';
import ProfileSetupPage from './screens/ProfileSetupPage';
import DashboardPage from './screens/DashboardPage';
import MarketplacePage from './screens/MarketplacePage';
import NeedsFeedPage from './screens/NeedsFeedPage';
import PostNeedPage from './screens/PostNeedPage';
import CreateListingPage from './screens/CreateListingPage';
import OrdersPage from './screens/OrdersPage';
import PricesPage from './screens/PricesPage';
import ProfilePage from './screens/ProfilePage';

function PrivateRoute({ children, farmerOnly, buyerOnly }: { children: React.ReactNode; farmerOnly?: boolean; buyerOnly?: boolean }) {
  const { user, userProfile, loading } = useAuth();
  if (loading) return <Splash />;
  if (!user) return <Navigate to="/login" replace />;
  if (!userProfile?.profileComplete) return <Navigate to="/setup" replace />;
  if (farmerOnly && userProfile.role !== 'farmer') return <Navigate to="/dashboard" replace />;
  if (buyerOnly && userProfile.role !== 'buyer') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function Splash() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1b5e20, #2d7a2d)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <span style={{ fontSize: 64 }}>🌾</span>
      <h1 style={{ color: '#fff', fontSize: 32, fontWeight: 800 }}>RythuLink</h1>
      <div style={{ width: 40, height: 40, border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );
}

function BottomNav() {
  const { userProfile } = useAuth();
  const { t } = useLanguage();
  const loc = useLocation();
  const hidden = ['/login', '/setup'].some(p => loc.pathname.startsWith(p));
  if (hidden || !userProfile?.profileComplete) return null;

  const farmerTabs = [
    { to: '/dashboard', icon: '🏠', label: t('home') },
    { to: '/needs', icon: '📢', label: t('needs') },
    { to: '/orders', icon: '📦', label: t('orders') },
    { to: '/prices', icon: '📈', label: t('prices') },
    { to: '/profile', icon: '👤', label: t('profile') },
  ];
  const buyerTabs = [
    { to: '/dashboard', icon: '🏠', label: t('home') },
    { to: '/listings', icon: '🛒', label: t('marketplace') },
    { to: '/post-need', icon: '📢', label: t('postNeed') },
    { to: '/orders', icon: '📦', label: t('orders') },
    { to: '/profile', icon: '👤', label: t('profile') },
  ];
  const tabs = userProfile?.role === 'buyer' ? buyerTabs : farmerTabs;

  return (
    <nav style={nav.bar}>
      {tabs.map(t => (
        <NavLink key={t.to} to={t.to}
          style={({ isActive }) => ({ ...nav.tab, ...(isActive ? nav.active : {}) })}>
          <span style={{ fontSize: 22 }}>{t.icon}</span>
          <span style={nav.label}>{t.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

function AppRoutes() {
  const { user, userProfile, loading } = useAuth();
  if (loading) return <Splash />;

  return (
    <>
      <BottomNav />
      <Routes>
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
        <Route path="/setup" element={<ProfileSetupPage />} />
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/listings" element={<PrivateRoute><MarketplacePage /></PrivateRoute>} />
        <Route path="/needs" element={<PrivateRoute><NeedsFeedPage /></PrivateRoute>} />
        <Route path="/post-need" element={<PrivateRoute buyerOnly><PostNeedPage /></PrivateRoute>} />
        <Route path="/create-listing" element={<PrivateRoute farmerOnly><CreateListingPage /></PrivateRoute>} />
        <Route path="/orders" element={<PrivateRoute><OrdersPage /></PrivateRoute>} />
        <Route path="/prices" element={<PrivateRoute><PricesPage /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}

const nav: Record<string, React.CSSProperties> = {
  bar: { position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #eee', display: 'flex', zIndex: 1000, boxShadow: '0 -2px 16px rgba(0,0,0,0.10)' },
  tab: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px 0 12px', textDecoration: 'none', color: '#aaa', gap: 3 },
  active: { color: '#2d7a2d' },
  label: { fontSize: 10, fontWeight: 600 },
};
