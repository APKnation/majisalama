import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { getAllVillages, createVillage, updateVillage, deleteVillage } from "../utils/adminApi";

export default function VillagesAdmin() {
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVillage, setEditingVillage] = useState(null);
  const [formData, setFormData] = useState({ name: "", district: "", region: "", population: "", latitude: "", longitude: "" });

  useEffect(() => { fetchVillages(); }, []);

  const fetchVillages = async () => {
    try {
      const response = await getAllVillages();
      setVillages(response.data.results || response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (v) => {
    setEditingVillage(v);
    setFormData({ name: v.name, district: v.district, region: v.region, population: v.population || "", latitude: v.latitude || "", longitude: v.longitude || "" });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingVillage) await updateVillage(editingVillage.id, formData);
      else await createVillage(formData);
      setShowModal(false);
      setEditingVillage(null);
      fetchVillages();
    } catch (error) { alert("Kuna hitilafu. Jaribu tena."); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Una uhakika unataka kufuta kijiji hiki?")) return;
    try {
      await deleteVillage(id);
      fetchVillages();
    } catch (error) { console.error(error); }
  };

  return (
    <AdminLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }} className="flex-col sm:flex-row gap-4 sm:gap-0 animate-fade-in-up">
        <div>
          <p style={{ color: "#0066b1", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "10px" }}>Usimamizi wa Maeneo</p>
          <h1 style={{ color: "#ffffff", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, textTransform: "uppercase", lineHeight: 1.05 }}>Vijiji</h1>
        </div>
        <button
          onClick={() => {
            setEditingVillage(null);
            setFormData({ name: "", district: "", region: "", population: "", latitude: "", longitude: "" });
            setShowModal(true);
          }}
          className="btn-m-primary"
          style={{ height: "40px", padding: "0 24px", fontSize: "12px" }}
        >
          ➕ Ongeza Kijiji
        </button>
      </div>

      <div style={{ border: "1px solid #3c3c3c", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #3c3c3c", background: "#0d0d0d" }}>
              {["Jina", "Wilaya", "Mkoa", "Idadi ya watu", "Vitendo"].map((h) => (
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
                  {[1,2,3,4,5].map(j => <td key={j} style={{ padding: "16px 20px" }}><div style={{ height: "12px", background: "#1a1a1a", width: "70%" }} /></td>)}
                </tr>
              ))
            ) : villages.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: "48px 20px", textAlign: "center", color: "#7e7e7e", fontWeight: 300 }}>Hakuna vijiji vilivyosajiliwa.</td></tr>
            ) : (
              villages.map((v) => (
                <tr key={v.id} style={{ borderBottom: "1px solid #1a1a1a", transition: "background 0.12s" }} onMouseEnter={(e) => (e.currentTarget.style.background = "#0d0d0d")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td style={{ padding: "16px 20px", color: "#ffffff", fontSize: "14px", fontWeight: 700 }}>{v.name}</td>
                  <td style={{ padding: "16px 20px", color: "#bbbbbb", fontSize: "13px", fontWeight: 300 }}>{v.district}</td>
                  <td style={{ padding: "16px 20px", color: "#bbbbbb", fontSize: "13px", fontWeight: 300 }}>{v.region}</td>
                  <td style={{ padding: "16px 20px", color: "#bbbbbb", fontSize: "13px", fontWeight: 300 }}>{v.population || "—"}</td>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <button onClick={() => openEditModal(v)} style={{ color: "#0066b1", fontSize: "12px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", background: "transparent", cursor: "pointer" }}>Hariri</button>
                      <button onClick={() => handleDelete(v.id)} style={{ color: "#ffffff", fontSize: "12px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", background: "transparent", cursor: "pointer" }}>Futa</button>
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
            <h3 style={{ color: "#ffffff", fontSize: "20px", fontWeight: 700, textTransform: "uppercase", marginBottom: "24px" }}>{editingVillage ? "Hariri Kijiji" : "Ongeza Kijiji"}</h3>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>Jina</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="m-input" />
                </div>
                <div>
                  <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>Wilaya</label>
                  <input type="text" value={formData.district} onChange={(e) => setFormData({...formData, district: e.target.value})} className="m-input" />
                </div>
                <div>
                  <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>Mkoa</label>
                  <input type="text" value={formData.region} onChange={(e) => setFormData({...formData, region: e.target.value})} className="m-input" />
                </div>
                <div>
                  <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>Idadi ya watu</label>
                  <input type="number" value={formData.population} onChange={(e) => setFormData({...formData, population: e.target.value})} className="m-input" />
                </div>
                <div>
                  <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>Latitudo</label>
                  <input type="number" step="any" value={formData.latitude} onChange={(e) => setFormData({...formData, latitude: e.target.value})} className="m-input" />
                </div>
                <div>
                  <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>Longitudo</label>
                  <input type="number" step="any" value={formData.longitude} onChange={(e) => setFormData({...formData, longitude: e.target.value})} className="m-input" />
                </div>
              </div>
              <div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-m-outline flex-1" style={{ height: "44px", fontSize: "12px" }}>Ghairi</button>
                <button type="submit" className="btn-m-primary flex-1" style={{ height: "44px", fontSize: "12px" }}>{editingVillage ? "Hifadhi" : "Ongeza"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
