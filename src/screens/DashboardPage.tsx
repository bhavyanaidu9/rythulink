import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getMyListings, subscribeToOrders, subscribeToNeeds, getAllListings, Listing, Order, Need } from '../services/firestoreService';

export default function DashboardPage() {
  const { userProfile, user } = useAuth();
  const { t } = useLanguage();
  return userProfile?.role === 'buyer'
    ? <BuyerDashboard />
    : <FarmerDashboard />;
}

function FarmerDashboard() {
  const { userProfile, user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [needs, setNeeds] = useState<Need[]>([]);

  useEffect(() => {
    if (!user) return;
    getMyListings(user.uid).then(l => setListings(l.slice(0, 3)));
    const unsub1 = subscribeToOrders(user.uid, 'farmer', setOrders);
    const unsub2 = subscribeToNeeds(n => setNeeds(n.slice(0, 3)));
    return () => { unsub1(); unsub2(); };
  }, [user]);

  const revenue = orders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.totalAmount, 0);
  const pending = orders.filter(o => o.status === 'pending').length;

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          {pending > 0 && <div style={s.alert}>🔔 {pending} {t('pendingOrders')}</div>}
          <h2 style={s.name}>{t('goodDay')}, {userProfile?.displayName?.split(' ')[0]} 👋</h2>
          <p style={s.loc}>📍 {userProfile?.village}, {userProfile?.district}</p>
        </div>
        <Avatar url={userProfile?.photoURL} name={userProfile?.displayName} />
      </div>

      <div style={s.body}>
        <div style={s.statsRow}>
          {[
            { label: t('activeListings'), value: listings.filter(l => l.status === 'active').length, color: '#2d7a2d', bg: '#e8f5e9', icon: '🌾' },
            { label: t('totalOrders'), value: orders.length, color: '#1565c0', bg: '#e3f2fd', icon: '📦' },
            { label: t('revenue'), value: `₹${(revenue/1000).toFixed(1)}k`, color: '#6a1b9a', bg: '#f3e5f5', icon: '💰' },
          ].map(st => (
            <div key={st.label} style={{ ...s.stat, background: st.bg }}>
              <span style={{ fontSize: 22 }}>{st.icon}</span>
              <span style={{ ...s.statVal, color: st.color }}>{st.value}</span>
              <span style={s.statLabel}>{st.label}</span>
            </div>
          ))}
        </div>

        <button style={s.postBtn} onClick={() => navigate('/create-listing')}>+ {t('postCrop')}</button>

        <Section title={t('buyerNeedsFeed')} onSeeAll={() => navigate('/needs')}>
          {needs.length === 0
            ? <Empty text={t('noNeeds')} />
            : needs.map(n => <NeedRow key={n.id} need={n} onAccept={() => navigate('/needs')} />)}
        </Section>

        <Section title={t('recentOrders')} onSeeAll={() => navigate('/orders')}>
          {orders.slice(0, 2).length === 0
            ? <Empty text={t('noOrders')} />
            : orders.slice(0, 2).map(o => <OrderRow key={o.id} order={o} />)}
        </Section>
      </div>
    </div>
  );
}

function BuyerDashboard() {
  const { userProfile, user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) return;
    getAllListings().then(l => setListings(l.slice(0, 3)));
    const unsub = subscribeToOrders(user.uid, 'buyer', setOrders);
    return unsub;
  }, [user]);

  const spent = orders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.totalAmount, 0);
  const buyerBadge: Record<string, string> = { shop: '🏪', restaurant: '🍽', bulk: '📦' };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <div style={s.alert}>{buyerBadge[userProfile?.buyerType || 'shop']} {userProfile?.buyerType === 'shop' ? t('shopOwner') : userProfile?.buyerType === 'restaurant' ? t('restaurant') : t('bulkBuyer')}</div>
          <h2 style={s.name}>{t('goodDay')}, {userProfile?.displayName?.split(' ')[0]} 👋</h2>
          <p style={s.loc}>🏢 {userProfile?.businessName} · {userProfile?.district}</p>
        </div>
        <Avatar url={userProfile?.photoURL} name={userProfile?.displayName} />
      </div>

      <div style={s.body}>
        <div style={s.statsRow}>
          {[
            { label: t('totalOrders'), value: orders.length, color: '#1565c0', bg: '#e3f2fd', icon: '📦' },
            { label: t('revenue'), value: `₹${(spent/1000).toFixed(1)}k`, color: '#6a1b9a', bg: '#f3e5f5', icon: '💰' },
            { label: t('rating'), value: '4.8⭐', color: '#f57f17', bg: '#fff8e1', icon: '⭐' },
          ].map(st => (
            <div key={st.label} style={{ ...s.stat, background: st.bg }}>
              <span style={{ fontSize: 22 }}>{st.icon}</span>
              <span style={{ ...s.statVal, color: st.color }}>{st.value}</span>
              <span style={s.statLabel}>{st.label}</span>
            </div>
          ))}
        </div>

        <div style={s.ctaRow}>
          <button style={s.postBtn} onClick={() => navigate('/listings')}>🛒 {t('browseMarketplace')}</button>
          <button style={{ ...s.postBtn, background: '#1565c0' }} onClick={() => navigate('/post-need')}>📢 {t('postANeed')}</button>
        </div>

        <Section title={t('recentListings')} onSeeAll={() => navigate('/listings')}>
          {listings.slice(0, 2).map(l => (
            <div key={l.id} style={s.listCard}>
              {l.imageURL && <img src={l.imageURL} alt={l.cropName} style={s.cropImg} />}
              <div style={{ flex: 1 }}>
                <p style={s.crop}>{l.cropName} <span style={s.variety}>· {l.variety}</span></p>
                <p style={s.qty}>{l.quantityKg} kg · {l.district}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={s.price}>₹{l.pricePerKg}<span style={s.perKg}>/kg</span></div>
                <button style={s.orderBtn} onClick={() => navigate('/listings')}>Order</button>
              </div>
            </div>
          ))}
        </Section>

        <Section title={t('recentOrders')} onSeeAll={() => navigate('/orders')}>
          {orders.slice(0, 2).length === 0
            ? <Empty text={t('noOrders')} />
            : orders.slice(0, 2).map(o => <OrderRow key={o.id} order={o} />)}
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children, onSeeAll }: any) {
  return (
    <div style={s.section}>
      <div style={s.sectionHeader}>
        <h3 style={s.sectionTitle}>{title}</h3>
        {onSeeAll && <button style={s.seeAll} onClick={onSeeAll}>See all →</button>}
      </div>
      {children}
    </div>
  );
}

function NeedRow({ need, onAccept }: { need: Need; onAccept: () => void }) {
  const badge: Record<string, string> = { shop: '🏪', restaurant: '🍽', bulk: '📦' };
  return (
    <div style={s.needRow}>
      <div>
        <span style={s.needBadge}>{badge[need.buyerType] || '👤'} {need.buyerType}</span>
        <p style={s.crop}>{need.cropName} · {need.quantityKg} kg</p>
        <p style={s.qty}>Max ₹{need.maxPricePerKg}/kg · {need.district}</p>
      </div>
      <button style={s.acceptBtn} onClick={onAccept}>Accept →</button>
    </div>
  );
}

function OrderRow({ order }: { order: Order }) {
  const colors: Record<string, string> = { pending: '#ff9800', confirmed: '#2196f3', delivered: '#4caf50', cancelled: '#f44336', packed: '#9c27b0', out_for_delivery: '#00bcd4' };
  return (
    <div style={s.orderRow}>
      <div>
        <p style={s.orderNum}>#{order.orderNumber} · {order.cropName}</p>
        <p style={s.qty}>{order.farmerName || order.buyerName}</p>
      </div>
      <div style={{ textAlign: 'right' }}>
        <span style={{ ...s.statusDot, background: colors[order.status] }}>{order.status}</span>
        <p style={s.orderAmt}>₹{order.totalAmount?.toLocaleString('en-IN')}</p>
      </div>
    </div>
  );
}

function Avatar({ url, name }: { url?: string; name?: string }) {
  return url
    ? <img src={url} style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)' }} alt="" />
    : <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#c8e6c9', color: '#2d7a2d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700 }}>{name?.[0] || 'U'}</div>;
}

function Empty({ text }: { text: string }) {
  return <p style={{ color: '#bbb', textAlign: 'center', padding: '16px 0', fontSize: 14 }}>{text}</p>;
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#f5f5f0', paddingBottom: 80 },
  header: { background: 'linear-gradient(135deg, #1b5e20, #2d7a2d)', padding: '44px 20px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  alert: { background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 12, padding: '4px 10px', borderRadius: 20, marginBottom: 8, display: 'inline-block' },
  name: { color: '#fff', fontSize: 22, fontWeight: 700 },
  loc: { color: '#c8e6c9', fontSize: 13, marginTop: 4 },
  body: { padding: '16px' },
  statsRow: { display: 'flex', gap: 10, marginBottom: 14 },
  stat: { flex: 1, borderRadius: 14, padding: '14px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
  statVal: { fontSize: 18, fontWeight: 700 },
  statLabel: { fontSize: 10, color: '#666', textAlign: 'center' },
  postBtn: { width: '100%', background: '#2d7a2d', color: '#fff', padding: 14, borderRadius: 12, fontSize: 15, fontWeight: 700, marginBottom: 14, border: 'none', cursor: 'pointer' },
  ctaRow: { display: 'flex', gap: 10, marginBottom: 14 },
  section: { background: '#fff', borderRadius: 16, padding: 16, marginBottom: 14, boxShadow: '0 1px 8px rgba(0,0,0,0.06)' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: 700, color: '#222' },
  seeAll: { fontSize: 13, color: '#2d7a2d', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' },
  needRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, marginBottom: 12, borderBottom: '1px solid #f5f5f5' },
  needBadge: { fontSize: 11, background: '#e3f2fd', color: '#1565c0', padding: '2px 8px', borderRadius: 20, fontWeight: 600, marginBottom: 4, display: 'inline-block' },
  acceptBtn: { background: '#e8f5e9', border: '1.5px solid #2d7a2d', borderRadius: 8, padding: '8px 12px', color: '#2d7a2d', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  orderRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, marginBottom: 12, borderBottom: '1px solid #f5f5f5' },
  orderNum: { fontSize: 14, fontWeight: 600, color: '#333' },
  statusDot: { color: '#fff', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, display: 'inline-block' },
  orderAmt: { fontSize: 15, fontWeight: 700, color: '#222', marginTop: 4 },
  listCard: { display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 12, marginBottom: 12, borderBottom: '1px solid #f5f5f5' },
  cropImg: { width: 52, height: 52, borderRadius: 10, objectFit: 'cover' },
  crop: { fontSize: 15, fontWeight: 600, color: '#222' },
  variety: { fontWeight: 400, color: '#888', fontSize: 13 },
  qty: { fontSize: 12, color: '#999', marginTop: 2 },
  price: { fontSize: 16, fontWeight: 700, color: '#2d7a2d' },
  perKg: { fontSize: 12, color: '#999', fontWeight: 400 },
  orderBtn: { background: '#e8f5e9', border: '1px solid #2d7a2d', borderRadius: 8, padding: '4px 10px', color: '#2d7a2d', fontSize: 12, fontWeight: 600, cursor: 'pointer', marginTop: 4 },
};
