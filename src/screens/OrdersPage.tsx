import React, { useEffect, useState } from 'react';
import { store, Order } from '../services/store';

const STATUS_COLORS: Record<string, string> = { pending: '#ff9800', confirmed: '#2196f3', packed: '#9c27b0', out_for_delivery: '#00bcd4', delivered: '#4caf50', cancelled: '#f44336' };
const STATUS_LABELS: Record<string, string> = { pending: 'Pending', confirmed: 'Confirmed', packed: 'Packed', out_for_delivery: 'Out for Delivery', delivered: 'Delivered', cancelled: 'Cancelled' };
const NEXT: Record<string, Order['status']> = { pending: 'confirmed', confirmed: 'packed', packed: 'out_for_delivery', out_for_delivery: 'delivered' };

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => { setOrders(store.getOrders()); }, []);

  const advance = (id: string, next: Order['status']) => {
    store.updateOrderStatus(id, next);
    setOrders(store.getOrders());
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h2 style={s.title}>Orders</h2>
        <span style={s.count}>{orders.length} total</span>
      </div>

      <div style={s.filters}>
        {['all', 'pending', 'confirmed', 'delivered'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ ...s.filterBtn, ...(filter === f ? s.filterOn : {}) }}>
            {f === 'all' ? 'All' : STATUS_LABELS[f]}
          </button>
        ))}
      </div>

      {filtered.length === 0
        ? <div style={s.empty}><p style={{ fontSize: 40 }}>📭</p><p>No orders here</p></div>
        : filtered.map(o => (
          <div key={o.id} style={s.card}>
            <div style={s.cardTop}>
              <div>
                <span style={s.orderNum}>#{o.order_number}</span>
                <span style={{ ...s.badge, background: STATUS_COLORS[o.status] }}>{STATUS_LABELS[o.status]}</span>
              </div>
              <span style={s.amount}>₹{o.total_amount.toLocaleString('en-IN')}</span>
            </div>

            <div style={s.details}>
              <div style={s.detailRow}><span style={s.detailIcon}>🌾</span><span>{o.crop_name} · {o.quantity_kg} kg @ ₹{o.price_per_kg}/kg</span></div>
              <div style={s.detailRow}><span style={s.detailIcon}>🏪</span><span>{o.shop_name}</span></div>
              <div style={s.detailRow}><span style={s.detailIcon}>📍</span><span>{o.shop_location}</span></div>
              <div style={s.detailRow}><span style={s.detailIcon}>🗓</span><span>{new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
            </div>

            {NEXT[o.status] && (
              <button style={s.advBtn} onClick={() => advance(o.id, NEXT[o.status])}>
                Mark as {STATUS_LABELS[NEXT[o.status]]} →
              </button>
            )}
            {o.status === 'delivered' && <div style={s.deliveredBadge}>✅ Order Complete</div>}
          </div>
        ))
      }
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#f5f5f0', paddingBottom: 80 },
  header: { background: 'linear-gradient(135deg, #1b5e20, #2d7a2d)', padding: '44px 20px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: '#fff', fontSize: 24, fontWeight: 700 },
  count: { background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 13, padding: '4px 12px', borderRadius: 20 },
  filters: { display: 'flex', gap: 8, padding: '14px 16px', overflowX: 'auto' },
  filterBtn: { padding: '7px 16px', borderRadius: 20, border: '1.5px solid #ddd', background: '#fff', fontSize: 13, color: '#666', cursor: 'pointer', whiteSpace: 'nowrap' },
  filterOn: { background: '#2d7a2d', borderColor: '#2d7a2d', color: '#fff', fontWeight: 600 },
  empty: { textAlign: 'center', padding: '60px 0', color: '#bbb' },
  card: { background: '#fff', borderRadius: 16, margin: '0 16px 14px', padding: 16, boxShadow: '0 1px 8px rgba(0,0,0,0.07)' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  orderNum: { fontSize: 15, fontWeight: 700, color: '#333', marginRight: 8 },
  badge: { color: '#fff', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20 },
  amount: { fontSize: 22, fontWeight: 700, color: '#2d7a2d' },
  details: { background: '#fafafa', borderRadius: 10, padding: '10px 12px', marginBottom: 12 },
  detailRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, fontSize: 13, color: '#555' },
  detailIcon: { fontSize: 15, width: 20 },
  advBtn: { width: '100%', background: '#e8f5e9', border: '1.5px solid #2d7a2d', borderRadius: 10, padding: '11px 0', color: '#2d7a2d', fontWeight: 700, fontSize: 14, cursor: 'pointer' },
  deliveredBadge: { textAlign: 'center', color: '#2d7a2d', fontWeight: 600, fontSize: 14, padding: '10px 0', background: '#e8f5e9', borderRadius: 10 },
};
