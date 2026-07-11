import React, { useState } from 'react';
import api from '../utils/api';

const districts = ["Ilala", "Kinondoni", "Temeke", "Kigamboni", "Ubungo", "Arusha", "Mwanza", "Dodoma", "Mbeya", "Morogoro"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function ChatbotPredictor() {
  const [form, setForm] = useState({
    temperature: '',
    rainfall: '',
    humidity: '',
    population: '',
    water_level: '',
    pH: '',
    turbidity: '',
    flow_rate: '',
    district: 'Ilala',
    month: new Date().toLocaleString('en-US', { month: 'short' }),
    forecast_rainfall: '',
    forecast_temperature: '',
    is_holiday: 0
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
        humidity: parseFloat(form.humidity),
        population: parseInt(form.population),
        water_level: parseFloat(form.water_level),
        pH: parseFloat(form.pH),
        turbidity: parseFloat(form.turbidity),
        flow_rate: parseFloat(form.flow_rate),
        district: form.district,
        month: form.month,
        forecast_rainfall: form.forecast_rainfall ? parseFloat(form.forecast_rainfall) : parseFloat(form.rainfall),
        forecast_temperature: form.forecast_temperature ? parseFloat(form.forecast_temperature) : parseFloat(form.temperature),
        is_holiday: parseInt(form.is_holiday)
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
    transition: 'border-color 0.15s ease',
    fontFamily: "'BMWTypeNextLatin', 'Inter', sans-serif"
  };

  const labelStyle = {
    display: 'block',
    color: '#7e7e7e',
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    marginBottom: '8px',
    fontFamily: "'BMWTypeNextLatin', 'Inter', sans-serif"
  };

  return (
    <div style={{ background: '#000000', minHeight: '100vh', color: '#ffffff' }}>
      {/* M STRIPE DIVIDER */}
      <div style={{
        height: '4px',
        background: 'linear-gradient(90deg, #0066b1 0%, #1c69d4 50%, #e22718 100%)'
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 32px 64px' }}>
        {/* HEADER */}
        <div style={{ marginBottom: '64px' }}>
          <p style={{
            color: '#0066b1',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            marginBottom: '16px',
            fontFamily: "'BMWTypeNextLatin', 'Inter', sans-serif"
          }}>
            Ufahamu wa AI
          </p>
          <h1 style={{
            color: '#ffffff',
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: 700,
            textTransform: 'uppercase',
            lineHeight: 1.05,
            marginBottom: '16px',
            fontFamily: "'BMWTypeNextLatin', 'Inter', sans-serif"
          }}>
            Utabiri wa Maji
          </h1>
          <p style={{
            color: '#7e7e7e',
            fontSize: '14px',
            fontWeight: 300,
            lineHeight: 1.5,
            maxWidth: '600px'
          }}>
            Weka taarifa za hali ya sasa ili mfanyakabiashara wa Random Forest akutoa utabiri wa mahitaji ya maji kwa kipindi kilichofuata.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px 40px' }}>
            {/* WEATHER CONDITIONS */}
            <div style={{ gridColumn: '1 / -1' }}>
              <p style={{
                color: '#7e7e7e',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                marginBottom: '16px',
                paddingBottom: '8px',
                borderBottom: '1px solid #3c3c3c',
                fontFamily: "'BMWTypeNextLatin', 'Inter', sans-serif"
              }}>
                Hali ya Hewa
              </p>
            </div>

            {[
              { name: 'temperature', label: 'Joto', unit: '°C', placeholder: 'mfano: 28', type: 'number' },
              { name: 'rainfall', label: 'Mvua (sasa)', unit: 'mm', placeholder: 'mfano: 120', type: 'number' },
              { name: 'humidity', label: 'Ungamo', unit: '%', placeholder: 'mfano: 70', type: 'number' },
              { name: 'forecast_temperature', label: 'Joto (utabiri)', unit: '°C', placeholder: 'mfano: 30', type: 'number' },
              { name: 'forecast_rainfall', label: 'Mvua (utabiri)', unit: 'mm', placeholder: 'mfano: 80', type: 'number' },
            ].map(({ name, label, unit, placeholder, type }) => (
              <div key={name}>
                <label style={labelStyle}>{label}</label>
                <div style={{ position: 'relative' }}>
                  <input
                    required
                    type={type}
                    step="any"
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
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
                    fontSize: '11px',
                    fontWeight: 400
                  }}>{unit}</span>
                </div>
              </div>
            ))}

            {/* WATER QUALITY */}
            <div style={{ gridColumn: '1 / -1', marginTop: '8px' }}>
              <p style={{
                color: '#7e7e7e',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                marginBottom: '16px',
                paddingBottom: '8px',
                borderBottom: '1px solid #3c3c3c',
                fontFamily: "'BMWTypeNextLatin', 'Inter', sans-serif"
              }}>
                Ubora wa Maji
              </p>
            </div>

            {[
              { name: 'water_level', label: 'Kiwango cha Maji', unit: 'cm', placeholder: 'mfano: 80' },
              { name: 'pH', label: 'pH', unit: '', placeholder: 'mfano: 7.0' },
              { name: 'turbidity', label: 'Turbidity', unit: 'NTU', placeholder: 'mfano: 2.5' },
              { name: 'flow_rate', label: 'Kasi ya Mtiririko', unit: 'L/s', placeholder: 'mfano: 50' },
            ].map(({ name, label, unit, placeholder }) => (
              <div key={name}>
                <label style={labelStyle}>{label}</label>
                <div style={{ position: 'relative' }}>
                  <input
                    required
                    type="number"
                    step="any"
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    style={inputStyle}
                    onFocus={(e) => e.target.style.borderColor = '#ffffff'}
                    onBlur={(e) => e.target.style.borderColor = '#3c3c3c'}
                  />
                  {unit && (
                    <span style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#7e7e7e',
                      fontSize: '11px',
                      fontWeight: 400
                    }}>{unit}</span>
                  )}
                </div>
              </div>
            ))}

            {/* LOCATION & TIME */}
            <div style={{ gridColumn: '1 / -1', marginTop: '8px' }}>
              <p style={{
                color: '#7e7e7e',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                marginBottom: '16px',
                paddingBottom: '8px',
                borderBottom: '1px solid #3c3c3c',
                fontFamily: "'BMWTypeNextLatin', 'Inter', sans-serif"
              }}>
                Mahali na Muda
              </p>
            </div>

            <div>
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

            {/* POPULATION */}
            <div style={{ gridColumn: '1 / -1', marginTop: '8px' }}>
              <p style={{
                color: '#7e7e7e',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                marginBottom: '16px',
                paddingBottom: '8px',
                borderBottom: '1px solid #3c3c3c',
                fontFamily: "'BMWTypeNextLatin', 'Inter', sans-serif"
              }}>
                Idadi ya Watu
              </p>
            </div>

            <div style={{ gridColumn: '1 / -1', maxWidth: '400px' }}>
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
                  fontSize: '11px',
                  fontWeight: 400
                }}>watu</span>
              </div>
            </div>

            {/* SUBMIT */}
            <div style={{ gridColumn: '1 / -1', marginTop: '24px' }}>
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
                  transition: 'all 0.15s ease',
                  fontFamily: "'BMWTypeNextLatin', 'Inter', sans-serif"
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

        {/* ERROR */}
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

        {/* RESULT */}
        {result && (
          <div style={{ marginTop: '64px' }}>
            {/* M STRIPE */}
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
                  lineHeight: 1,
                  fontFamily: "'BMWTypeNextLatin', 'Inter', sans-serif"
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

            {/* METRICS GRID */}
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
                    lineHeight: 1.2,
                    fontFamily: "'BMWTypeNextLatin', 'Inter', sans-serif"
                  }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* INPUT SUMMARY */}
            <div>
              <p style={{
                color: '#7e7e7e',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                marginBottom: '16px'
              }}>
                Taarifa Ulizotoa
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1px',
                background: '#1a1a1a'
              }}>
                {[
                  { label: 'JOTO', value: `${result.inputs.temperature}°C` },
                  { label: 'MVUA', value: `${result.inputs.rainfall} mm` },
                  { label: 'UNGANO', value: `${result.inputs.humidity}%` },
                  { label: 'WATU', value: Number(result.inputs.population).toLocaleString() },
                  { label: 'KIWANGO', value: `${result.inputs.water_level} cm` },
                  { label: 'PH', value: result.inputs.pH },
                  { label: 'TURBIDITY', value: `${result.inputs.turbidity} NTU` },
                  { label: 'MTIRIRIKO', value: `${result.inputs.flow_rate} L/s` },
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

            {/* RESET */}
            <div style={{ marginTop: '40px' }}>
              <button
                onClick={() => {
                  setForm({
                    temperature: '', rainfall: '', humidity: '', population: '',
                    water_level: '', pH: '', turbidity: '', flow_rate: '',
                    district: 'Ilala', month: new Date().toLocaleString('en-US', { month: 'short' }),
                    forecast_rainfall: '', forecast_temperature: '', is_holiday: 0
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
                  transition: 'all 0.15s ease',
                  fontFamily: "'BMWTypeNextLatin', 'Inter', sans-serif"
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
