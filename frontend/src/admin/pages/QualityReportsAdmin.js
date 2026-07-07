import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { getAllQualityReports, getAllWaterSources, createQualityReport } from "../utils/adminApi";

function StatusBadge({ status, label }) {
  const map = {
    true:  { color: "#0fa336", bg: "#012010" },
    false: { color: "#ffffff", bg: "#2e0800" },
  };
  const s = map[String(status)] || { color: "#7e7e7e", bg: "#1a1a1a" };
  return (
    <span style={{ display: "inline-block", padding: "2px 10px", background: s.bg, color: s.color, fontSize: "10px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", border: `1px solid ${s.color}33` }}>
      {label || (status ? "Salama" : "Hatarini")}
    </span>
  );
}

export default function QualityReportsAdmin() {
  const [qualityReports, setQualityReports] = useState([]);
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    water_source_id: "", ph_level: "", bacteria_count: "", iron_level: "", turbidity: "", chlorine_level: "", is_safe: true, notes: "",
  });

  useEffect(() => {
    fetchReports();
    fetchSources();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await getAllQualityReports();
      setQualityReports(response.data.results || response.data);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const fetchSources = async () => {
    try {
      const response = await getAllWaterSources();
      setSources(response.data.results || response.data);
    } catch (error) { console.error(error); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createQualityReport(formData);
      setShowModal(false);
      setFormData({ water_source_id: "", ph_level: "", bacteria_count: "", iron_level: "", turbidity: "", chlorine_level: "", is_safe: true, notes: "" });
      fetchReports();
    } catch (error) { alert("Kuna hitilafu. Jaribu tena."); }
  };

  return (
    <AdminLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }} className="flex-col sm:flex-row gap-4 sm:gap-0 animate-fade-in-up">
        <div>
          <p style={{ color: "#0066b1", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "10px" }}>Usimamizi wa Ubora</p>
          <h1 style={{ color: "#ffffff", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, textTransform: "uppercase", lineHeight: 1.05 }}>Ripoti za Ubora</h1>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-m-primary" style={{ height: "40px", padding: "0 24px", fontSize: "12px" }}>
          ➕ Ongeza Ripoti
        </button>
      </div>

      <div style={{ border: "1px solid #3c3c3c", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #3c3c3c", background: "#0d0d0d" }}>
              {["Chanzo", "pH", "Vimelea", "Iron", "Turbidity", "Tarehe", "Hali"].map((h) => (
                <th key={h} style={{ padding: "14px 20px", textAlign: "left", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [1,2,3].map(i => (
                <tr key={i} style={{ borderBottom: "1px solid #1a1a1a" }}>
                  {[1,2,3,4,5,6,7].map(j => <td key={j} style={{ padding: "16px 20px" }}><div style={{ height: "12px", background: "#1a1a1a", width: "70%" }} /></td>)}
                </tr>
              ))
            ) : qualityReports.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: "48px 20px", textAlign: "center", color: "#7e7e7e", fontWeight: 300 }}>Hakuna ripoti zilizosajiliwa.</td></tr>
            ) : (
              qualityReports.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #1a1a1a", transition: "background 0.12s" }} onMouseEnter={(e) => (e.currentTarget.style.background = "#0d0d0d")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td style={{ padding: "16px 20px", color: "#ffffff", fontSize: "14px", fontWeight: 700 }}>{r.water_source?.name || "—"}</td>
                  <td style={{ padding: "16px 20px", color: "#bbbbbb", fontSize: "13px", fontWeight: 300 }}>{r.ph_level || "—"}</td>
                  <td style={{ padding: "16px 20px", color: "#bbbbbb", fontSize: "13px", fontWeight: 300 }}>{r.bacteria_count || "—"}</td>
                  <td style={{ padding: "16px 20px", color: "#bbbbbb", fontSize: "13px", fontWeight: 300 }}>{r.iron_level || "—"}</td>
                  <td style={{ padding: "16px 20px", color: "#bbbbbb", fontSize: "13px", fontWeight: 300 }}>{r.turbidity || "—"}</td>
                  <td style={{ padding: "16px 20px", color: "#7e7e7e", fontSize: "12px", fontWeight: 300, whiteSpace: "nowrap" }}>{r.test_date ? new Date(r.test_date).toLocaleDateString("sw-TZ") : "—"}</td>
                  <td style={{ padding: "16px 20px" }}><StatusBadge status={r.is_safe} label={r.is_safe ? "Salama" : "Hatarini"} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "20px" }}>
          <div style={{ background: "#0d0d0d", border: "1px solid #3c3c3c", width: "100%", maxWidth: "800px", padding: "32px", maxHeight: "90vh", overflowY: "auto" }}>
            <h3 style={{ color: "#ffffff", fontSize: "20px", fontWeight: 700, textTransform: "uppercase", marginBottom: "24px" }}>Ongeza Ripoti ya Ubora</h3>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>Chanzo cha maji</label>
                  <select value={formData.water_source_id} onChange={(e) => setFormData({...formData, water_source_id: e.target.value})} required className="m-select">
                    <option value="">Chagua chanzo</option>
                    {sources.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>pH</label>
                  <input type="number" step="0.01" value={formData.ph_level} onChange={(e) => setFormData({...formData, ph_level: e.target.value})} required className="m-input" />
                </div>
                <div>
                  <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>Vimelea</label>
                  <input type="number" value={formData.bacteria_count} onChange={(e) => setFormData({...formData, bacteria_count: e.target.value})} required className="m-input" />
                </div>
                <div>
                  <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>Iron</label>
                  <input type="number" step="0.001" value={formData.iron_level} onChange={(e) => setFormData({...formData, iron_level: e.target.value})} className="m-input" />
                </div>
                <div>
                  <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>Turbidity</label>
                  <input type="number" step="0.01" value={formData.turbidity} onChange={(e) => setFormData({...formData, turbidity: e.target.value})} className="m-input" />
                </div>
                <div>
                  <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>Clorine</label>
                  <input type="number" step="0.001" value={formData.chlorine_level} onChange={(e) => setFormData({...formData, chlorine_level: e.target.value})} className="m-input" />
                </div>
                <div>
                  <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>Salama?</label>
                  <select value={formData.is_safe ? "true" : "false"} onChange={(e) => setFormData({...formData, is_safe: e.target.value === "true"})} className="m-select">
                    <option value="true">Ndiyo</option>
                    <option value="false">Hapana</option>
                  </select>
                </div>
                <div style={{ gridColumn: "span 1" }}>
                  <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>Maelezo</label>
                  <textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="m-textarea" rows="3" />
                </div>
              </div>
              <div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-m-outline flex-1" style={{ height: "44px", fontSize: "12px" }}>Ghairi</button>
                <button type="submit" className="btn-m-primary flex-1" style={{ height: "44px", fontSize: "12px" }}>Hifadhi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
