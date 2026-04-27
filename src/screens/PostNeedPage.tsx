import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { createNeed } from '../services/firestoreService';

const CROPS = ['Tomato','Onion','Potato','Chilli','Brinjal','Okra','Cabbage','Cauliflower','Carrot','Beans','Cucumber','Pumpkin','Bitter Gourd','Spinach','Ginger','Garlic'];
const ICONS: Record<string,string> = { Tomato:'🍅',Onion:'🧅',Potato:'🥔',Chilli:'🌶️',Brinjal:'🍆',Okra:'🥬',Cabbage:'🥬',Cauliflower:'🥦',Carrot:'🥕',Beans:'🫘',Cucumber:'🥒',Pumpkin:'🎃','Bitter Gourd':'🌿',Spinach:'🥬',Ginger:'🫚',Garlic:'🧄' };
const DISTRICTS = ['Hyderabad','Rangareddy','Warangal','Karimnagar','Nizamabad','Khammam','Nalgonda','Medak','Adilabad','Mahbubnagar'];

export default function PostNeedPage() {
  const { userProfile, user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [crop, setCrop] = useState('Tomato');
  const [form, setForm] = useState({ quantityKg: '', maxPricePerKg: '', district: 'Hyderabad', description: '' });
  const [posting, setPosting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const upd = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!user || !userProfile) return;
    if (!form.quantityKg || !form.maxPricePerKg) { setError('Quantity and max price are required'); return; }
    setPosting(true); setError('');
    await createNeed({
      buyerId: user.uid, buyerName: userProfile.displayName,
      buyerType: userProfile.buyerType || 'shop',
      cropName: crop, quantityKg: Number(form.quantityKg),
      maxPricePerKg: Number(form.maxPricePerKg),
      district: form.district, description: form.description,
    });
    setDone(true); setPosting(false);
  };

  if (done) return (
    <div style={s.successPage}>
      <p style={{ fontSize: 64 }}>📢</p>
      <h2 style={s.successTitle}>{t('needPosted')}</h2>
      <p style={s.successSub}>Farmers in your area will see your request</p>
      <button style={s.btn} onClick={() => navigate('/needs')}>View All Needs →</button>
      <button style={{ ...s.btn, background: '#fff', color: '#2d7a2d', border: '1.5px solid #2d7a2d', marginTop: 10 }} onClick={() => navigate('/dashboard')}>Back to Home</button>
    </div>
  );

  return (
    <div style={s.page}>
      <div style={s.header}>
        <button style={s.back} onClick={() => navigate(-1)}>←</button>
        <h2 style={s.title}>{t('postNeedForm')}</h2>
        <p style={s.sub}>Broadcast your requirement to all farmers</p>
      </div>

      <div style={s.body}>
        <p style={s.label}>What crop do you need?</p>
        <div style={s.cropGrid}>
          {CROPS.map(c => (
            <button key={c} onClick={() => setCrop(c)}
              style={{ ...s.cropBtn, ...(crop === c ? s.cropBtnOn : {}) }}>
              <span>{ICONS[c] || '🌿'}</span>
              <span style={{ fontSize: 11 }}>{c}</span>
            </button>
          ))}
        </div>

        <div style={s.card}>
          <div style={s.row2}>
            <div style={{ flex: 1 }}>
              <label style={s.fieldLabel}>{t('quantity')}</label>
              <input style={s.input} type="number" placeholder="e.g. 200" value={form.quantityKg} onChange={e => upd('quantityKg', e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={s.fieldLabel}>{t('maxPrice')}</label>
              <input style={s.input} type="number" placeholder="e.g. 30" value={form.maxPricePerKg} onChange={e => upd('maxPricePerKg', e.target.value)} />
            </div>
          </div>

          <label style={s.fieldLabel}>{t('district')}</label>
          <select style={s.select} value={form.district} onChange={e => upd('district', e.target.value)}>
            {DISTRICTS.map(d => <option key={d}>{d}</option>)}
          </select>

          <label style={s.fieldLabel}>{t('notes')}</label>
          <textarea style={s.textarea} rows={3} placeholder="Quality preference, delivery date, special requirements..."
            value={form.description} onChange={e => upd('description', e.target.value)} />
        </div>

        {form.quantityKg && form.maxPricePerKg && (
          <div style={s.preview}>
            <span>Budget estimate</span>
            <span style={s.previewVal}>₹{(Number(form.quantityKg) * Number(form.maxPricePerKg)).toLocaleString('en-IN')}</span>
          </div>
        )}

        {error && <p style={s.error}>⚠ {error}</p>}
        <button style={s.btn} onClick={handleSubmit} disabled={posting}>
          {posting ? t('loading') : `📢 ${t('postNeed')}`}
        </button>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#f5f5f0', paddingBottom: 80 },
  header: { background: 'linear-gradient(135deg, #1b5e20, #2d7a2d)', padding: '44px 20px 20px' },
  back: { background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', width: 36, height: 36, borderRadius: '50%', fontSize: 18, cursor: 'pointer', marginBottom: 12 },
  title: { color: '#fff', fontSize: 22, fontWeight: 700 },
  sub: { color: '#c8e6c9', fontSize: 14, marginTop: 4 },
  body: { padding: '16px 16px 0' },
  label: { fontSize: 14, fontWeight: 700, color: '#333', marginBottom: 10, marginTop: 4 },
  cropGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 },
  cropBtn: { background: '#fff', border: '1.5px solid #ddd', borderRadius: 10, padding: '10px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer', fontSize: 22 },
  cropBtnOn: { background: '#e3f2fd', borderColor: '#1565c0' },
  card: { background: '#fff', borderRadius: 16, padding: 16, boxShadow: '0 1px 8px rgba(0,0,0,0.06)', marginBottom: 14 },
  row2: { display: 'flex', gap: 12 },
  fieldLabel: { display: 'block', fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 6, marginTop: 12 },
  input: { width: '100%', padding: '11px 14px', border: '1.5px solid #ddd', borderRadius: 10, fontSize: 15, background: '#fafafa' },
  select: { width: '100%', padding: '11px 14px', border: '1.5px solid #ddd', borderRadius: 10, fontSize: 15, background: '#fafafa', cursor: 'pointer' },
  textarea: { width: '100%', padding: '11px 14px', border: '1.5px solid #ddd', borderRadius: 10, fontSize: 14, background: '#fafafa', resize: 'none', fontFamily: 'inherit' },
  preview: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#e3f2fd', borderRadius: 12, padding: '14px 16px', marginBottom: 14 },
  previewVal: { fontSize: 22, fontWeight: 700, color: '#1565c0' },
  error: { color: '#c62828', background: '#ffebee', padding: '10px 14px', borderRadius: 8, marginBottom: 12, fontSize: 13 },
  btn: { width: '100%', background: '#1565c0', color: '#fff', padding: 16, borderRadius: 12, fontSize: 16, fontWeight: 700, border: 'none', cursor: 'pointer', marginBottom: 10 },
  successPage: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, background: '#f5f5f0' },
  successTitle: { fontSize: 26, fontWeight: 700, color: '#1565c0', marginBottom: 8 },
  successSub: { color: '#888', fontSize: 15, marginBottom: 28 },
};
