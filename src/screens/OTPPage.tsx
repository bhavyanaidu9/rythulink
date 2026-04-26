import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/webApi';

export default function OTPPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const phone = (location.state as any)?.phone || '';

  const handleChange = (val: string, i: number) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 6) { setError('Please enter the 6-digit OTP'); return; }
    if (code !== '123456') { setError('Invalid OTP. Use 123456 for demo.'); return; }
    setLoading(true);
    // Try real backend, fall back to demo mode
    try {
      const { data } = await api.post('/api/v1/auth/verify-otp', { phone_number: phone, otp: code, user_type: 'farmer' });
      localStorage.setItem('access_token', data.token || data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token || '');
    } catch {
      // Demo mode — set a placeholder token so PrivateRoute passes
      localStorage.setItem('access_token', 'demo-token');
      localStorage.setItem('phone', phone);
    }
    navigate('/dashboard');
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <button style={s.back} onClick={() => navigate(-1)}>← Back</button>
        <div style={s.icon}>📱</div>
        <h1 style={s.title}>Verify OTP</h1>
        <p style={s.sub}>OTP sent to <strong>{phone}</strong></p>

        <div style={s.otpRow}>
          {otp.map((d, i) => (
            <input
              key={i}
              ref={el => { refs.current[i] = el; }}
              style={{ ...s.otpBox, borderColor: d ? '#2d7a2d' : '#ddd' }}
              type="tel"
              maxLength={1}
              value={d}
              onChange={e => handleChange(e.target.value, i)}
              onKeyDown={e => handleKeyDown(e, i)}
            />
          ))}
        </div>

        {error && <p style={s.error}>⚠ {error}</p>}

        <button style={s.btn} onClick={handleVerify} disabled={loading}>
          {loading ? 'Verifying...' : 'Verify OTP ✓'}
        </button>

        <p style={s.hint}>Dev bypass: enter <strong>123456</strong></p>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f0' },
  card: { background: '#fff', borderRadius: 20, padding: 48, width: 420, boxShadow: '0 8px 40px rgba(0,0,0,0.10)', textAlign: 'center', position: 'relative' },
  back: { position: 'absolute', top: 20, left: 20, background: 'none', color: '#2d7a2d', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  icon: { fontSize: 48, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 700, color: '#1a1a1a', marginBottom: 8 },
  sub: { fontSize: 14, color: '#888', marginBottom: 32 },
  otpRow: { display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 20 },
  otpBox: { width: 52, height: 60, textAlign: 'center', fontSize: 26, fontWeight: 700, borderRadius: 10, border: '2px solid', background: '#fafafa' },
  error: { color: '#c62828', fontSize: 13, marginBottom: 12, background: '#ffebee', padding: '8px 12px', borderRadius: 8 },
  btn: { width: '100%', background: '#2d7a2d', color: '#fff', padding: 16, borderRadius: 10, fontSize: 16, fontWeight: 700 },
  hint: { color: '#bbb', fontSize: 12, marginTop: 16 },
};
