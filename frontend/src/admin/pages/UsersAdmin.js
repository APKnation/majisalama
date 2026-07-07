import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { getAllUsers, getAllVillages, createUser, updateUser, deleteUser } from "../utils/adminApi";

const ROLE_OPTIONS = [
  { value: "citizen", label: "Mwananchi" },
  { value: "village_leader", label: "Kiongozi wa Kijiji" },
  { value: "water_officer", label: "Wafanyakazi wa Maji" },
  { value: "district_officer", label: "Mfanyikazi wa Wilaya" },
  { value: "admin", label: "Msimamizi" },
];

export default function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "", email: "", first_name: "", last_name: "", phone: "", role: "citizen", village_id: "", password: ""
  });

  useEffect(() => {
    fetchUsers();
    fetchVillages();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data.results || response.data);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const fetchVillages = async () => {
    try {
      const response = await getAllVillages();
      setVillages(response.data.results || response.data);
    } catch (error) { console.error(error); }
  };

  const openEditModal = (u) => {
    setEditingUser(u);
    setFormData({
      username: u.username, email: u.email || "", first_name: u.first_name || "", last_name: u.last_name || "",
      phone: u.phone || "", role: u.role || "citizen", village_id: u.village?.id || "", password: ""
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) await updateUser(editingUser.id, formData);
      else await createUser(formData);
      setShowModal(false);
      setEditingUser(null);
      fetchUsers();
    } catch (error) { alert("Kuna hitilafu. Jaribu tena."); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Una uhakika unataka kufuta mtumiaji huyu?")) return;
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (error) { console.error(error); }
  };

  return (
    <AdminLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }} className="flex-col sm:flex-row gap-4 sm:gap-0 animate-fade-in-up">
        <div>
          <p style={{ color: "#0066b1", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "10px" }}>Usimamizi wa Akaunti</p>
          <h1 style={{ color: "#ffffff", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, textTransform: "uppercase", lineHeight: 1.05 }}>Watumiaji</h1>
        </div>
        <button
          onClick={() => {
            setEditingUser(null);
            setFormData({ username: "", email: "", first_name: "", last_name: "", phone: "", role: "citizen", village_id: "", password: "" });
            setShowModal(true);
          }}
          className="btn-m-primary"
          style={{ height: "40px", padding: "0 24px", fontSize: "12px" }}
        >
          ➕ Ongeza Mtumiaji
        </button>
      </div>

      <div style={{ border: "1px solid #3c3c3c", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #3c3c3c", background: "#0d0d0d" }}>
              {["Jina la mtumiaji", "Barua pepe", "Jina Kamili", "Kijiji", "Sehemu", "Kitendo"].map((h) => (
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
                  {[1,2,3,4,5,6].map(j => <td key={j} style={{ padding: "16px 20px" }}><div style={{ height: "12px", background: "#1a1a1a", width: "70%" }} /></td>)}
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: "48px 20px", textAlign: "center", color: "#7e7e7e", fontWeight: 300 }}>Hakuna watumiaji vilivyosajiliwa.</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} style={{ borderBottom: "1px solid #1a1a1a", transition: "background 0.12s" }} onMouseEnter={(e) => (e.currentTarget.style.background = "#0d0d0d")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td style={{ padding: "16px 20px", color: "#ffffff", fontSize: "14px", fontWeight: 700 }}>{u.username}</td>
                  <td style={{ padding: "16px 20px", color: "#bbbbbb", fontSize: "13px", fontWeight: 300 }}>{u.email || "—"}</td>
                  <td style={{ padding: "16px 20px", color: "#bbbbbb", fontSize: "13px", fontWeight: 300 }}>{u.first_name} {u.last_name}</td>
                  <td style={{ padding: "16px 20px", color: "#bbbbbb", fontSize: "13px", fontWeight: 300 }}>{u.village?.name || "—"}</td>
                  <td style={{ padding: "16px 20px", color: "#bbbbbb", fontSize: "13px", fontWeight: 300, textTransform: "capitalize" }}>{u.role.replace('_', ' ')}</td>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <button onClick={() => openEditModal(u)} style={{ color: "#0066b1", fontSize: "12px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", background: "transparent", cursor: "pointer" }}>Hariri</button>
                      <button onClick={() => handleDelete(u.id)} style={{ color: "#ffffff", fontSize: "12px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", background: "transparent", cursor: "pointer" }}>Futa</button>
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
            <h3 style={{ color: "#ffffff", fontSize: "20px", fontWeight: 700, textTransform: "uppercase", marginBottom: "24px" }}>{editingUser ? "Hariri Mtumiaji" : "Ongeza Mtumiaji"}</h3>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>Jina la mtumiaji</label>
                  <input type="text" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} required className="m-input" />
                </div>
                <div>
                  <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>Barua pepe</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="m-input" />
                </div>
                <div>
                  <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>Jina la kwanza</label>
                  <input type="text" value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} className="m-input" />
                </div>
                <div>
                  <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>Jina la mwisho</label>
                  <input type="text" value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} className="m-input" />
                </div>
                <div>
                  <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>Simu</label>
                  <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="m-input" />
                </div>
                <div>
                  <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>Sehemu</label>
                  <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="m-select">
                    {ROLE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
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
                  <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>Nenosiri</label>
                  <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="m-input" placeholder={editingUser ? "Acha wazi usipobadili" : ""} />
                </div>
              </div>
              <div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-m-outline flex-1" style={{ height: "44px", fontSize: "12px" }}>Ghairi</button>
                <button type="submit" className="btn-m-primary flex-1" style={{ height: "44px", fontSize: "12px" }}>{editingUser ? "Hifadhi" : "Ongeza"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
