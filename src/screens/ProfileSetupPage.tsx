import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from '../services/store';

const DISTRICTS = ['Hyderabad', 'Warangal', 'Karimnagar', 'Nizamabad', 'Khammam', 'Medak', 'Nalgonda', 'Adilabad', 'Mahbubnagar', 'Rangareddy'];

export default function ProfileSetupPage() {
  const navigate = useNavigate();
  const phone = localStorage.getItem('phone') || '';
  const [form, setForm] = useState({ name: '', village: '', mandal: '', district: 'Hyderabad', land_area_acres: '' });
  const [error, setError] = useState('');

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.name.trim() || !form.village.trim() || !form.mandal.trim()) {
      setError('Please fill all required fields');
      return;
    }
    store.saveProfile({
      name: form.name.trim(),
      phone,
      village: form.village.trim(),
      mandal: form.mandal.trim(),
      district: form.district,
      land_area_acres: parseFloat(form.land_area_acres) || 0,
      rating: 4.2,
    });
    navigate('/dashboard');
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.title}>Complete Your Profile</h1>
        <p style={s.sub}>Tell us about your farm to get started</p>
      </div>

      <div style={s.form}>
        <Field label="Full Name *" placeholder="Enter your name" value={form.name} onChange={v => set('name', v)} />
        <Field label="Village *" placeholder="Your village name" value={form.village} onChange={v => set('village', v)} />
        <Field label="Mandal *" placeholder="Your mandal" value={form.mandal} onChange={v => set('mandal', v)} />

        <div style={s.field}>
          <label style={s.label}>District *</label>
          <select style={s.select} value={form.district} onChange={e => set('district', e.target.value)}>
            {DISTRICTS.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>

        <Field label="Land Area (acres)" placeholder="e.g. 5.5" value={form.land_area_acres} onChange={v => set('land_area_acres', v)} type="number" />

        {error && <p style={s.error}>⚠ {error}</p>}

        <button style={s.btn} onClick={handleSubmit}>Save & Continue →</button>
      </div>
    </div>
  );
}

function Field({ label, placeholder, value, onChange, type = 'text' }: { label: string; placeholder: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6 }}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #ddd', borderRadius: 10, fontSize: 15, background: '#fafafa' }}
      />
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#f5f5f0' },
  header: { background: 'linear-gradient(135deg, #1b5e20 0%, #2d7a2d 100%)', padding: '48px 32px 32px' },
  title: { color: '#fff', fontSize: 28, fontWeight: 700 },
  sub: { color: '#c8e6c9', fontSize: 15, marginTop: 6 },
  form: { padding: '28px 32px 80px', maxWidth: 560 },
  field: { marginBottom: 16 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6 },
  select: { width: '100%', padding: '12px 14px', border: '1.5px solid #ddd', borderRadius: 10, fontSize: 15, background: '#fafafa', cursor: 'pointer' },
  error: { color: '#c62828', background: '#ffebee', padding: '10px 14px', borderRadius: 8, marginBottom: 12, fontSize: 13 },
  btn: { width: '100%', background: '#2d7a2d', color: '#fff', padding: 16, borderRadius: 12, fontSize: 16, fontWeight: 700, marginTop: 8 },
};
