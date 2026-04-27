import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { subscribeToNeeds, createOrder, updateOrderStatus, Need } from '../services/firestoreService';

const TYPE_LABELS: Record<string, string> = { shop: '🏪 Shop', restaurant: '🍽 Restaurant', bulk: '📦 Bulk Buyer' };
const TYPE_COLORS: Record<string, string> = { shop: '#1565c0', restaurant: '#6a1b9a', bulk: '#e65100' };

export default function NeedsFeedPage() {
  const { userProfile, user } = useAuth();
  const { t } = useLanguage();
  const [needs, setNeeds] = useState<Need[]>([]);
  const [accepting, setAccepting] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeToNeeds(setNeeds);
    return unsub;
  }, []);

  const handleAccept = async (need: Need) => {
    if (!user || !userProfile) return;
    setAccepting(need.id);
    await createOrder({
      flowType: 'B', needId: need.id,
      farmerId: user.uid, buyerId: need.buyerId,
      farmerName: userProfile.displayName, buyerName: need.buyerName,
      cropName: need.cropName, quantityKg: need.quantityKg,
      pricePerKg: need.maxPricePerKg,
      totalAmount: need.quantityKg * need.maxPricePerKg,
      deliveryDistrict: need.district, status: 'confirmed',
      farmerPhone: userProfile.phone, buyerPhone: undefined,
    });
    setDone(need.id);
    setAccepting(null);
    setTimeout(() => setDone(null), 3000);
  };

  const myNeeds = needs.filter(n => userProfile?.role === 'buyer' && n.buyerId === user?.uid);
  const openNeeds = needs.filter(n => n.buyerId !== user?.uid);

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h2 style={s.title}>{t('buyerNeedsFeed')}</h2>
        <p style={s.sub}>{openNeeds.length} open requests from buyers</p>
      </div>

      <div style={s.body}>
        {done && <div style={s.toast}>✅ {t('needAccepted')}</div>}

        {userProfile?.role === 'buyer' && myNeeds.length > 0 && (
          <div style={s.section}>
            <h3 style={s.sectionTitle}>{t('myNeeds')}</h3>
            {myNeeds.map(n => <NeedCard key={n.id} need={n} isOwn />)}
          </div>
        )}

        <div style={s.section}>
          <h3 style={s.sectionTitle}>Open Buyer Requests</h3>
          {openNeeds.length === 0
            ? <p style={s.empty}>{t('noNeeds')}</p>
            : openNeeds.map(n => (
              <NeedCard key={n.id} need={n}
                onAccept={userProfile?.role === 'farmer' ? () => handleAccept(n) : undefined}
                accepting={accepting === n.id}
                accepted={done === n.id}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

function NeedCard({ need, onAccept, accepting, accepted, isOwn }: {
  need: Need; onAccept?: () => void; accepting?: boolean; accepted?: boolean; isOwn?: boolean;
}) {
  const color = TYPE_COLORS[need.buyerType] || '#555';
  const ago = Math.round((Date.now() - (need.createdAt?.seconds || 0) * 1000) / 3600000);
  return (
    <div style={s.card}>
      <div style={s.cardTop}>
        <span style={{ ...s.typeBadge, background: color + '20', color }}>{TYPE_LABELS[need.buyerType] || need.buyerType}</span>
        {isOwn && <span style={s.ownBadge}>Your Post</span>}
        <span style={s.ago}>{ago > 0 ? `${ago}h ago` : 'Just now'}</span>
      </div>
      <div style={s.cardMid}>
        <div>
          <p style={s.cropName}>{need.cropName}</p>
          <p style={s.detail}>📦 {need.quantityKg} kg needed</p>
          <p style={s.detail}>💰 Max ₹{need.maxPricePerKg}/kg · 📍 {need.district}</p>
          {need.description && <p style={s.desc}>{need.description}</p>}
        </div>
        <div style={s.totalEstimate}>
          <p style={s.estLabel}>Est. Value</p>
          <p style={s.estVal}>₹{(need.quantityKg * need.maxPricePerKg).toLocaleString('en-IN')}</p>
        </div>
      </div>
      {onAccept && (
        <button style={{ ...s.acceptBtn, ...(accepted ? s.acceptedBtn : {}) }}
          onClick={onAccept} disabled={accepting || accepted}>
          {accepted ? '✅ Accepted!' : accepting ? 'Accepting...' : '✅ Accept This Need'}
        </button>
      )}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#f5f5f0', paddingBottom: 80 },
  header: { background: 'linear-gradient(135deg, #1b5e20, #2d7a2d)', padding: '44px 20px 16px' },
  title: { color: '#fff', fontSize: 24, fontWeight: 700 },
  sub: { color: '#c8e6c9', fontSize: 13, marginTop: 4 },
  body: { padding: 16 },
  toast: { background: '#e8f5e9', border: '1px solid #4caf50', borderRadius: 10, padding: '12px 16px', marginBottom: 16, color: '#2d7a2d', fontWeight: 600, textAlign: 'center' },
  section: { background: '#fff', borderRadius: 16, padding: 16, marginBottom: 14, boxShadow: '0 1px 8px rgba(0,0,0,0.06)' },
  sectionTitle: { fontSize: 15, fontWeight: 700, color: '#222', marginBottom: 12 },
  empty: { color: '#bbb', textAlign: 'center', padding: '20px 0', fontSize: 14 },
  card: { border: '1px solid #eee', borderRadius: 12, padding: 14, marginBottom: 12 },
  cardTop: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 },
  typeBadge: { fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20 },
  ownBadge: { fontSize: 11, background: '#fff8e1', color: '#f57f17', padding: '3px 8px', borderRadius: 20, fontWeight: 600 },
  ago: { fontSize: 12, color: '#bbb', marginLeft: 'auto' },
  cardMid: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  cropName: { fontSize: 18, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 },
  detail: { fontSize: 13, color: '#666', marginBottom: 2 },
  desc: { fontSize: 13, color: '#888', marginTop: 6, fontStyle: 'italic' },
  totalEstimate: { textAlign: 'right' },
  estLabel: { fontSize: 11, color: '#aaa' },
  estVal: { fontSize: 18, fontWeight: 700, color: '#2d7a2d' },
  acceptBtn: { width: '100%', background: '#2d7a2d', color: '#fff', padding: '12px', borderRadius: 10, fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', marginTop: 12 },
  acceptedBtn: { background: '#4caf50', cursor: 'default' },
};
