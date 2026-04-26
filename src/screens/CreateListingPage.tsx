import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from '../services/store';

const CROPS = ['Tomato', 'Onion', 'Potato', 'Chilli', 'Brinjal', 'Okra', 'Cabbage', 'Cauliflower', 'Carrot', 'Beans', 'Cucumber', 'Pumpkin', 'Bitter Gourd', 'Bottle Gourd', 'Spinach'];
const DISTRICTS = ['Hyderabad', 'Warangal', 'Karimnagar', 'Nizamabad', 'Khammam', 'Medak', 'Nalgonda', 'Adilabad', 'Mahbubnagar', 'Rangareddy'];
const ICONS: Record<string, string> = { Tomato: '🍅', Onion: '🧅', Potato: '🥔', Chilli: '🌶️', Brinjal: '🍆', Okra: '🥬', Cabbage: '🥬', Cauliflower: '🥦', Carrot: '🥕', Beans: '🫘', Cucumber: '🥒', Pumpkin: '🎃', 'Bitter Gourd': '🥬', 'Bottle Gourd': '🥬', Spinach: '🥬' };

export default function CreateListingPage() {
  const navigate = useNavigate();
  const profile = store.getProfile();
  const [form, setForm] = useState({ crop_name: 'Tomato', variety: '', quantity_kg: '', price_per_kg: '', district: profile?.district || 'Hyderabad', description: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const upd = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.quantity_kg || !form.price_per_kg) { setError('Quantity and price are required'); return; }
    if (Number(form.quantity_kg) <= 0 || Number(form.price_per_kg) <= 0) { setError('Enter valid quantity and price'); return; }
    store.addListing({
      crop_name: form.crop_name,
      variety: form.variety || 'Standard',
      quantity_kg: Number(form.quantity_kg),
      price_per_kg: Number(form.price_per_kg),
      district: form.district,
      description: form.description,
    });
    setSuccess(true);
    setTimeout(() => navigate('/dashboard'), 1200);
  };

  if (success) return (
    <div style={s.successPage}>
      <div style={s.successIcon}>✅</div>
      <h2 style={s.successTitle}>Listing Posted!</h2>
      <p style={s.successSub}>Your crop is now visible to shops</p>
    </div>
  );

  return (
    <div style={s.page}>
      <div style={s.header}>
        <button style={s.back} onClick={() => navigate(-1)}>←</button>
        <h2 style={s.title}>Post a Crop Listing</h2>
      </div>

      <div style={s.body}>
        <div style={s.section}>
          <label style={s.label}>Select Crop</label>
          <div style={s.cropGrid}>
            {CROPS.map(c => (
              <button key={c} onClick={() => upd('crop_name', c)}
                style={{ ...s.cropBtn, ...(form.crop_name === c ? s.cropBtnOn : {}) }}>
                <span>{ICONS[c] || '🌿'}</span>
                <span style={{ fontSize: 12 }}>{c}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={s.card}>
          <div style={s.row2}>
            <div style={{ flex: 1 }}>
              <label style={s.label}>Quantity (kg) *</label>
              <input style={s.input} type="number" placeholder="e.g. 500" value={form.quantity_kg} onChange={e => upd('quantity_kg', e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={s.label}>Price / kg (₹) *</label>
              <input style={s.input} type="number" placeholder="e.g. 28" value={form.price_per_kg} onChange={e => upd('price_per_kg', e.target.value)} />
            </div>
          </div>

          <label style={s.label}>Variety</label>
          <input style={s.input} placeholder="e.g. Hybrid, Desi, F1" value={form.variety} onChange={e => upd('variety', e.target.value)} />

          <label style={s.label}>District</label>
          <select style={s.select} value={form.district} onChange={e => upd('district', e.target.value)}>
            {DISTRICTS.map(d => <option key={d}>{d}</option>)}
          </select>

          <label style={s.label}>Description</label>
          <textarea style={s.textarea} placeholder="Describe quality, harvest date, delivery..." value={form.description} onChange={e => upd('description', e.target.value)} rows={3} />
        </div>

        {form.quantity_kg && form.price_per_kg && (
          <div style={s.preview}>
            <span style={s.previewLabel}>Total value estimate</span>
            <span style={s.previewVal}>₹{(Number(form.quantity_kg) * Number(form.price_per_kg)).toLocaleString('en-IN')}</span>
          </div>
        )}

        {error && <p style={s.error}>⚠ {error}</p>}
        <button style={s.btn} onClick={handleSubmit}>Post Listing 🌾</button>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#f5f5f0' },
  header: { background: 'linear-gradient(135deg, #1b5e20, #2d7a2d)', padding: '44px 24px 20px', display: 'flex', alignItems: 'center', gap: 16 },
  back: { background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', width: 36, height: 36, borderRadius: '50%', fontSize: 18, cursor: 'pointer' },
  title: { color: '#fff', fontSize: 22, fontWeight: 700 },
  body: { padding: '20px 20px 100px' },
  section: { marginBottom: 20 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 8, marginTop: 14 },
  cropGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 },
  cropBtn: { background: '#fff', border: '1.5px solid #ddd', borderRadius: 10, padding: '10px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer', fontSize: 20 },
  cropBtnOn: { background: '#e8f5e9', borderColor: '#2d7a2d', color: '#2d7a2d' },
  card: { background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  row2: { display: 'flex', gap: 12 },
  input: { width: '100%', padding: '11px 14px', border: '1.5px solid #ddd', borderRadius: 10, fontSize: 15, background: '#fafafa', marginBottom: 4 },
  select: { width: '100%', padding: '11px 14px', border: '1.5px solid #ddd', borderRadius: 10, fontSize: 15, background: '#fafafa', cursor: 'pointer' },
  textarea: { width: '100%', padding: '11px 14px', border: '1.5px solid #ddd', borderRadius: 10, fontSize: 14, background: '#fafafa', resize: 'none', fontFamily: 'inherit' },
  preview: { background: '#e8f5e9', borderRadius: 12, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
  previewLabel: { color: '#555', fontSize: 14 },
  previewVal: { color: '#2d7a2d', fontSize: 22, fontWeight: 700 },
  error: { color: '#c62828', background: '#ffebee', padding: '10px 14px', borderRadius: 8, marginTop: 12, fontSize: 13 },
  btn: { width: '100%', background: '#2d7a2d', color: '#fff', padding: 16, borderRadius: 12, fontSize: 16, fontWeight: 700, marginTop: 16 },
  successPage: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f5f5f0' },
  successIcon: { fontSize: 72, marginBottom: 16 },
  successTitle: { fontSize: 28, fontWeight: 700, color: '#2d7a2d' },
  successSub: { color: '#888', marginTop: 8, fontSize: 15 },
};
