import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { subscribeToOrders, updateOrderStatus, Order } from '../services/firestoreService';

const STATUS_COLORS: Record<string,string> = { pending:'#ff9800',confirmed:'#2196f3',packed:'#9c27b0',out_for_delivery:'#00bcd4',delivered:'#4caf50',cancelled:'#f44336' };
const STEPS = ['pending','confirmed','packed','out_for_delivery','delivered'];
const NEXT: Record<string,string> = { pending:'confirmed',confirmed:'packed',packed:'out_for_delivery',out_for_delivery:'delivered' };

export default function OrdersPage() {
  const { userProfile, user } = useAuth();
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState('all');
  const role = userProfile?.role || 'farmer';

  useEffect(() => {
    if (!user) return;
    return subscribeToOrders(user.uid, role, setOrders);
  }, [user, role]);

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const advance = async (order: Order) => {
    const next = NEXT[order.status];
    if (!next || !user) return;
    await updateOrderStatus(order.id, next, user.uid);
  };

  const labels: Record<string,string> = { pending: t('pending'), confirmed: t('confirmed'), packed: t('packed'), out_for_delivery: t('outForDelivery'), delivered: t('delivered'), cancelled: t('cancelled') };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h2 style={s.title}>{t('orders')}</h2>
        <span style={s.count}>{orders.length} total</span>
      </div>

      <div style={s.filters}>
        {['all','pending','confirmed','delivered','cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ ...s.filterBtn, ...(filter === f ? s.filterOn : {}) }}>
            {f === 'all' ? 'All' : labels[f]}
          </button>
        ))}
      </div>

      {filtered.length === 0
        ? <div style={s.empty}><p style={{ fontSize: 48 }}>📭</p><p>{t('noOrders')}</p></div>
        : filtered.map(o => (
          <div key={o.id} style={s.card}>
            <div style={s.cardTop}>
              <div>
                <span style={s.orderNum}>#{o.orderNumber}</span>
                <span style={{ ...s.badge, background: STATUS_COLORS[o.status] }}>{labels[o.status]}</span>
                {o.flowType === 'B' && <span style={s.flowBadge}>Need Match</span>}
              </div>
              <span style={s.amount}>₹{o.totalAmount?.toLocaleString('en-IN')}</span>
            </div>

            <div style={s.details}>
              <div style={s.detRow}><span>🌾</span><span>{o.cropName} · {o.quantityKg} kg @ ₹{o.pricePerKg}/kg</span></div>
              {role === 'farmer'
                ? <div style={s.detRow}><span>🏪</span><span>{o.buyerBusinessName || o.buyerName} · {o.deliveryDistrict}</span></div>
                : <div style={s.detRow}><span>🧑‍🌾</span><span>{o.farmerName} · {o.deliveryDistrict}</span></div>}
              <div style={s.detRow}><span>🗓</span><span>{o.createdAt?.seconds ? new Date(o.createdAt.seconds * 1000).toLocaleDateString('en-IN') : 'Just now'}</span></div>
            </div>

            {role === 'buyer' && <StatusStepper status={o.status} />}

            {/* Contact reveal after confirmed */}
            {o.status !== 'pending' && o.status !== 'cancelled' && (
              <div style={s.contactBox}>
                {role === 'farmer' && o.buyerPhone
                  ? <a href={`tel:${o.buyerPhone}`} style={s.contactLink}>📞 {t('contactBuyer')}: {o.buyerPhone}</a>
                  : role === 'buyer' && o.farmerPhone
                  ? <a href={`tel:${o.farmerPhone}`} style={s.contactLink}>📞 {t('contactFarmer')}: {o.farmerPhone}</a>
                  : <p style={s.contactHidden}>📞 {t('contactRevealed')}</p>}
              </div>
            )}

            {role === 'farmer' && NEXT[o.status] && (
              <button style={s.advBtn} onClick={() => advance(o)}>
                Mark as {labels[NEXT[o.status]]} →
              </button>
            )}
            {o.status === 'delivered' && <div style={s.completedBadge}>✅ Order Complete</div>}
          </div>
        ))
      }
    </div>
  );
}

function StatusStepper({ status }: { status: string }) {
  const idx = STEPS.indexOf(status);
  const labels: Record<string,string> = { pending:'Pending', confirmed:'Confirmed', packed:'Packed', out_for_delivery:'Shipped', delivered:'Delivered' };
  return (
    <div style={st.stepper}>
      {STEPS.map((step, i) => (
        <React.Fragment key={step}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ ...st.dot, ...(i <= idx ? st.dotDone : i === idx + 1 ? st.dotNext : {}) }}>
              {i < idx ? '✓' : i + 1}
            </div>
            <span style={{ ...st.stepLabel, ...(i <= idx ? { color: '#2d7a2d', fontWeight: 600 } : {}) }}>{labels[step]}</span>
          </div>
          {i < STEPS.length - 1 && <div style={{ ...st.line, ...(i < idx ? st.lineDone : {}) }} />}
        </React.Fragment>
      ))}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#f5f5f0', paddingBottom: 80 },
  header: { background: 'linear-gradient(135deg, #1b5e20, #2d7a2d)', padding: '44px 20px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: '#fff', fontSize: 24, fontWeight: 700 },
  count: { background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 13, padding: '4px 12px', borderRadius: 20 },
  filters: { display: 'flex', gap: 8, padding: '14px 16px', overflowX: 'auto' },
  filterBtn: { padding: '7px 14px', borderRadius: 20, border: '1.5px solid #ddd', background: '#fff', fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' },
  filterOn: { background: '#2d7a2d', borderColor: '#2d7a2d', color: '#fff', fontWeight: 600 },
  empty: { textAlign: 'center', padding: '60px 0', color: '#bbb' },
  card: { background: '#fff', borderRadius: 16, margin: '0 16px 14px', padding: 16, boxShadow: '0 1px 8px rgba(0,0,0,0.07)' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  orderNum: { fontSize: 15, fontWeight: 700, color: '#333', marginRight: 8 },
  badge: { color: '#fff', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20 },
  flowBadge: { fontSize: 11, background: '#fff8e1', color: '#f57f17', padding: '3px 8px', borderRadius: 20, fontWeight: 600, marginLeft: 6 },
  amount: { fontSize: 22, fontWeight: 700, color: '#2d7a2d' },
  details: { background: '#fafafa', borderRadius: 10, padding: '10px 12px', marginBottom: 12 },
  detRow: { display: 'flex', gap: 8, fontSize: 13, color: '#555', marginBottom: 4 },
  contactBox: { background: '#e8f5e9', borderRadius: 10, padding: '10px 14px', marginBottom: 12 },
  contactLink: { color: '#2d7a2d', fontWeight: 600, fontSize: 14, textDecoration: 'none' },
  contactHidden: { color: '#888', fontSize: 13, fontStyle: 'italic' },
  advBtn: { width: '100%', background: '#e8f5e9', border: '1.5px solid #2d7a2d', borderRadius: 10, padding: '11px 0', color: '#2d7a2d', fontWeight: 700, fontSize: 14, cursor: 'pointer' },
  completedBadge: { textAlign: 'center', color: '#2d7a2d', fontWeight: 600, fontSize: 14, padding: '10px 0', background: '#e8f5e9', borderRadius: 10 },
};

const st: Record<string, React.CSSProperties> = {
  stepper: { display: 'flex', alignItems: 'center', marginBottom: 12, overflowX: 'auto', paddingBottom: 4 },
  dot: { width: 28, height: 28, borderRadius: '50%', background: '#e0e0e0', color: '#999', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 },
  dotDone: { background: '#2d7a2d', color: '#fff' },
  dotNext: { background: '#e8f5e9', color: '#2d7a2d', border: '2px solid #2d7a2d' },
  line: { flex: 1, height: 2, background: '#e0e0e0', minWidth: 20, marginBottom: 16 },
  lineDone: { background: '#2d7a2d' },
  stepLabel: { fontSize: 10, color: '#aaa', whiteSpace: 'nowrap' },
};
