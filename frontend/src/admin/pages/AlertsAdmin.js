import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { getAllAlerts, getAllWaterSources, createAlert, updateAlert, deleteAlert } from "../utils/adminApi";

const ALERT_TYPES = [
  { value: "quality_drop", label: "Ubora Umeshuka" },
  { value: "source_dry", label: "Chanzo Kimekauka" },
  { value: "damage", label: "Uharibifu" },
  { value: "maintenance_due", label: "Usafishaji Umekaribia" },
  { value: "general", label: "Ujumbe Mkuu" },
];

function StatusBadge({ type, label }) {
  const map = {
    quality_drop:     { color: "#e22718", bg: "#2e0800" },
    source_dry:       { color: "#e22718", bg: "#2e0800" },
    damage:           { color: "#f4b400", bg: "#2a2200" },
    maintenance_due:  { color: "#1c69d4", bg: "#001a3e" },
    general:          { color: "#0fa336", bg: "#012010" },
  };
  const s = map[type] || { color: "#7e7e7e", bg: "#1a1a1a" };
  return (
    <span style={{ display: "inline-block", padding: "2px 10px", background: s.bg, color: s.color, fontSize: "10px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", border: `1px solid ${s.color}33` }}>
      {label}
    </span>
  );
}

export default function AlertsAdmin() {
  const [alerts, setAlerts] = useState([]);
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [formData, setFormData] = useState({ alert_type: "general", message: "", water_source_id: "" });

  useEffect(() => {
    fetchAlerts();
    fetchSources();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await getAllAlerts();
      setAlerts(response.data.results || response.data);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const fetchSources = async () => {
    try {
      const response = await getAllWaterSources();
      setSources(response.data.results || response.data);
    } catch (error) { console.error(error); }
  };

  const handleOpenModal = (alert = null) => {
    if (alert) {
      setSelectedAlert(alert);
      setFormData({ alert_type: alert.alert_type, message: alert.message, water_source_id: alert.water_source ? alert.water_source.id : "" });
    } else {
      setSelectedAlert(null);
      setFormData({ alert_type: "general", message: "", water_source_id: "" });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { alert_type: formData.alert_type, message: formData.message, water_source_id: formData.water_source_id || null };
      if (selectedAlert) await updateAlert(selectedAlert.id, payload);
      else await createAlert(payload);
      setShowModal(false);
      setFormData({ alert_type: "general", message: "", water_source_id: "" });
      setSelectedAlert(null);
      fetchAlerts();
    } catch (error) { alert("Kuna hitilafu. Jaribu tena."); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Je, una uhakika unataka kufuta arifa hii?")) {
      try {
        await deleteAlert(id);
        fetchAlerts();
      } catch (error) { alert("Kuna hitilafu wakati wa kufuta."); }
    }
  };

  return (
    <AdminLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }} className="flex-col sm:flex-row gap-4 sm:gap-0 animate-fade-in-up">
        <div>
          <p style={{ color: "#0066b1", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "10px" }}>Usimamizi</p>
          <h1 style={{ color: "#ffffff", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, textTransform: "uppercase", lineHeight: 1.05 }}>Arifa</h1>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-m-primary" style={{ height: "40px", padding: "0 24px", fontSize: "12px" }}>
          ➕ Tengeneza Arifa
        </button>
      </div>

      <div style={{ border: "1px solid #3c3c3c", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #3c3c3c", background: "#0d0d0d" }}>
              {["Aina", "Ujumbe", "Chanzo", "Tarehe", "Vitendo"].map((h) => (
                <th key={h} style={{ padding: "14px 20px", textAlign: "left", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [1,2,3].map(i => (
                <tr key={i} style={{ borderBottom: "1px solid #1a1a1a" }}>
                  {[1,2,3,4,5].map(j => <td key={j} style={{ padding: "16px 20px" }}><div style={{ height: "12px", background: "#1a1a1a", width: "70%" }} /></td>)}
                </tr>
              ))
            ) : alerts.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: "48px 20px", textAlign: "center", color: "#7e7e7e", fontWeight: 300 }}>Hakuna arifa.</td></tr>
            ) : (
              alerts.map((a) => (
                <tr key={a.id} style={{ borderBottom: "1px solid #1a1a1a", transition: "background 0.12s" }} onMouseEnter={(e) => (e.currentTarget.style.background = "#0d0d0d")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td style={{ padding: "16px 20px" }}>
                    <StatusBadge type={a.alert_type} label={ALERT_TYPES.find(t => t.value === a.alert_type)?.label || a.alert_type} />
                  </td>
                  <td style={{ padding: "16px 20px", color: "#bbbbbb", fontSize: "13px", fontWeight: 300, maxWidth: "300px" }} className="truncate">{a.message}</td>
                  <td style={{ padding: "16px 20px", color: "#ffffff", fontSize: "14px", fontWeight: 700 }}>{a.water_source?.name || "—"}</td>
                  <td style={{ padding: "16px 20px", color: "#7e7e7e", fontSize: "12px", fontWeight: 300, whiteSpace: "nowrap" }}>{new Date(a.created_at).toLocaleDateString("sw-TZ")}</td>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <button onClick={() => handleOpenModal(a)} style={{ color: "#0066b1", fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", background: "transparent", cursor: "pointer" }}>Badili</button>
                      <button onClick={() => handleDelete(a.id)} style={{ color: "#e22718", fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", background: "transparent", cursor: "pointer" }}>Futa</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "20px" }}>
          <div style={{ background: "#0d0d0d", border: "1px solid #3c3c3c", width: "100%", maxWidth: "600px", padding: "32px", maxHeight: "90vh", overflowY: "auto" }}>
            <h3 style={{ color: "#ffffff", fontSize: "20px", fontWeight: 700, textTransform: "uppercase", marginBottom: "24px" }}>{selectedAlert ? "Badili Arifa" : "Tengeneza Arifa"}</h3>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>Aina ya arifa</label>
                <select value={formData.alert_type} onChange={(e) => setFormData({...formData, alert_type: e.target.value})} className="m-select">
                  {ALERT_TYPES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>Ujumbe</label>
                <textarea value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="m-textarea" rows="4" required />
              </div>
              <div>
                <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>Chanzo cha maji</label>
                <select value={formData.water_source_id} onChange={(e) => setFormData({...formData, water_source_id: e.target.value})} className="m-select">
                  <option value="">Haijawekwa</option>
                  {sources.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-m-outline flex-1" style={{ height: "44px", fontSize: "12px" }}>Ghairi</button>
                <button type="submit" className="btn-m-primary flex-1" style={{ height: "44px", fontSize: "12px" }}>{selectedAlert ? "Hifadhi" : "Tuma"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
