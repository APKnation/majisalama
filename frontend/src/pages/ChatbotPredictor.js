import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const districts = ["Ilala", "Kinondoni", "Temeke", "Kigamboni", "Ubungo", "Arusha", "Mwanza", "Dodoma", "Mbeya", "Morogoro"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const districtDefaults = {
  'Ilala': { humidity: 65, water_level: 75, pH: 7.0, turbidity: 2.5, flow_rate: 55 },
  'Kinondoni': { humidity: 62, water_level: 80, pH: 7.1, turbidity: 2.2, flow_rate: 50 },
  'Temeke': { humidity: 68, water_level: 60, pH: 6.9, turbidity: 3.0, flow_rate: 45 },
  'Kigamboni': { humidity: 70, water_level: 85, pH: 7.2, turbidity: 1.8, flow_rate: 40 },
  'Ubungo': { humidity: 64, water_level: 70, pH: 7.0, turbidity: 2.6, flow_rate: 52 },
  'Arusha': { humidity: 60, water_level: 65, pH: 7.3, turbidity: 2.0, flow_rate: 48 },
  'Mwanza': { humidity: 72, water_level: 55, pH: 6.8, turbidity: 3.2, flow_rate: 42 },
  'Dodoma': { humidity: 55, water_level: 50, pH: 7.4, turbidity: 1.9, flow_rate: 38 },
  'Mbeya': { humidity: 66, water_level: 68, pH: 7.1, turbidity: 2.4, flow_rate: 47 },
  'Morogoro': { humidity: 67, water_level: 62, pH: 7.0, turbidity: 2.7, flow_rate: 44 },
};

export default function ChatbotPredictor() {
  const currentMonth = new Date().toLocaleString('en-US', { month: 'short' });
  
  const [form, setForm] = useState({
    district: 'Ilala',
    temperature: '',
    rainfall: '',
    population: '',
    month: currentMonth
  });
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const defaults = districtDefaults[form.district] || districtDefaults['Ilala'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setResult(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const payload = {
        temperature: parseFloat(form.temperature),
        rainfall: parseFloat(form.rainfall),
        population: parseInt(form.population),
        district: form.district,
        month: form.month
      };
      const response = await api.post('/predict-demand/', payload);
      setResult(response.data);
    } catch (err) {
      setError('Hitilafu imetokea. Hakikisha seva inafanya kazi.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    background: '#0d0d0d',
    border: '1px solid #3c3c3c',
    padding: '12px 16px',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: 400,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s ease'
  };

  const labelStyle = {
    display: 'block',
    color: '#7e7e7e',
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    marginBottom: '8px'
  };

  return (
    <div style={{ background: '#000000', minHeight: '100vh', color: '#ffffff' }}>
      <div style={{
        height: '4px',
        background: 'linear-gradient(90deg, #0066b1 0%, #1c69d4 50%, #e22718 100%)'
      }} />

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '80px 24px 64px' }}>
        <div style={{ marginBottom: '48px' }}>
          <p style={{
            color: '#0066b1',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            marginBottom: '16px'
          }}>
            Ufahamu wa AI
          </p>
          <h1 style={{
            color: '#ffffff',
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: 700,
            textTransform: 'uppercase',
            lineHeight: 1.05,
            marginBottom: '16px'
          }}>
            Utabiri wa Maji
          </h1>
          <p style={{
            color: '#7e7e7e',
            fontSize: '14px',
            fontWeight: 300,
            lineHeight: 1.5
          }}>
            Weka taarifa muhimu za kujumlisha ili upate utabiri wa mahitaji ya maji.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Wilaya</label>
              <select
                name="district"
                value={form.district}
                onChange={handleChange}
                style={{ ...inputStyle, cursor: 'pointer' }}
                onFocus={(e) => e.target.style.borderColor = '#ffffff'}
                onBlur={(e) => e.target.style.borderColor = '#3c3c3c'}
              >
                {districts.map(d => <option key={d} value={d} style={{ background: '#0d0d0d' }}>{d}</option>)}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Joto</label>
              <div style={{ position: 'relative' }}>
                <input
                  required
                  type="number"
                  step="any"
                  name="temperature"
                  value={form.temperature}
                  onChange={handleChange}
                  placeholder="mfano: 28"
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = '#ffffff'}
                  onBlur={(e) => e.target.style.borderColor = '#3c3c3c'}
                />
                <span style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#7e7e7e',
                  fontSize: '11px'
                }}>°C</span>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Mvua</label>
              <div style={{ position: 'relative' }}>
                <input
                  required
                  type="number"
                  step="any"
                  name="rainfall"
                  value={form.rainfall}
                  onChange={handleChange}
                  placeholder="mfano: 120"
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = '#ffffff'}
                  onBlur={(e) => e.target.style.borderColor = '#3c3c3c'}
                />
                <span style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#7e7e7e',
                  fontSize: '11px'
                }}>mm</span>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Idadi ya Watu</label>
              <div style={{ position: 'relative' }}>
                <input
                  required
                  type="number"
                  name="population"
                  value={form.population}
                  onChange={handleChange}
                  placeholder="mfano: 500000"
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = '#ffffff'}
                  onBlur={(e) => e.target.style.borderColor = '#3c3c3c'}
                />
                <span style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#7e7e7e',
                  fontSize: '11px'
                }}>watu</span>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Mwezi</label>
              <select
                name="month"
                value={form.month}
                onChange={handleChange}
                style={{ ...inputStyle, cursor: 'pointer' }}
                onFocus={(e) => e.target.style.borderColor = '#ffffff'}
                onBlur={(e) => e.target.style.borderColor = '#3c3c3c'}
              >
                {months.map(m => <option key={m} value={m} style={{ background: '#0d0d0d' }}>{m}</option>)}
              </select>
            </div>

            <div style={{ gridColumn: '1 / -1', marginTop: '8px' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  padding: '16px 32px',
                  border: '1px solid #ffffff',
                  background: loading ? '#1a1a1a' : '#ffffff',
                  color: loading ? '#7e7e7e' : '#000000',
                  fontSize: '14px',
                  fontWeight: 700,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.background = '#e6e6e6';
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.currentTarget.style.background = '#ffffff';
                }}
              >
                {loading ? 'INACHUKATA...' : 'PATA UTABIRI'}
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div style={{
            marginTop: '32px',
            padding: '16px 24px',
            background: '#0d0d0d',
            border: '1px solid #3c3c3c',
            color: '#ffffff'
          }}>
            <p style={{ fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>HITILAFU</p>
            <p style={{ fontSize: '13px', color: '#bbbbbb', fontWeight: 300 }}>{error}</p>
          </div>
        )}

        {result && (
          <div style={{ marginTop: '64px' }}>
            <div style={{
              height: '4px',
              background: 'linear-gradient(90deg, #0066b1 0%, #1c69d4 50%, #e22718 100%)',
              marginBottom: '40px'
            }} />

            <div style={{ marginBottom: '40px' }}>
              <p style={{
                color: '#7e7e7e',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                marginBottom: '12px'
              }}>
                Matokeo ya Utabiri
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', flexWrap: 'wrap' }}>
                <span style={{
                  color: '#ffffff',
                  fontSize: 'clamp(40px, 5vw, 64px)',
                  fontWeight: 700,
                  lineHeight: 1
                }}>
                  {Math.round(result.predicted_demand).toLocaleString()}
                </span>
                <span style={{
                  color: '#7e7e7e',
                  fontSize: '14px',
                  fontWeight: 300,
                  letterSpacing: '1px',
                  textTransform: 'uppercase'
                }}>
                  lita / siku
                </span>
              </div>
              <p style={{ color: '#bbbbbb', fontSize: '13px', fontWeight: 300, marginTop: '8px' }}>
                Kiasi cha maji kinachotarajiwa kwa kipindi cha siku 1
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1px',
              background: '#3c3c3c',
              marginBottom: '40px'
            }}>
              {[
                { label: 'KILA MTU', value: `${result.predicted_per_capita} L`, accent: '#0066b1' },
                { label: 'WILAYA', value: result.inputs.district, accent: '#1c69d4' },
                { label: 'MWEZI', value: result.inputs.month, accent: '#e22718' },
                { label: 'JOTO', value: `${result.inputs.temperature}°C`, accent: '#ffffff' },
              ].map(({ label, value, accent }) => (
                <div key={label} style={{ background: '#0d0d0d', padding: '24px' }}>
                  <p style={{
                    color: '#7e7e7e',
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    marginBottom: '12px'
                  }}>
                    {label}
                  </p>
                  <p style={{
                    color: accent,
                    fontSize: '20px',
                    fontWeight: 700,
                    lineHeight: 1.2
                  }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div>
              <p style={{
                color: '#7e7e7e',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                marginBottom: '16px'
              }}>
                Taarifa Zilizotumika
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1px',
                background: '#1a1a1a'
              }}>
                {[
                  { label: 'MVUA', value: `${result.inputs.rainfall} mm` },
                  { label: 'WATU', value: Number(result.inputs.population).toLocaleString() },
                  { label: 'KIWANGO', value: `${result.inputs.water_level || defaults.water_level} cm` },
                  { label: 'PH', value: result.inputs.pH || defaults.pH },
                  { label: 'TURBIDITY', value: `${result.inputs.turbidity || defaults.turbidity} NTU` },
                  { label: 'MTIRIRIKO', value: `${result.inputs.flow_rate || defaults.flow_rate} L/s` },
                  { label: 'UNGANO', value: `${result.inputs.humidity || defaults.humidity}%` },
                  { label: 'MFANYABIASHARA', value: 'Random Forest' },
                ].map(({ label, value }) => (
                  <div key={label} style={{ background: '#0d0d0d', padding: '16px 20px' }}>
                    <p style={{ color: '#7e7e7e', fontSize: '9px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>
                      {label}
                    </p>
                    <p style={{ color: '#ffffff', fontSize: '14px', fontWeight: 400 }}>
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '40px' }}>
              <button
                onClick={() => {
                  setForm({
                    district: 'Ilala',
                    temperature: '',
                    rainfall: '',
                    population: '',
                    month: new Date().toLocaleString('en-US', { month: 'short' })
                  });
                  setResult(null);
                  setError('');
                }}
                style={{
                  padding: '12px 24px',
                  border: '1px solid #3c3c3c',
                  background: 'transparent',
                  color: '#bbbbbb',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#ffffff';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#3c3c3c';
                  e.currentTarget.style.color = '#bbbbbb';
                }}
              >
                HESABU TENA
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
