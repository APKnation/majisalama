import React, { useState } from 'react';
import api from '../utils/api';

const districts = ["Ilala", "Kinondoni", "Temeke", "Kigamboni", "Ubungo", "Arusha", "Mwanza", "Dodoma", "Mbeya", "Morogoro"];

export default function ChatbotPredictor() {
  const [form, setForm] = useState({ temperature: '', rainfall: '', water_level: '', population: '', district: 'Ilala' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setResult(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const response = await api.post('/predict-demand/', {
        temperature: parseFloat(form.temperature),
        rainfall: parseFloat(form.rainfall),
        water_level: parseFloat(form.water_level),
        population: parseInt(form.population),
        district: form.district,
      });
      setResult(Math.round(response.data.predicted_demand));
    } catch (err) {
      setError('Hitilafu imetokea. Hakikisha seva inafanya kazi.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ temperature: '', rainfall: '', water_level: '', population: '', district: 'Ilala' });
    setResult(null);
    setError('');
  };

  const fields = [
    { name: 'temperature', label: 'Joto', unit: '°C', icon: '🌡️', placeholder: 'mfano: 28', type: 'number' },
    { name: 'rainfall', label: 'Mvua', unit: 'mm', icon: '🌧️', placeholder: 'mfano: 120', type: 'number' },
    { name: 'water_level', label: 'Kiwango cha Maji', unit: 'cm', icon: '💧', placeholder: 'mfano: 80', type: 'number' },
    { name: 'population', label: 'Idadi ya Watu', unit: 'watu', icon: '👥', placeholder: 'mfano: 50000', type: 'number' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#0a0e1a 0%,#0d1b2e 50%,#0a0e1a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ width: '100%', maxWidth: 520 }}>

        {/* Page Title */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#00c6ff,#0072ff)', marginBottom: 16, boxShadow: '0 0 24px rgba(0,114,255,0.4)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M12 2C12 2 4 10.5 4 15a8 8 0 0016 0C20 10.5 12 2 12 2z"/></svg>
          </div>
          <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>Utabiri wa Maji</h1>
          <p style={{ color: 'rgba(170,210,255,0.6)', fontSize: 13, marginTop: 6 }}>Ingiza taarifa hapa chini kupata utabiri wa mahitaji ya maji</p>
        </div>

        {/* Form Card */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,199,255,0.15)', borderRadius: 20, padding: '32px 28px', backdropFilter: 'blur(20px)' }}>
          <form onSubmit={handleSubmit}>

            {/* Numeric Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              {fields.map(({ name, label, unit, icon, placeholder, type }) => (
                <div key={name}>
                  <label style={{ display: 'block', color: 'rgba(170,210,255,0.8)', fontSize: 11, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 6 }}>
                    {icon} {label}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      required
                      type={type}
                      step="any"
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(99,199,255,0.2)', borderRadius: 10, padding: '10px 42px 10px 12px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                      onFocus={e => e.target.style.borderColor = '#0072ff'}
                      onBlur={e => e.target.style.borderColor = 'rgba(99,199,255,0.2)'}
                    />
                    <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>{unit}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* District Select */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: 'rgba(170,210,255,0.8)', fontSize: 11, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 6 }}>
                📍 Wilaya / Mtaa
              </label>
              <select
                name="district"
                value={form.district}
                onChange={handleChange}
                style={{ width: '100%', background: '#0d1b2e', border: '1px solid rgba(99,199,255,0.2)', borderRadius: 10, padding: '11px 12px', color: '#fff', fontSize: 14, outline: 'none', cursor: 'pointer' }}
                onFocus={e => e.target.style.borderColor = '#0072ff'}
                onBlur={e => e.target.style.borderColor = 'rgba(99,199,255,0.2)'}
              >
                {districts.map(d => <option key={d} value={d} style={{ background: '#0d1b2e' }}>{d}</option>)}
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: loading ? 'rgba(0,114,255,0.4)' : 'linear-gradient(135deg,#0072ff,#00c6ff)', color: '#fff', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '0.5px', boxShadow: loading ? 'none' : '0 4px 20px rgba(0,114,255,0.4)', transition: 'all 0.2s' }}
            >
              {loading ? '⏳ Inachakata...' : '🔍 Pata Utabiri'}
            </button>
          </form>

          {/* Error */}
          {error && (
            <div style={{ marginTop: 20, padding: '12px 16px', background: 'rgba(255,60,60,0.1)', border: '1px solid rgba(255,60,60,0.3)', borderRadius: 10, color: '#ff8080', fontSize: 13 }}>
              ⚠️ {error}
            </div>
          )}

          {/* Result Card */}
          {result !== null && (
            <div style={{ marginTop: 24, background: 'linear-gradient(135deg,#0f2027,#203a43,#2c5364)', border: '1px solid rgba(99,199,255,0.25)', borderRadius: 16, padding: '24px 20px', boxShadow: '0 0 30px rgba(0,150,255,0.15)', animation: 'fadeSlideUp 0.5s ease' }}>
              
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <p style={{ color: 'rgba(170,212,255,0.7)', fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 8px' }}>Mahitaji ya Maji Yanatarajiwa</p>
                <p style={{ fontSize: 52, fontWeight: 900, background: 'linear-gradient(90deg,#00c6ff,#0072ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0, lineHeight: 1 }}>
                  {result.toLocaleString()}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 6 }}>lita / siku</p>
              </div>

              <div style={{ height: 1, background: 'rgba(99,199,255,0.15)', margin: '0 0 16px' }} />

              <p style={{ color: 'rgba(170,212,255,0.6)', fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 10 }}>Taarifa Ulizotoa</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
                {[
                  { label: '🌡️ Joto', value: `${form.temperature}°C` },
                  { label: '🌧️ Mvua', value: `${form.rainfall} mm` },
                  { label: '💧 Kiwango Maji', value: `${form.water_level} cm` },
                  { label: '👥 Watu', value: Number(form.population).toLocaleString() },
                  { label: '📍 Wilaya', value: form.district },
                ].map(({ label, value }) => (
                  <div key={label} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '8px 12px' }}>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, margin: '0 0 2px' }}>{label}</p>
                    <p style={{ color: '#fff', fontSize: 13, fontWeight: 600, margin: 0 }}>{value}</p>
                  </div>
                ))}
              </div>

              <button onClick={handleReset} style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid rgba(0,198,255,0.3)', background: 'rgba(0,114,255,0.1)', color: '#00c6ff', fontSize: 13, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.5px' }}>
                🔄 Hesabu Tena
              </button>
            </div>
          )}
        </div>

        <style>{`@keyframes fadeSlideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }`}</style>
      </div>
    </div>
  );
}
