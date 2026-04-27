import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { saveUserProfile } from '../services/firestoreService';

const DISTRICTS = ['Hyderabad','Rangareddy','Medchal-Malkajgiri','Sangareddy','Vikarabad','Yadadri','Nalgonda','Suryapet','Khammam','Bhadradri','Warangal','Hanamkonda','Karimnagar','Peddapalli','Jagtial','Rajanna Sircilla','Nizamabad','Kamareddy','Nirmal','Adilabad','Kumuram Bheem','Mancherial','Medak','Siddipet','Jogulamba','Wanaparthy','Nagarkurnool','Narayanpet','Mahabubabad','Mulugu','Bhuvanagiri','Janagaon'];

export default function ProfileSetupPage() {
  const { user, refreshProfile } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<'farmer' | 'buyer' | null>(null);
  const [buyerType, setBuyerType] = useState<'shop' | 'restaurant' | 'bulk' | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: user?.displayName || '', phone: '', village: '', mandal: '', district: 'Hyderabad',
    landAcres: '', businessName: '', businessAddress: '', pincode: '',
  });
  const upd = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!user || !role) return;
    setSaving(true);
    const base = { uid: user.uid, email: user.email || '', displayName: form.name, photoURL: user.photoURL || '', role, language: localStorage.getItem('rl_lang') || 'en', profileComplete: true, phone: form.phone, district: form.district };
    const extra = role === 'farmer'
      ? { village: form.village, mandal: form.mandal, landAcres: parseFloat(form.landAcres) || 0, rating: 4.2 }
      : { buyerType: buyerType!, businessName: form.businessName, businessAddress: form.businessAddress, pincode: form.pincode };
    await saveUserProfile(user.uid, { ...base, ...extra });
    await refreshProfile();
    navigate('/dashboard');
    setSaving(false);
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <img src={user?.photoURL || ''} style={s.photo} alt="" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        <div>
          <h2 style={s.title}>{t('completeProfile')}</h2>
          <p style={s.sub}>{user?.email}</p>
        </div>
      </div>

      <div style={s.body}>
        {step === 1 && (
          <>
            <p style={s.sectionTitle}>{t('selectRole')}</p>
            <div style={s.roleGrid}>
              <button onClick={() => { setRole('farmer'); setStep(2); }} style={{ ...s.roleCard, ...(role === 'farmer' ? s.roleCardOn : {}) }}>
                <span style={s.roleIcon}>🧑‍🌾</span>
                <span style={s.roleLabel}>{t('iAmFarmer')}</span>
                <span style={s.roleDesc}>Post crops, manage orders</span>
              </button>
              <button onClick={() => setRole('buyer')} style={{ ...s.roleCard, ...(role === 'buyer' ? s.roleCardOn : {}) }}>
                <span style={s.roleIcon}>🏪</span>
                <span style={s.roleLabel}>{t('iAmBuyer')}</span>
                <span style={s.roleDesc}>Browse & order fresh crops</span>
              </button>
            </div>
            {role === 'buyer' && (
              <>
                <p style={s.sectionTitle}>Buyer Type</p>
                <div style={s.typeRow}>
                  {([['shop','🏪',t('shopOwner')],['restaurant','🍽',t('restaurant')],['bulk','📦',t('bulkBuyer')]] as [string,string,string][]).map(([k,icon,label]) => (
                    <button key={k} onClick={() => { setBuyerType(k as any); setStep(2); }}
                      style={{ ...s.typeBtn, ...(buyerType === k ? s.typeBtnOn : {}) }}>
                      <span>{icon}</span><span style={{ fontSize: 12 }}>{label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <button style={s.back} onClick={() => setStep(1)}>← Back</button>
            <Field label={t('name')} value={form.name} onChange={v => upd('name', v)} placeholder="Your full name" />
            <Field label={t('phone')} value={form.phone} onChange={v => upd('phone', v)} placeholder="+91 XXXXX XXXXX" type="tel" />
            {role === 'farmer' ? <>
              <Field label={t('village')} value={form.village} onChange={v => upd('village', v)} placeholder="Your village" />
              <Field label={t('mandal')} value={form.mandal} onChange={v => upd('mandal', v)} placeholder="Your mandal" />
              <DistrictSelect value={form.district} onChange={v => upd('district', v)} label={t('district')} />
              <Field label={t('landArea')} value={form.landAcres} onChange={v => upd('landAcres', v)} placeholder="e.g. 5.5" type="number" />
            </> : <>
              <Field label={t('businessName')} value={form.businessName} onChange={v => upd('businessName', v)} placeholder="Shop / Restaurant name" />
              <Field label={t('businessAddress')} value={form.businessAddress} onChange={v => upd('businessAddress', v)} placeholder="Full address" />
              <DistrictSelect value={form.district} onChange={v => upd('district', v)} label={t('district')} />
              <Field label={t('pincode')} value={form.pincode} onChange={v => upd('pincode', v)} placeholder="6-digit pincode" />
            </>}
            <button style={s.saveBtn} onClick={handleSave} disabled={saving}>
              {saving ? t('loading') : t('saveAndContinue')}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text' }: any) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6 }}>{label}</label>
      <input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
        style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #ddd', borderRadius: 10, fontSize: 15, background: '#fafafa' }} />
    </div>
  );
}

function DistrictSelect({ label, value, onChange }: any) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6 }}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #ddd', borderRadius: 10, fontSize: 15, background: '#fafafa' }}>
        {DISTRICTS.map(d => <option key={d}>{d}</option>)}
      </select>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#f5f5f0', paddingBottom: 40 },
  header: { background: 'linear-gradient(135deg, #1b5e20, #2d7a2d)', padding: '44px 24px 24px', display: 'flex', alignItems: 'center', gap: 16 },
  photo: { width: 56, height: 56, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)' },
  title: { color: '#fff', fontSize: 22, fontWeight: 700 },
  sub: { color: '#c8e6c9', fontSize: 13 },
  body: { padding: '24px 20px', maxWidth: 520, margin: '0 auto' },
  sectionTitle: { fontSize: 16, fontWeight: 700, color: '#333', marginBottom: 12 },
  roleGrid: { display: 'flex', gap: 12, marginBottom: 20 },
  roleCard: { flex: 1, background: '#fff', border: '2px solid #eee', borderRadius: 16, padding: '20px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer' },
  roleCardOn: { borderColor: '#2d7a2d', background: '#e8f5e9' },
  roleIcon: { fontSize: 36 },
  roleLabel: { fontSize: 15, fontWeight: 700, color: '#222' },
  roleDesc: { fontSize: 12, color: '#888', textAlign: 'center' },
  typeRow: { display: 'flex', gap: 10, marginBottom: 20 },
  typeBtn: { flex: 1, background: '#fff', border: '2px solid #eee', borderRadius: 12, padding: '14px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 24 },
  typeBtnOn: { borderColor: '#2d7a2d', background: '#e8f5e9' },
  back: { background: 'none', border: 'none', color: '#2d7a2d', fontWeight: 600, fontSize: 14, cursor: 'pointer', marginBottom: 16, padding: 0 },
  saveBtn: { width: '100%', background: '#2d7a2d', color: '#fff', padding: 16, borderRadius: 12, fontSize: 16, fontWeight: 700, marginTop: 8, border: 'none', cursor: 'pointer' },
};
