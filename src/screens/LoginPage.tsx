import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/webApi';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    const formatted = phone.startsWith('+91') ? phone : `+91${phone}`;
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setLoading(true);
    setError('');
    // Fire-and-forget — navigate regardless of API result
    api.post('/api/v1/auth/send-otp', { phone_number: formatted }).catch(() => {});
    navigate('/otp', { state: { phone: formatted } });
  };

  return (
    <div style={s.page}>
      <div style={s.left}>
        <div style={s.brand}>
          <span style={s.logo}>🌾</span>
          <h1 style={s.appName}>RythuLink</h1>
          <p style={s.tagline}>Connecting Farmers Directly to Shops</p>
          <p style={s.desc}>Remove middlemen. Get fair prices. Grow your business across Telangana.</p>
        </div>
        <div style={s.features}>
          {['📦 Manage your crop listings', '📈 AI-powered price predictions', '🚚 Track orders in real-time', '📞 Telugu IVR support'].map(f => (
            <div key={f} style={s.feature}>{f}</div>
          ))}
        </div>
      </div>

      <div style={s.right}>
        <div style={s.card}>
          <h2 style={s.cardTitle}>Farmer Login</h2>
          <p style={s.cardSub}>Enter your mobile number to continue</p>

          <label style={s.label}>Mobile Number</label>
          <div style={s.inputWrap}>
            <span style={s.prefix}>+91</span>
            <input
              style={s.input}
              type="tel"
              placeholder="10-digit number"
              maxLength={10}
              value={phone}
              onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
              onKeyDown={e => e.key === 'Enter' && handleSendOTP()}
            />
          </div>

          {error && <p style={s.error}>⚠ {error}</p>}

          <button style={s.btn} onClick={handleSendOTP} disabled={loading}>
            {loading ? 'Sending OTP...' : 'Send OTP →'}
          </button>

          <p style={s.devNote}>Dev mode: OTP bypass = <strong>123456</strong></p>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { display: 'flex', minHeight: '100vh', background: '#f5f5f0' },
  left: { flex: 1, background: 'linear-gradient(135deg, #1b5e20 0%, #2d7a2d 60%, #388e3c 100%)', padding: '60px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 40 },
  brand: { color: '#fff' },
  logo: { fontSize: 56 },
  appName: { fontSize: 42, fontWeight: 800, marginTop: 12, letterSpacing: -1 },
  tagline: { fontSize: 18, opacity: 0.85, marginTop: 6, fontWeight: 500 },
  desc: { fontSize: 14, opacity: 0.7, marginTop: 10, lineHeight: 1.6, maxWidth: 340 },
  features: { display: 'flex', flexDirection: 'column', gap: 12 },
  feature: { color: '#c8e6c9', fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 },
  right: { width: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 },
  card: { width: '100%', background: '#fff', borderRadius: 20, padding: 40, boxShadow: '0 8px 40px rgba(0,0,0,0.10)' },
  cardTitle: { fontSize: 26, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 },
  cardSub: { fontSize: 14, color: '#888', marginBottom: 28 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 8 },
  inputWrap: { display: 'flex', alignItems: 'center', border: '1.5px solid #ddd', borderRadius: 10, overflow: 'hidden', marginBottom: 14 },
  prefix: { background: '#f7f7f7', padding: '14px 14px', fontSize: 16, color: '#555', fontWeight: 600, borderRight: '1px solid #ddd' },
  input: { flex: 1, padding: '14px 14px', fontSize: 18, border: 'none', background: 'transparent' },
  error: { color: '#c62828', fontSize: 13, marginBottom: 12, background: '#ffebee', padding: '8px 12px', borderRadius: 8 },
  btn: { width: '100%', background: '#2d7a2d', color: '#fff', padding: 16, borderRadius: 10, fontSize: 16, fontWeight: 700, marginTop: 4, transition: 'background 0.2s' },
  devNote: { textAlign: 'center', color: '#bbb', fontSize: 12, marginTop: 20 },
};
