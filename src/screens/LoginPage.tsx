import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function LoginPage() {
  const { signInWithGoogle } = useAuth();
  const { t, lang, setLang } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogle = async () => {
    setLoading(true); setError('');
    try { await signInWithGoogle(); }
    catch { setError('Sign-in failed. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={s.page}>
      <div style={s.left}>
        <div style={s.brand}>
          <span style={s.logo}>🌾</span>
          <h1 style={s.appName}>{t('appName')}</h1>
          <p style={s.tagline}>{t('tagline')}</p>
        </div>
        <div style={s.features}>
          {['🧑‍🌾 Farmers post crop listings with photos',
            '🏪 Buyers browse and order directly',
            '📢 Buyers broadcast what they need',
            '📈 AI-powered price predictions',
            '🔒 Contact revealed only after order confirmed'].map(f => (
            <div key={f} style={s.feature}>{f}</div>
          ))}
        </div>
      </div>

      <div style={s.right}>
        <div style={s.langBar}>
          {[['en','EN'],['hi','हिं'],['te','తె']].map(([code,label]) => (
            <button key={code} onClick={() => setLang(code)}
              style={{ ...s.langBtn, ...(lang === code ? s.langBtnOn : {}) }}>{label}</button>
          ))}
        </div>
        <div style={s.card}>
          <div style={s.cardLogo}>🌾</div>
          <h2 style={s.cardTitle}>{t('appName')}</h2>
          <p style={s.cardSub}>{t('tagline')}</p>

          {error && <div style={s.error}>⚠ {error}</div>}

          <button style={s.googleBtn} onClick={handleGoogle} disabled={loading}>
            {loading ? <span>⏳ {t('loading')}</span> : (
              <span style={s.googleBtnInner}>
                <GoogleIcon />
                {t('loginWithGoogle')}
              </span>
            )}
          </button>

          <div style={s.rolesRow}>
            <div style={s.roleChip}>🧑‍🌾 {t('iAmFarmer')}</div>
            <div style={s.roleChip}>🏪 {t('iAmBuyer')}</div>
          </div>
          <p style={s.hint}>You'll select your role after signing in</p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" style={{ marginRight: 8, flexShrink: 0 }}>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { display: 'flex', minHeight: '100vh', background: '#f5f5f0' },
  left: { flex: 1, background: 'linear-gradient(135deg, #1b5e20 0%, #2d7a2d 60%, #388e3c 100%)', padding: '60px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 40 },
  brand: { color: '#fff' },
  logo: { fontSize: 56 },
  appName: { fontSize: 42, fontWeight: 800, marginTop: 12, letterSpacing: -1 },
  tagline: { fontSize: 18, opacity: 0.85, marginTop: 6, fontWeight: 500 },
  features: { display: 'flex', flexDirection: 'column', gap: 12 },
  feature: { color: '#c8e6c9', fontSize: 14 },
  right: { width: 480, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, position: 'relative' },
  langBar: { position: 'absolute', top: 20, right: 20, display: 'flex', gap: 6 },
  langBtn: { padding: '5px 12px', borderRadius: 20, border: '1.5px solid #ddd', background: '#fff', fontSize: 13, cursor: 'pointer', fontWeight: 500 },
  langBtnOn: { background: '#2d7a2d', borderColor: '#2d7a2d', color: '#fff', fontWeight: 700 },
  card: { width: '100%', background: '#fff', borderRadius: 24, padding: '40px 36px', boxShadow: '0 8px 40px rgba(0,0,0,0.10)', textAlign: 'center' },
  cardLogo: { fontSize: 48, marginBottom: 8 },
  cardTitle: { fontSize: 28, fontWeight: 800, color: '#1b5e20', marginBottom: 4 },
  cardSub: { fontSize: 14, color: '#888', marginBottom: 28 },
  error: { background: '#ffebee', color: '#c62828', padding: '10px 14px', borderRadius: 10, marginBottom: 16, fontSize: 13 },
  googleBtn: { width: '100%', background: '#fff', border: '1.5px solid #ddd', borderRadius: 12, padding: '14px 20px', fontSize: 16, fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: 20 },
  googleBtnInner: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
  rolesRow: { display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 12 },
  roleChip: { padding: '7px 16px', background: '#e8f5e9', borderRadius: 20, fontSize: 13, color: '#2d7a2d', fontWeight: 600 },
  hint: { fontSize: 12, color: '#bbb' },
};
