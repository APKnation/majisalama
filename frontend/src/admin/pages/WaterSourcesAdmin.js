import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { getAllWaterSources, getAllVillages, createWaterSource, updateWaterSource, deleteWaterSource } from "../utils/adminApi";

function StatusBadge({ status, label }) {
  const map = {
    safe:         { color: "#0fa336", bg: "#012010" },
    caution:      { color: "#f4b400", bg: "#2a2200" },
    unsafe:       { color: "#e22718", bg: "#2e0800" },
    under_repair: { color: "#1c69d4", bg: "#001a3e" },
    dry:          { color: "#7e7e7e", bg: "#1a1a1a" },
  };
  const s = map[status] || { color: "#7e7e7e", bg: "#1a1a1a" };
  return (
    <span style={{ display: "inline-block", padding: "2px 10px", background: s.bg, color: s.color, fontSize: "10px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", border: `1px solid ${s.color}33` }}>
      {label || status}
    </span>
  );
}

export default function WaterSourcesAdmin() {
  const [sources, setSources] = useState([]);
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSource, setEditingSource] = useState(null);
  const [formData, setFormData] = useState({
    name: "", source_type: "shallow_well", village_id: "", latitude: "", longitude: "", status: "safe", ph_level: "", bacteria_count: "",
  });

  useEffect(() => {
    fetchSources();
    fetchVillages();
  }, []);

  const fetchSources = async () => {
    try {
      const response = await getAllWaterSources();
      setSources(response.data.results || response.data);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const fetchVillages = async () => {
    try {
      const response = await getAllVillages();
      setVillages(response.data.results || response.data);
    } catch (error) { console.error(error); }
  };

  const openEditModal = (s) => {
    setEditingSource(s);
    setFormData({
      name: s.name, source_type: s.source_type, village_id: s.village?.id || "",
      latitude: s.latitude || "", longitude: s.longitude || "", status: s.status,
      ph_level: s.ph_level || "", bacteria_count: s.bacteria_count || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSource) await updateWaterSource(editingSource.id, formData);
      else await createWaterSource(formData);
      setShowModal(false);
      setEditingSource(null);
      fetchSources();
    } catch (error) { alert("Kuna hitilafu. Jaribu tena."); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Una uhakika unataka kufuta chanzo hiki?")) return;
    try {
      await deleteWaterSource(id);
      fetchSources();
    } catch (error) { console.error(error); }
  };

  return (
    <AdminLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }} className="flex-col sm:flex-row gap-4 sm:gap-0 animate-fade-in-up">
        <div>
          <p style={{ color: "#0066b1", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "10px" }}>Usimamizi wa Maeneo</p>
          <h1 style={{ color: "#ffffff", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, textTransform: "uppercase", lineHeight: 1.05 }}>Vyanzo vya Maji</h1>
        </div>
        <button
          onClick={() => {
            setEditingSource(null);
            setFormData({ name: "", source_type: "shallow_well", village_id: "", latitude: "", longitude: "", status: "safe", ph_level: "", bacteria_count: "" });
            setShowModal(true);
          }}
          className="btn-m-primary"
          style={{ height: "40px", padding: "0 24px", fontSize: "12px" }}
        >
          ➕ Ongeza Chanzo
        </button>
      </div>

      <div style={{ border: "1px solid #3c3c3c", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #3c3c3c", background: "#0d0d0d" }}>
              {["Jina", "Aina", "Kijiji", "Hali", "pH", "Vimelea", "Vitendo"].map((h) => (
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
            ) : sources.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: "48px 20px", textAlign: "center", color: "#7e7e7e", fontWeight: 300 }}>Hakuna vyanzo vilivyosajiliwa.</td></tr>
            ) : (
              sources.map((s) => (
                <tr key={s.id} style={{ borderBottom: "1px solid #1a1a1a", transition: "background 0.12s" }} onMouseEnter={(e) => (e.currentTarget.style.background = "#0d0d0d")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td style={{ padding: "16px 20px", color: "#ffffff", fontSize: "14px", fontWeight: 700 }}>{s.name}</td>
                  <td style={{ padding: "16px 20px", color: "#bbbbbb", fontSize: "13px", fontWeight: 300 }}>{s.source_type_display}</td>
                  <td style={{ padding: "16px 20px", color: "#bbbbbb", fontSize: "13px", fontWeight: 300 }}>{s.village?.name || "—"}</td>
                  <td style={{ padding: "16px 20px" }}><StatusBadge status={s.status} label={s.status_display} /></td>
                  <td style={{ padding: "16px 20px", color: "#bbbbbb", fontSize: "13px", fontWeight: 300 }}>{s.ph_level || "—"}</td>
                  <td style={{ padding: "16px 20px", color: "#bbbbbb", fontSize: "13px", fontWeight: 300 }}>{s.bacteria_count || "—"}</td>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <button onClick={() => openEditModal(s)} style={{ color: "#0066b1", fontSize: "12px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", background: "transparent", cursor: "pointer" }}>Hariri</button>
                      <button onClick={() => handleDelete(s.id)} style={{ color: "#e22718", fontSize: "12px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", background: "transparent", cursor: "pointer" }}>Futa</button>
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
          <div style={{ background: "#0d0d0d", border: "1px solid #3c3c3c", width: "100%", maxWidth: "800px", padding: "32px", maxHeight: "90vh", overflowY: "auto" }}>
            <h3 style={{ color: "#ffffff", fontSize: "20px", fontWeight: 700, textTransform: "uppercase", marginBottom: "24px" }}>{editingSource ? "Hariri Chanzo" : "Ongeza Chanzo Kipya"}</h3>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>Jina</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="m-input" />
                </div>
                <div>
                  <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>Aina</label>
                  <select value={formData.source_type} onChange={(e) => setFormData({...formData, source_type: e.target.value})} className="m-select">
                    <option value="shallow_well">Kisima cha Juu</option>
                    <option value="deep_well">Kisima cha Kina</option>
                    <option value="spring">Chemchem</option>
                    <option value="river">Mto</option>
                    <option value="dam">Bwawa</option>
                    <option value="borehole">Bomba la Kuchimba</option>
                    <option value="rainwater">Maji ya Mvua</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>Kijiji</label>
                  <select value={formData.village_id} onChange={(e) => setFormData({...formData, village_id: e.target.value})} className="m-select">
                    <option value="">Chagua kijiji</option>
                    {villages.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>Hali</label>
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="m-select">
                    <option value="safe">Salama</option>
                    <option value="caution">Tahadhari</option>
                    <option value="unsafe">Hatarini</option>
                    <option value="under_repair">Inatengenezwa</option>
                    <option value="dry">Kavu</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>Latitudo</label>
                  <input type="number" step="any" value={formData.latitude} onChange={(e) => setFormData({...formData, latitude: e.target.value})} className="m-input" />
                </div>
                <div>
                  <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>Longitudo</label>
                  <input type="number" step="any" value={formData.longitude} onChange={(e) => setFormData({...formData, longitude: e.target.value})} className="m-input" />
                </div>
                <div>
                  <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>pH</label>
                  <input type="number" step="0.01" value={formData.ph_level} onChange={(e) => setFormData({...formData, ph_level: e.target.value})} className="m-input" />
                </div>
                <div>
                  <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>Vimelea (CFU/100ml)</label>
                  <input type="number" value={formData.bacteria_count} onChange={(e) => setFormData({...formData, bacteria_count: e.target.value})} className="m-input" />
                </div>
              </div>
              <div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-m-outline flex-1" style={{ height: "44px", fontSize: "12px" }}>Ghairi</button>
                <button type="submit" className="btn-m-primary flex-1" style={{ height: "44px", fontSize: "12px" }}>{editingSource ? "Hifadhi" : "Ongeza"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
