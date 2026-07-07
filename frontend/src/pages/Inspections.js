import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const STATUS_MAP = {
  pending_village:       { color: "#f4b400", label: "Inasubiri Idhini" },
  village_approved:      { color: "#1c69d4", label: "Imeidhinishwa" },
  forwarded_to_district: { color: "#9b59b6", label: "Wilayani" },
  rejected:              { color: "#e74c3c", label: "Imekataliwa" },
  assigned:              { color: "#0066b1", label: "Imepewa Mfanyakazi" },
  in_progress:           { color: "#1c69d4", label: "Inafanywa Kazi" },
  resolved:              { color: "#0fa336", label: "Imetatuliwa" },
  closed:                { color: "#7e7e7e", label: "Imefungwa" },
  pending:               { color: "#f4b400", label: "Inasubiri" },
};

export default function Inspections() {
  const { user } = useAuth();
  const [reports, setReports]   = useState([]);
  const [sources, setSources]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");
  const [form, setForm]         = useState({
    water_source_id: "", ph_level: "", bacteria_count: "",
    iron_level: "", turbidity: "", chlorine_level: "", is_safe: "true", notes: "",
  });

  useEffect(() => { fetchData(); }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rRes, sRes] = await Promise.all([
        api.get("/quality-reports/"),
        user?.village?.id ? api.get(`/water-sources/?village=${user.village.id}`) : Promise.resolve({ data: [] }),
      ]);
      setReports(rRes.data.results || rRes.data);
      setSources(sRes.data.results || sRes.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true); setError(""); setSuccess("");
    try {
      await api.post("/quality-reports/", {
        ...form,
        water_source_id: parseInt(form.water_source_id),
        ph_level: parseFloat(form.ph_level),
        bacteria_count: parseInt(form.bacteria_count),
        iron_level: parseFloat(form.iron_level),
        turbidity: parseFloat(form.turbidity),
        chlorine_level: form.chlorine_level ? parseFloat(form.chlorine_level) : null,
        is_safe: form.is_safe === "true",
      });
      setSuccess("Matokeo ya ukaguzi yamehifadhiwa!");
      setShowForm(false);
      setForm({ water_source_id: "", ph_level: "", bacteria_count: "", iron_level: "", turbidity: "", chlorine_level: "", is_safe: "true", notes: "" });
      fetchData();
    } catch (e) {
      setError(e.response?.data?.detail || "Hitilafu. Jaribu tena.");
    } finally { setSaving(false); }
  };

  const inputStyle = {
    width: "100%", padding: "11px 14px", background: "#1a1a1a",
    border: "1px solid #3c3c3c", color: "#ffffff", fontSize: "14px",
    outline: "none", boxSizing: "border-box",
  };
  const labelStyle = { display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "7px" };

  return (
    <div style={{ background: "#000000", minHeight: "100vh", color: "#ffffff" }}>
      <div className="m-stripe" />
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 32px" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <p style={{ color: "#0066b1", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "10px" }}>
              Kijiji · {user?.village?.name}
            </p>
            <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, textTransform: "uppercase", marginBottom: "6px" }}>
              Uchunguzi wa Ubora
            </h1>
            <p style={{ color: "#bbbbbb", fontSize: "14px", fontWeight: 300 }}>
              Ingiza na tazama matokeo ya ukaguzi wa ubora wa maji.
            </p>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setError(""); setSuccess(""); }}
            style={{
              padding: "0 24px", height: "42px",
              background: showForm ? "transparent" : "#0066b1",
              color: showForm ? "#7e7e7e" : "#ffffff",
              border: `1px solid ${showForm ? "#3c3c3c" : "#0066b1"}`,
              fontSize: "11px", fontWeight: 700, letterSpacing: "1px",
              textTransform: "uppercase", cursor: "pointer", transition: "all 0.15s",
            }}
          >
            {showForm ? "✕ Ghairi" : "+ Ingiza Matokeo"}
          </button>
        </div>

        {success && (
          <div style={{ background: "#012010", border: "1px solid #0fa336", padding: "14px 20px", marginBottom: "20px", color: "#0fa336", fontSize: "13px" }}>
            ✅ {success}
          </div>
        )}

        {/* Quality Test Form */}
        {showForm && (
          <form onSubmit={handleSubmit} style={{ background: "#0d0d0d", border: "1px solid #3c3c3c", padding: "32px", marginBottom: "32px" }}>
            <p style={{ color: "#ffffff", fontSize: "14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "24px" }}>
              Matokeo ya Ukaguzi Mpya
            </p>
            {error && (
              <div style={{ background: "#2d0808", border: "1px solid #e74c3c", padding: "12px 16px", marginBottom: "20px", color: "#e74c3c", fontSize: "13px" }}>
                ⚠️ {error}
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "18px", marginBottom: "18px" }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Chanzo cha Maji *</label>
                <select name="water_source_id" value={form.water_source_id} onChange={handleChange} required style={inputStyle}>
                  <option value="">— Chagua chanzo —</option>
                  {sources.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Kiwango cha pH *</label>
                <input name="ph_level" type="number" step="0.01" min="0" max="14" value={form.ph_level} onChange={handleChange} required placeholder="7.00" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Bakteria (cfu/100ml) *</label>
                <input name="bacteria_count" type="number" min="0" value={form.bacteria_count} onChange={handleChange} required placeholder="0" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Chuma (mg/L) *</label>
                <input name="iron_level" type="number" step="0.001" min="0" value={form.iron_level} onChange={handleChange} required placeholder="0.000" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Mawio (NTU) *</label>
                <input name="turbidity" type="number" step="0.01" min="0" value={form.turbidity} onChange={handleChange} required placeholder="0.00" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Klorini (mg/L)</label>
                <input name="chlorine_level" type="number" step="0.001" min="0" value={form.chlorine_level} onChange={handleChange} placeholder="Hiari" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Je, Maji Ni Salama? *</label>
                <select name="is_safe" value={form.is_safe} onChange={handleChange} required style={inputStyle}>
                  <option value="true">✅ Ndio – Salama</option>
                  <option value="false">❌ Hapana – Hatarini</option>
                </select>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Maelezo ya Ziada</label>
                <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder="Maelezo ya ukaguzi..." style={{ ...inputStyle, resize: "vertical" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: "0 24px", height: "42px", background: "transparent", border: "1px solid #3c3c3c", color: "#7e7e7e", fontSize: "12px", fontWeight: 700, cursor: "pointer", textTransform: "uppercase", letterSpacing: "1px" }}>
                Ghairi
              </button>
              <button type="submit" disabled={saving} style={{ padding: "0 32px", height: "42px", background: saving ? "#1a1a1a" : "#0066b1", border: "none", color: "#ffffff", fontSize: "12px", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", textTransform: "uppercase", letterSpacing: "1px" }}>
                {saving ? "Inahifadhi..." : "Hifadhi Matokeo"}
              </button>
            </div>
          </form>
        )}

        {/* Reports Table */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
            {[1, 2, 3].map(i => <div key={i} style={{ background: "#0d0d0d", height: "70px" }} />)}
          </div>
        ) : reports.length === 0 ? (
          <div style={{ border: "1px solid #3c3c3c", padding: "64px 32px", textAlign: "center" }}>
            <p style={{ color: "#7e7e7e", fontWeight: 300, marginBottom: "8px" }}>Hakuna matokeo ya ukaguzi yaliyorekodiwa.</p>
            <p style={{ color: "#3c3c3c", fontSize: "12px" }}>Bonyeza "+ Ingiza Matokeo" kuanza.</p>
          </div>
        ) : (
          <div style={{ border: "1px solid #3c3c3c", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #3c3c3c", background: "#0d0d0d" }}>
                  {["Chanzo", "Tarehe", "pH", "Bakteria", "Chuma", "Mawio", "Salama?", "Mpimaji"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reports.map(r => (
                  <tr key={r.id} style={{ borderBottom: "1px solid #1a1a1a", transition: "background 0.12s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#0d0d0d")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "14px 16px", color: "#ffffff", fontSize: "14px", fontWeight: 700, whiteSpace: "nowrap" }}>
                      {r.water_source?.name || "—"}
                    </td>
                    <td style={{ padding: "14px 16px", color: "#7e7e7e", fontSize: "12px", whiteSpace: "nowrap" }}>
                      {new Date(r.test_date).toLocaleDateString("sw-TZ")}
                    </td>
                    <td style={{ padding: "14px 16px", color: parseFloat(r.ph_level) >= 6.5 && parseFloat(r.ph_level) <= 8.5 ? "#0fa336" : "#e74c3c", fontSize: "14px", fontWeight: 700 }}>
                      {r.ph_level}
                    </td>
                    <td style={{ padding: "14px 16px", color: "#bbbbbb", fontSize: "13px" }}>{r.bacteria_count}</td>
                    <td style={{ padding: "14px 16px", color: "#bbbbbb", fontSize: "13px" }}>{r.iron_level}</td>
                    <td style={{ padding: "14px 16px", color: "#bbbbbb", fontSize: "13px" }}>{r.turbidity}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ color: r.is_safe ? "#0fa336" : "#e74c3c", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>
                        {r.is_safe ? "✅ Salama" : "❌ Hatarini"}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px", color: "#7e7e7e", fontSize: "12px" }}>
                      {r.tested_by?.username || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
