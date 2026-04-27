import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function ProfilePage() {
  const { userProfile, user, logout } = useAuth();
  const { t, lang, setLang } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (confirm(t('logout') + '?')) { await logout(); navigate('/login'); }
  };

  if (!userProfile) return <div style={{ padding: 80, textAlign: 'center', color: '#999' }}>{t('loading')}</div>;

  const isFarmer = userProfile.role === 'farmer';
  const rows = isFarmer
    ? [
        { label: t('village'), value: userProfile.village, icon: '🏘' },
        { label: t('mandal'), value: userProfile.mandal, icon: '📌' },
        { label: t('district'), value: userProfile.district, icon: '🗺' },
        { label: t('landArea'), value: userProfile.landAcres ? `${userProfile.landAcres} acres` : '--', icon: '🌾' },
        { label: t('phone'), value: userProfile.phone || '--', icon: '📞' },
        { label: t('rating'), value: `${userProfile.rating?.toFixed(1) || '4.0'} ⭐`, icon: '⭐' },
      ]
    : [
        { label: t('businessName'), value: userProfile.businessName, icon: '🏢' },
        { label: t('businessAddress'), value: userProfile.businessAddress, icon: '📍' },
        { label: t('district'), value: userProfile.district, icon: '🗺' },
        { label: t('pincode'), value: userProfile.pincode, icon: '📮' },
        { label: t('phone'), value: userProfile.phone || '--', icon: '📞' },
      ];

  return (
    <div style={s.page}>
      <div style={s.header}>
        {userProfile.photoURL
          ? <img src={userProfile.photoURL} alt="" style={s.avatar} />
          : <div style={s.avatarFallback}>{userProfile.displayName?.[0] || 'U'}</div>}
        <h2 style={s.name}>{userProfile.displayName}</h2>
        <p style={s.email}>{user?.email}</p>
        <span style={s.roleBadge}>{isFarmer ? '🧑‍🌾 Farmer' : `🏪 ${userProfile.buyerType === 'shop' ? t('shopOwner') : userProfile.buyerType === 'restaurant' ? t('restaurant') : t('bulkBuyer')}`}</span>
      </div>

      <div style={s.body}>
        <div style={s.card}>
          <h3 style={s.cardTitle}>{isFarmer ? t('farmerDetails') : t('buyerDetails')}</h3>
          {rows.map((r, i) => (
            <div key={r.label} style={{ ...s.row, borderBottom: i < rows.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
              <span style={s.rowIcon}>{r.icon}</span>
              <span style={s.rowLabel}>{r.label}</span>
              <span style={s.rowVal}>{r.value || '--'}</span>
            </div>
          ))}
        </div>

        <div style={s.card}>
          <h3 style={s.cardTitle}>{t('language')}</h3>
          <div style={s.langRow}>
            {[['en','🇬🇧 English'],['hi','🇮🇳 हिंदी'],['te','🏛 తెలుగు']].map(([code, label]) => (
              <button key={code} onClick={() => setLang(code)}
                style={{ ...s.langBtn, ...(lang === code ? s.langBtnOn : {}) }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <button style={s.editBtn} onClick={() => navigate('/setup')}>✏ {t('editProfile')}</button>
        <button style={s.logoutBtn} onClick={handleLogout}>🚪 {t('logout')}</button>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#f5f5f0', paddingBottom: 80 },
  header: { background: 'linear-gradient(135deg, #1b5e20, #2d7a2d)', padding: '44px 24px 28px', textAlign: 'center' },
  avatar: { width: 80, height: 80, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.4)', marginBottom: 10 },
  avatarFallback: { width: 80, height: 80, borderRadius: '50%', background: '#c8e6c9', color: '#2d7a2d', fontSize: 32, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' },
  name: { color: '#fff', fontSize: 22, fontWeight: 700 },
  email: { color: '#c8e6c9', fontSize: 13, marginTop: 2 },
  roleBadge: { display: 'inline-block', marginTop: 8, background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 13, fontWeight: 600, padding: '4px 14px', borderRadius: 20 },
  body: { padding: 16 },
  card: { background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', marginBottom: 14 },
  cardTitle: { fontSize: 15, fontWeight: 700, color: '#333', padding: '14px 16px', borderBottom: '1px solid #f5f5f5' },
  row: { display: 'flex', alignItems: 'center', padding: '12px 16px', gap: 10 },
  rowIcon: { fontSize: 16, width: 24 },
  rowLabel: { flex: 1, color: '#888', fontSize: 14 },
  rowVal: { color: '#222', fontSize: 14, fontWeight: 600 },
  langRow: { display: 'flex', gap: 10, padding: '12px 16px' },
  langBtn: { flex: 1, padding: '10px 8px', border: '1.5px solid #ddd', borderRadius: 10, background: '#fafafa', fontSize: 13, cursor: 'pointer', fontWeight: 500 },
  langBtnOn: { background: '#e8f5e9', borderColor: '#2d7a2d', color: '#2d7a2d', fontWeight: 700 },
  editBtn: { width: '100%', background: '#e8f5e9', border: '1.5px solid #2d7a2d', borderRadius: 12, padding: 14, color: '#2d7a2d', fontSize: 15, fontWeight: 600, marginBottom: 10, cursor: 'pointer' },
  logoutBtn: { width: '100%', background: '#ffebee', border: '1px solid #ef9a9a', borderRadius: 12, padding: 14, color: '#c62828', fontSize: 15, fontWeight: 600, cursor: 'pointer' },
};
