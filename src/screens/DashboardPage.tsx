import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store, FarmerProfile, Listing, Order } from '../services/store';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setProfile(store.getProfile());
    setListings(store.getListings().slice(0, 3));
    setOrders(store.getOrders());
  }, []);

  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const totalRevenue = orders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.total_amount, 0);

  const stats = [
    { label: 'Total Orders', value: orders.length, icon: '📦', color: '#1565c0', bg: '#e3f2fd' },
    { label: 'Revenue', value: `₹${(totalRevenue / 1000).toFixed(1)}k`, icon: '💰', color: '#2d7a2d', bg: '#e8f5e9' },
    { label: 'Rating', value: `${profile?.rating?.toFixed(1) ?? '4.0'}⭐`, icon: '⭐', color: '#f57f17', bg: '#fff8e1' },
  ];

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          {pendingOrders > 0 && <div style={s.alert}>🔔 {pendingOrders} new order{pendingOrders > 1 ? 's' : ''} pending</div>}
          <h2 style={s.name}>Hello, {profile?.name || 'Farmer'} 👋</h2>
          <p style={s.loc}>📍 {profile?.village}, {profile?.district}</p>
        </div>
        <div style={s.avatar}>{(profile?.name?.[0] || 'F').toUpperCase()}</div>
      </div>

      <div style={s.body}>
        <div style={s.statsRow}>
          {stats.map(st => (
            <div key={st.label} style={{ ...s.stat, background: st.bg }}>
              <span style={{ fontSize: 22 }}>{st.icon}</span>
              <span style={{ ...s.statVal, color: st.color }}>{st.value}</span>
              <span style={s.statLabel}>{st.label}</span>
            </div>
          ))}
        </div>

        <button style={s.postBtn} onClick={() => navigate('/create-listing')}>
          + Post New Crop Listing
        </button>

        <div style={s.section}>
          <div style={s.sectionHeader}>
            <h3 style={s.sectionTitle}>My Active Listings</h3>
            <span style={s.badge}>{store.getListings().filter(l => l.status === 'active').length} active</span>
          </div>
          {listings.length === 0
            ? <div style={s.empty}>No listings yet. Post your first crop above.</div>
            : listings.map(l => (
              <div key={l.id} style={s.listCard}>
                <div>
                  <p style={s.crop}>{l.crop_name} <span style={s.variety}>· {l.variety}</span></p>
                  <p style={s.qty}>{l.quantity_kg} kg · {l.district}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={s.price}>₹{l.price_per_kg}<span style={s.perKg}>/kg</span></div>
                  <div style={s.totalVal}>₹{(l.quantity_kg * l.price_per_kg).toLocaleString('en-IN')}</div>
                </div>
              </div>
            ))}
        </div>

        <div style={s.section}>
          <div style={s.sectionHeader}>
            <h3 style={s.sectionTitle}>Recent Orders</h3>
            <a href="/orders" style={s.seeAll}>See all →</a>
          </div>
          {orders.slice(0, 2).map(o => (
            <div key={o.id} style={s.orderCard}>
              <div>
                <p style={s.orderNum}>#{o.order_number} · {o.crop_name}</p>
                <p style={s.shopName}>{o.shop_name}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ ...s.statusDot, background: STATUS_COLORS[o.status] }}>{STATUS_LABELS[o.status]}</div>
                <div style={s.orderAmt}>₹{o.total_amount.toLocaleString('en-IN')}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const STATUS_COLORS: Record<string, string> = { pending: '#ff9800', confirmed: '#2196f3', packed: '#9c27b0', out_for_delivery: '#00bcd4', delivered: '#4caf50', cancelled: '#f44336' };
const STATUS_LABELS: Record<string, string> = { pending: 'Pending', confirmed: 'Confirmed', packed: 'Packed', out_for_delivery: 'On the way', delivered: 'Delivered', cancelled: 'Cancelled' };

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#f5f5f0', paddingBottom: 80 },
  header: { background: 'linear-gradient(135deg, #1b5e20, #2d7a2d)', padding: '44px 24px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  alert: { background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 12, padding: '4px 10px', borderRadius: 20, marginBottom: 8, display: 'inline-block' },
  name: { color: '#fff', fontSize: 24, fontWeight: 700 },
  loc: { color: '#c8e6c9', fontSize: 13, marginTop: 4 },
  avatar: { width: 48, height: 48, borderRadius: '50%', background: '#c8e6c9', color: '#2d7a2d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700 },
  body: { padding: '16px 16px 0' },
  statsRow: { display: 'flex', gap: 10, marginBottom: 16 },
  stat: { flex: 1, borderRadius: 14, padding: '14px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
  statVal: { fontSize: 20, fontWeight: 700 },
  statLabel: { fontSize: 11, color: '#666', textAlign: 'center' },
  postBtn: { width: '100%', background: '#2d7a2d', color: '#fff', padding: '14px', borderRadius: 12, fontSize: 15, fontWeight: 700, marginBottom: 16, border: 'none', cursor: 'pointer' },
  section: { background: '#fff', borderRadius: 16, padding: 16, marginBottom: 14, boxShadow: '0 1px 8px rgba(0,0,0,0.06)' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: 700, color: '#222' },
  badge: { background: '#e8f5e9', color: '#2d7a2d', fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20 },
  seeAll: { fontSize: 13, color: '#2d7a2d', fontWeight: 600, textDecoration: 'none' },
  listCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, marginBottom: 12, borderBottom: '1px solid #f5f5f5' },
  crop: { fontSize: 15, fontWeight: 600, color: '#222' },
  variety: { fontWeight: 400, color: '#888', fontSize: 13 },
  qty: { fontSize: 12, color: '#999', marginTop: 2 },
  price: { fontSize: 18, fontWeight: 700, color: '#2d7a2d' },
  perKg: { fontSize: 12, color: '#999', fontWeight: 400 },
  totalVal: { fontSize: 12, color: '#888', marginTop: 2 },
  empty: { color: '#bbb', textAlign: 'center', padding: '16px 0', fontSize: 14 },
  orderCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, marginBottom: 12, borderBottom: '1px solid #f5f5f5' },
  orderNum: { fontSize: 14, fontWeight: 600, color: '#333' },
  shopName: { fontSize: 12, color: '#888', marginTop: 2 },
  statusDot: { color: '#fff', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, display: 'inline-block', marginBottom: 4 },
  orderAmt: { fontSize: 15, fontWeight: 700, color: '#222' },
};
