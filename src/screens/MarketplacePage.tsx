import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { subscribeToListings, createOrder, Listing } from '../services/firestoreService';

const CROPS = ['All','Tomato','Onion','Potato','Chilli','Brinjal','Okra','Cabbage','Carrot','Beans'];

export default function MarketplacePage() {
  const { userProfile, user } = useAuth();
  const { t } = useLanguage();
  const [listings, setListings] = useState<Listing[]>([]);
  const [search, setSearch] = useState('');
  const [cropFilter, setCropFilter] = useState('All');
  const [orderModal, setOrderModal] = useState<Listing | null>(null);

  useEffect(() => {
    const unsub = subscribeToListings(setListings);
    return unsub;
  }, []);

  const filtered = listings.filter(l => {
    const matchCrop = cropFilter === 'All' || l.cropName.toLowerCase() === cropFilter.toLowerCase();
    const matchSearch = !search || l.cropName.toLowerCase().includes(search.toLowerCase()) || l.district.toLowerCase().includes(search.toLowerCase());
    return matchCrop && matchSearch;
  });

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h2 style={s.title}>{t('marketplace')}</h2>
        <p style={s.sub}>{filtered.length} listings available</p>
      </div>

      <div style={s.filters}>
        <input style={s.search} placeholder={t('search')} value={search} onChange={e => setSearch(e.target.value)} />
        <div style={s.chipRow}>
          {CROPS.map(c => (
            <button key={c} onClick={() => setCropFilter(c)}
              style={{ ...s.chip, ...(cropFilter === c ? s.chipOn : {}) }}>{c}</button>
          ))}
        </div>
      </div>

      <div style={s.grid}>
        {filtered.length === 0
          ? <div style={s.empty}><p style={{ fontSize: 40 }}>🌾</p><p>{t('noListings')}</p></div>
          : filtered.map(l => (
            <div key={l.id} style={s.card}>
              <div style={s.imgWrap}>
                {l.imageURL
                  ? <img src={l.imageURL} alt={l.cropName} style={s.img} />
                  : <div style={s.imgPlaceholder}>{cropEmoji(l.cropName)}</div>}
                <span style={s.districtBadge}>📍 {l.district}</span>
              </div>
              <div style={s.cardBody}>
                <div style={s.cardTop}>
                  <div>
                    <p style={s.cropName}>{l.cropName}</p>
                    <p style={s.variety}>{l.variety} · {l.quantityKg} kg available</p>
                    <p style={s.farmerName}>by {l.farmerName}</p>
                  </div>
                  <div style={s.priceBox}>
                    <span style={s.price}>₹{l.pricePerKg}</span>
                    <span style={s.perKg}>/kg</span>
                  </div>
                </div>
                {l.description && <p style={s.desc}>{l.description}</p>}
                {userProfile?.role === 'buyer' && (
                  <button style={s.orderBtn} onClick={() => setOrderModal(l)}>
                    🛒 {t('orderNow')}
                  </button>
                )}
                {userProfile?.role === 'farmer' && l.farmerId === user?.uid && (
                  <span style={s.myBadge}>Your Listing</span>
                )}
              </div>
            </div>
          ))}
      </div>

      {orderModal && (
        <OrderModal listing={orderModal} onClose={() => setOrderModal(null)}
          onConfirm={() => setOrderModal(null)} />
      )}
    </div>
  );
}

function OrderModal({ listing, onClose, onConfirm }: { listing: Listing; onClose: () => void; onConfirm: () => void }) {
  const { userProfile, user } = useAuth();
  const { t } = useLanguage();
  const [qty, setQty] = useState(10);
  const [notes, setNotes] = useState('');
  const [placing, setPlacing] = useState(false);
  const [done, setDone] = useState(false);

  const total = qty * listing.pricePerKg;

  const handleOrder = async () => {
    if (!user || !userProfile) return;
    setPlacing(true);
    await createOrder({
      flowType: 'A', listingId: listing.id,
      farmerId: listing.farmerId, buyerId: user.uid,
      farmerName: listing.farmerName, buyerName: userProfile.displayName,
      buyerBusinessName: userProfile.businessName,
      cropName: listing.cropName, quantityKg: qty,
      pricePerKg: listing.pricePerKg, totalAmount: total,
      deliveryDistrict: userProfile.district || listing.district,
      notes, status: 'pending',
    });
    setDone(true);
    setPlacing(false);
    setTimeout(onConfirm, 1500);
  };

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={e => e.stopPropagation()}>
        {done ? (
          <div style={{ textAlign: 'center', padding: 32 }}>
            <p style={{ fontSize: 56 }}>✅</p>
            <p style={{ fontWeight: 700, color: '#2d7a2d', fontSize: 18 }}>{t('orderPlaced')}</p>
          </div>
        ) : (<>
          <div style={s.modalHeader}>
            <h3 style={s.modalTitle}>{t('orderNow')}</h3>
            <button style={s.closeBtn} onClick={onClose}>✕</button>
          </div>
          <p style={s.modalSub}>{listing.cropName} · {listing.farmerName} · ₹{listing.pricePerKg}/kg</p>
          <label style={s.label}>Quantity (kg)</label>
          <input type="number" min={1} max={listing.quantityKg} value={qty}
            onChange={e => setQty(Number(e.target.value))}
            style={s.input} />
          <div style={s.totalBox}>
            <span>Total</span><span style={s.totalVal}>₹{total.toLocaleString('en-IN')}</span>
          </div>
          <label style={s.label}>Notes (optional)</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
            placeholder="Delivery instructions, quality preference..." style={s.textarea} />
          <button style={s.confirmBtn} onClick={handleOrder} disabled={placing}>
            {placing ? t('loading') : `Confirm Order · ₹${total.toLocaleString('en-IN')}`}
          </button>
        </>)}
      </div>
    </div>
  );
}

function cropEmoji(name: string): string {
  const map: Record<string, string> = { Tomato:'🍅', Onion:'🧅', Potato:'🥔', Chilli:'🌶️', Brinjal:'🍆', Okra:'🥬' };
  return map[name] || '🌾';
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#f5f5f0', paddingBottom: 80 },
  header: { background: 'linear-gradient(135deg, #1b5e20, #2d7a2d)', padding: '44px 20px 16px' },
  title: { color: '#fff', fontSize: 24, fontWeight: 700 },
  sub: { color: '#c8e6c9', fontSize: 13, marginTop: 4 },
  filters: { padding: '14px 16px', background: '#fff', borderBottom: '1px solid #eee' },
  search: { width: '100%', padding: '10px 14px', border: '1.5px solid #ddd', borderRadius: 10, fontSize: 14, marginBottom: 10, boxSizing: 'border-box' },
  chipRow: { display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 },
  chip: { padding: '6px 14px', borderRadius: 20, border: '1.5px solid #ddd', background: '#fafafa', fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' },
  chipOn: { background: '#2d7a2d', borderColor: '#2d7a2d', color: '#fff', fontWeight: 600 },
  grid: { padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 },
  empty: { textAlign: 'center', padding: '60px 0', color: '#bbb', gridColumn: '1/-1' },
  card: { background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  imgWrap: { position: 'relative', height: 180 },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  imgPlaceholder: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e8f5e9', fontSize: 64 },
  districtBadge: { position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 11, padding: '3px 8px', borderRadius: 20 },
  cardBody: { padding: 16 },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  cropName: { fontSize: 18, fontWeight: 700, color: '#1a1a1a' },
  variety: { fontSize: 13, color: '#888', marginTop: 2 },
  farmerName: { fontSize: 12, color: '#aaa', marginTop: 2 },
  priceBox: { textAlign: 'right' },
  price: { fontSize: 22, fontWeight: 700, color: '#2d7a2d' },
  perKg: { fontSize: 12, color: '#999' },
  desc: { fontSize: 13, color: '#666', marginBottom: 12, lineHeight: 1.5 },
  orderBtn: { width: '100%', background: '#2d7a2d', color: '#fff', padding: '12px', borderRadius: 10, fontSize: 15, fontWeight: 600, border: 'none', cursor: 'pointer' },
  myBadge: { display: 'block', textAlign: 'center', color: '#2d7a2d', fontWeight: 600, fontSize: 13, background: '#e8f5e9', padding: '8px', borderRadius: 10 },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', zIndex: 2000 },
  modal: { background: '#fff', borderRadius: '20px 20px 0 0', padding: 24, width: '100%', maxWidth: 480, margin: '0 auto', maxHeight: '85vh', overflowY: 'auto' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  modalTitle: { fontSize: 20, fontWeight: 700 },
  closeBtn: { background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#888' },
  modalSub: { color: '#888', fontSize: 14, marginBottom: 16 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6, marginTop: 14 },
  input: { width: '100%', padding: '12px 14px', border: '1.5px solid #ddd', borderRadius: 10, fontSize: 16 },
  totalBox: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#e8f5e9', padding: '12px 16px', borderRadius: 10, margin: '12px 0' },
  totalVal: { fontSize: 22, fontWeight: 700, color: '#2d7a2d' },
  textarea: { width: '100%', padding: '12px 14px', border: '1.5px solid #ddd', borderRadius: 10, fontSize: 14, resize: 'none', fontFamily: 'inherit' },
  confirmBtn: { width: '100%', background: '#2d7a2d', color: '#fff', padding: 16, borderRadius: 12, fontSize: 16, fontWeight: 700, marginTop: 16, border: 'none', cursor: 'pointer' },
};
