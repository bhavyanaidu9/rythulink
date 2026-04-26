import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store, FarmerProfile } from '../services/store';

export default function ProfilePage() {
  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const navigate = useNavigate();

  useEffect(() => { setProfile(store.getProfile()); }, []);

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      store.logout();
      navigate('/login');
    }
  };

  if (!profile) return <div style={s.loader}>Loading...</div>;

  const rows = [
    { label: 'Phone', value: profile.phone, icon: '📞' },
    { label: 'Village', value: profile.village, icon: '🏘' },
    { label: 'Mandal', value: profile.mandal, icon: '📌' },
    { label: 'District', value: profile.district, icon: '🗺' },
    { label: 'Land Area', value: profile.land_area_acres ? `${profile.land_area_acres} acres` : 'Not set', icon: '🌾' },
    { label: 'Rating', value: `${profile.rating?.toFixed(1)} ⭐`, icon: '⭐' },
  ];

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div style={s.avatarWrap}>
          <div style={s.avatar}>{profile.name[0].toUpperCase()}</div>
        </div>
        <h2 style={s.name}>{profile.name}</h2>
        <p style={s.loc}>📍 {profile.village}, {profile.district}</p>
      </div>

      <div style={s.body}>
        <div style={s.card}>
          <h3 style={s.cardTitle}>Farmer Details</h3>
          {rows.map((r, i) => (
            <div key={r.label} style={{ ...s.row, borderBottom: i < rows.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
              <span style={s.rowIcon}>{r.icon}</span>
              <span style={s.rowLabel}>{r.label}</span>
              <span style={s.rowVal}>{r.value}</span>
            </div>
          ))}
        </div>

        <button style={s.editBtn} onClick={() => navigate('/setup')}>✏ Edit Profile</button>
        <button style={s.logoutBtn} onClick={handleLogout}>🚪 Logout</button>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#f5f5f0', paddingBottom: 80 },
  loader: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#999' },
  header: { background: 'linear-gradient(135deg, #1b5e20, #2d7a2d)', padding: '44px 24px 28px', textAlign: 'center' },
  avatarWrap: { display: 'flex', justifyContent: 'center', marginBottom: 12 },
  avatar: { width: 80, height: 80, borderRadius: '50%', background: '#c8e6c9', color: '#2d7a2d', fontSize: 32, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  name: { color: '#fff', fontSize: 24, fontWeight: 700 },
  loc: { color: '#c8e6c9', fontSize: 13, marginTop: 4 },
  body: { padding: '16px' },
  card: { background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', marginBottom: 12 },
  cardTitle: { fontSize: 15, fontWeight: 700, color: '#333', padding: '14px 16px', borderBottom: '1px solid #f5f5f5' },
  row: { display: 'flex', alignItems: 'center', padding: '13px 16px', gap: 10 },
  rowIcon: { fontSize: 16, width: 24 },
  rowLabel: { flex: 1, color: '#888', fontSize: 14 },
  rowVal: { color: '#222', fontSize: 14, fontWeight: 600 },
  editBtn: { width: '100%', background: '#e8f5e9', border: '1.5px solid #2d7a2d', borderRadius: 12, padding: 14, color: '#2d7a2d', fontSize: 15, fontWeight: 600, marginBottom: 10, cursor: 'pointer' },
  logoutBtn: { width: '100%', background: '#ffebee', border: '1px solid #ef9a9a', borderRadius: 12, padding: 14, color: '#c62828', fontSize: 15, fontWeight: 600, cursor: 'pointer' },
};
