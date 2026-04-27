import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { createListing } from '../services/firestoreService';

const CROPS = ['Tomato','Onion','Potato','Chilli','Brinjal','Okra','Cabbage','Cauliflower','Carrot','Beans','Cucumber','Pumpkin','Bitter Gourd','Spinach','Ginger','Garlic'];
const ICONS: Record<string,string> = { Tomato:'🍅',Onion:'🧅',Potato:'🥔',Chilli:'🌶️',Brinjal:'🍆',Okra:'🥬',Cabbage:'🥬',Cauliflower:'🥦',Carrot:'🥕',Beans:'🫘',Cucumber:'🥒',Pumpkin:'🎃','Bitter Gourd':'🌿',Spinach:'🥬',Ginger:'🫚',Garlic:'🧄' };
const DISTRICTS = ['Hyderabad','Rangareddy','Warangal','Karimnagar','Nizamabad','Khammam','Nalgonda','Medak','Adilabad','Mahbubnagar','Sangareddy','Medchal'];

export default function CreateListingPage() {
  const { userProfile, user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [crop, setCrop] = useState('Tomato');
  const [form, setForm] = useState({ variety: '', quantityKg: '', pricePerKg: '', district: userProfile?.district || 'Hyderabad', description: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [progress, setProgress] = useState(0);
  const [posting, setPosting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const upd = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { setError('Image must be under 10MB'); return; }
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError('');
  };

  const handleSubmit = async () => {
    if (!user || !userProfile) return;
    if (!form.quantityKg || !form.pricePerKg) { setError('Quantity and price are required'); return; }
    setPosting(true); setError('');
    await createListing({
      farmerId: user.uid, farmerName: userProfile.displayName,
      farmerDistrict: userProfile.district || form.district,
      cropName: crop, variety: form.variety || 'Standard',
      quantityKg: Number(form.quantityKg), pricePerKg: Number(form.pricePerKg),
      district: form.district, description: form.description,
    }, imageFile, setProgress);
    setDone(true); setPosting(false);
  };

  if (done) return (
    <div style={s.successPage}>
      <p style={{ fontSize: 72 }}>✅</p>
      <h2 style={s.successTitle}>{t('listingPosted')}</h2>
      <p style={s.successSub}>Buyers can now see and order your crop</p>
      <button style={s.successBtn} onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      <button style={{ ...s.successBtn, background: '#fff', color: '#2d7a2d', border: '1.5px solid #2d7a2d', marginTop: 10 }} onClick={() => { setDone(false); setForm({ variety:'',quantityKg:'',pricePerKg:'',district:userProfile?.district||'Hyderabad',description:'' }); setImageFile(null); setPreviewUrl(''); }}>Post Another</button>
    </div>
  );

  return (
    <div style={s.page}>
      <div style={s.header}>
        <button style={s.back} onClick={() => navigate(-1)}>←</button>
        <h2 style={s.title}>{t('postCrop')}</h2>
        <p style={s.sub}>List your crop for buyers to discover</p>
      </div>

      <div style={s.body}>
        <p style={s.sLabel}>Select Crop</p>
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
          <p style={s.sLabel}>Crop Photo</p>
          <div style={s.uploadZone} onClick={() => fileRef.current?.click()}>
            {previewUrl
              ? <img src={previewUrl} alt="preview" style={s.preview} />
              : <div style={s.uploadPlaceholder}><span style={{ fontSize: 40 }}>📷</span><p style={s.uploadHint}>{t('uploadImage')}</p><p style={s.uploadHint2}>Tap to select from camera or gallery</p></div>}
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
          {posting && progress > 0 && progress < 100 && (
            <div style={s.progressWrap}><div style={{ ...s.progressBar, width: `${progress}%` }} /></div>
          )}

          <div style={s.row2}>
            <div style={{ flex: 1 }}>
              <label style={s.fieldLabel}>{t('quantity')}</label>
              <input style={s.input} type="number" placeholder="500" value={form.quantityKg} onChange={e => upd('quantityKg', e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={s.fieldLabel}>{t('price')}</label>
              <input style={s.input} type="number" placeholder="28" value={form.pricePerKg} onChange={e => upd('pricePerKg', e.target.value)} />
            </div>
          </div>

          <label style={s.fieldLabel}>{t('variety')}</label>
          <input style={s.input} placeholder="e.g. Hybrid, Desi, F1" value={form.variety} onChange={e => upd('variety', e.target.value)} />

          <label style={s.fieldLabel}>{t('district')}</label>
          <select style={s.select} value={form.district} onChange={e => upd('district', e.target.value)}>
            {DISTRICTS.map(d => <option key={d}>{d}</option>)}
          </select>

          <label style={s.fieldLabel}>{t('description')}</label>
          <textarea style={s.textarea} rows={3} placeholder="Describe quality, harvest date, certifications..."
            value={form.description} onChange={e => upd('description', e.target.value)} />
        </div>

        {form.quantityKg && form.pricePerKg && (
          <div style={s.valueBanner}>
            <span>Total listing value</span>
            <span style={s.valueNum}>₹{(Number(form.quantityKg) * Number(form.pricePerKg)).toLocaleString('en-IN')}</span>
          </div>
        )}

        {error && <p style={s.error}>⚠ {error}</p>}
        <button style={s.submitBtn} onClick={handleSubmit} disabled={posting}>
          {posting ? (progress > 0 ? `Uploading ${progress}%...` : t('loading')) : `🌾 ${t('postListing')}`}
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
  sub: { color: '#c8e6c9', fontSize: 13, marginTop: 4 },
  body: { padding: '16px 16px 0' },
  sLabel: { fontSize: 14, fontWeight: 700, color: '#333', marginBottom: 10 },
  cropGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 },
  cropBtn: { background: '#fff', border: '1.5px solid #ddd', borderRadius: 10, padding: '10px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer', fontSize: 22 },
  cropBtnOn: { background: '#e8f5e9', borderColor: '#2d7a2d' },
  card: { background: '#fff', borderRadius: 16, padding: 16, boxShadow: '0 1px 8px rgba(0,0,0,0.06)', marginBottom: 14 },
  uploadZone: { border: '2px dashed #ccc', borderRadius: 12, overflow: 'hidden', marginBottom: 4, cursor: 'pointer', minHeight: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' },
  uploadPlaceholder: { textAlign: 'center', padding: 20 },
  uploadHint: { fontSize: 14, fontWeight: 600, color: '#2d7a2d', marginTop: 8 },
  uploadHint2: { fontSize: 12, color: '#aaa', marginTop: 4 },
  preview: { width: '100%', height: 200, objectFit: 'cover' },
  progressWrap: { height: 6, background: '#e0e0e0', borderRadius: 3, marginBottom: 8 },
  progressBar: { height: '100%', background: '#2d7a2d', borderRadius: 3, transition: 'width 0.3s' },
  row2: { display: 'flex', gap: 12 },
  fieldLabel: { display: 'block', fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 6, marginTop: 12 },
  input: { width: '100%', padding: '11px 14px', border: '1.5px solid #ddd', borderRadius: 10, fontSize: 15, background: '#fafafa' },
  select: { width: '100%', padding: '11px 14px', border: '1.5px solid #ddd', borderRadius: 10, fontSize: 15, background: '#fafafa', cursor: 'pointer' },
  textarea: { width: '100%', padding: '11px 14px', border: '1.5px solid #ddd', borderRadius: 10, fontSize: 14, background: '#fafafa', resize: 'none', fontFamily: 'inherit' },
  valueBanner: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#e8f5e9', borderRadius: 12, padding: '14px 16px', marginBottom: 14 },
  valueNum: { fontSize: 22, fontWeight: 700, color: '#2d7a2d' },
  error: { color: '#c62828', background: '#ffebee', padding: '10px 14px', borderRadius: 8, marginBottom: 12, fontSize: 13 },
  submitBtn: { width: '100%', background: '#2d7a2d', color: '#fff', padding: 16, borderRadius: 12, fontSize: 16, fontWeight: 700, border: 'none', cursor: 'pointer', marginBottom: 10 },
  successPage: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, background: '#f5f5f0', textAlign: 'center' },
  successTitle: { fontSize: 26, fontWeight: 700, color: '#2d7a2d', marginBottom: 8 },
  successSub: { color: '#888', fontSize: 15, marginBottom: 28 },
  successBtn: { width: '100%', maxWidth: 320, background: '#2d7a2d', color: '#fff', padding: 16, borderRadius: 12, fontSize: 16, fontWeight: 700, border: 'none', cursor: 'pointer' },
};
