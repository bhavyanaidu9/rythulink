import React, { useState } from 'react';
import { api } from '../services/webApi';

const COMMODITIES = ['tomato', 'onion', 'potato', 'chilli', 'brinjal', 'okra'];
const DISTRICTS = ['Hyderabad', 'Warangal', 'Karimnagar', 'Nizamabad', 'Khammam'];
const ICONS: Record<string, string> = { tomato: '🍅', onion: '🧅', potato: '🥔', chilli: '🌶️', brinjal: '🍆', okra: '🥬' };
const BASE_PRICES: Record<string, number> = { tomato: 28, onion: 22, potato: 18, chilli: 85, brinjal: 32, okra: 45 };

interface Row { date: string; predicted_price: number; lower_bound: number; upper_bound: number; }

function mockPredictions(commodity: string): Row[] {
  const base = BASE_PRICES[commodity] || 30;
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    const price = +(base + (Math.random() - 0.4) * base * 0.15).toFixed(2);
    return {
      date: date.toISOString().split('T')[0],
      predicted_price: price,
      lower_bound: +(price * 0.9).toFixed(0),
      upper_bound: +(price * 1.1).toFixed(0),
    };
  });
}

export default function PricesPage() {
  const [commodity, setCommodity] = useState('tomato');
  const [district, setDistrict] = useState('Hyderabad');
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [modelVersion, setModelVersion] = useState('');
  const [error, setError] = useState('');

  const fetch = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/api/v1/prices/predict', { commodity, district, days_ahead: 7 });
      setRows(data.predictions || []);
      setModelVersion(data.model_version || '');
    } catch {
      setRows(mockPredictions(commodity));
      setModelVersion('demo-v1 (offline)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <h2 style={s.title}>📈 Price Prediction</h2>
      <p style={s.sub}>AI-powered 7-day price forecast for Telangana markets</p>

      <div style={s.controls}>
        <div style={s.controlBox}>
          <p style={s.label}>Select Commodity</p>
          <div style={s.chips}>
            {COMMODITIES.map(c => (
              <button key={c} style={{ ...s.chip, ...(commodity === c ? s.chipOn : {}) }} onClick={() => setCommodity(c)}>
                {ICONS[c]} {c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div style={s.controlBox}>
          <p style={s.label}>Select District</p>
          <div style={s.chips}>
            {DISTRICTS.map(d => (
              <button key={d} style={{ ...s.chip, ...(district === d ? s.chipOn : {}) }} onClick={() => setDistrict(d)}>
                {d}
              </button>
            ))}
          </div>
        </div>

        <button style={s.btn} onClick={fetch} disabled={loading}>
          {loading ? '⏳ Loading...' : '🔍 Get Price Forecast'}
        </button>
      </div>

      {error && <div style={s.error}>⚠ {error}</div>}

      {rows.length > 0 && (
        <div style={s.resultBox}>
          <div style={s.resultHeader}>
            <h3 style={s.resultTitle}>{ICONS[commodity]} {commodity} · {district}</h3>
            <span style={s.modelBadge}>Model: {modelVersion}</span>
          </div>
          <table style={s.table}>
            <thead>
              <tr style={s.tableHead}>
                <th style={s.th}>Date</th>
                <th style={s.th}>Predicted Price</th>
                <th style={s.th}>Range (Low–High)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.date} style={{ background: i % 2 === 0 ? '#fff' : '#f9fbe7' }}>
                  <td style={s.td}>{r.date}</td>
                  <td style={{ ...s.td, fontWeight: 700, color: '#2d7a2d', fontSize: 18 }}>₹{r.predicted_price.toFixed(2)}</td>
                  <td style={{ ...s.td, color: '#888' }}>₹{r.lower_bound.toFixed(0)} – ₹{r.upper_bound.toFixed(0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { padding: '32px 32px 80px', background: '#f5f5f0', minHeight: '100vh' },
  title: { fontSize: 26, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 },
  sub: { fontSize: 14, color: '#888', marginBottom: 28 },
  controls: { background: '#fff', borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: 20 },
  controlBox: {},
  label: { fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 10 },
  chips: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  chip: { padding: '8px 16px', borderRadius: 20, border: '1.5px solid #ddd', background: '#fafafa', fontSize: 14, color: '#555', cursor: 'pointer', fontWeight: 500 },
  chipOn: { background: '#2d7a2d', borderColor: '#2d7a2d', color: '#fff', fontWeight: 600 },
  btn: { alignSelf: 'flex-start', background: '#2d7a2d', color: '#fff', padding: '12px 28px', borderRadius: 10, fontSize: 15, fontWeight: 600 },
  error: { background: '#ffebee', color: '#c62828', padding: '12px 16px', borderRadius: 10, marginBottom: 16 },
  resultBox: { background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  resultHeader: { padding: '16px 20px', background: '#e8f5e9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  resultTitle: { fontSize: 17, fontWeight: 700, color: '#2d7a2d', textTransform: 'capitalize' },
  modelBadge: { fontSize: 12, color: '#888', background: '#fff', padding: '4px 10px', borderRadius: 20 },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHead: { background: '#f5f5f5' },
  th: { padding: '12px 20px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#555' },
  td: { padding: '14px 20px', fontSize: 15, color: '#333' },
};
