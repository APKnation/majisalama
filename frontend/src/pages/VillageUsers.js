import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

export default function VillageUsers() {
  const { user } = useAuth();
  const [users, setUsers]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState("");
  const [form, setForm]           = useState({
    username: "", first_name: "", last_name: "",
    email: "", phone: "", password: "", role: "citizen",
    village_id: user?.village?.id || "",
  });

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/users/?village=${user?.village?.id}`);
      setUsers(res.data.results || res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true); setError(""); setSuccess("");
    try {
      await api.post("/users/", { ...form, village_id: user?.village?.id });
      setSuccess("Mtumishi ameongezwa!");
      setShowForm(false);
      setForm({ username: "", first_name: "", last_name: "", email: "", phone: "", password: "", role: "citizen", village_id: user?.village?.id });
      fetchUsers();
    } catch (e) {
      setError(e.response?.data?.username?.[0] || e.response?.data?.detail || "Hitilafu. Jaribu tena.");
    } finally { setSaving(false); }
  };

  const ROLE_COLORS = {
    citizen:        { color: "#7e7e7e", label: "Mwananchi" },
    village_leader: { color: "#0066b1", label: "Kiongozi wa Kijiji" },
    water_officer:  { color: "#1c69d4", label: "Afisa wa Maji" },
    district_officer:{ color: "#9b59b6", label: "Ofisa wa Wilaya" },
    admin:          { color: "#e74c3c", label: "Msimamizi" },
  };

  const inputStyle = {
    width: "100%", padding: "12px 14px", background: "#1a1a1a",
    border: "1px solid #3c3c3c", color: "#ffffff", fontSize: "14px",
    outline: "none", boxSizing: "border-box",
  };
  const labelStyle = {
    display: "block", color: "#7e7e7e", fontSize: "10px",
    fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "7px",
  };

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
              Watumishi
            </h1>
            <p style={{ color: "#bbbbbb", fontSize: "14px", fontWeight: 300 }}>
              Simamia watumiaji wa kijiji chako — wananchi na wafanyakazi.
            </p>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setError(""); setSuccess(""); }}
            style={{
              padding: "0 24px", height: "42px", background: showForm ? "transparent" : "#0066b1",
              color: showForm ? "#7e7e7e" : "#ffffff", border: `1px solid ${showForm ? "#3c3c3c" : "#0066b1"}`,
              fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase",
              cursor: "pointer", transition: "all 0.15s",
            }}
          >
            {showForm ? "✕ Ghairi" : "+ Ongeza Mtumishi"}
          </button>
        </div>

        {/* Success */}
        {success && (
          <div style={{ background: "#012010", border: "1px solid #0fa336", padding: "14px 20px", marginBottom: "20px", color: "#0fa336", fontSize: "13px" }}>
            ✅ {success}
          </div>
        )}

        {/* Add User Form */}
        {showForm && (
          <form onSubmit={handleSubmit} style={{ background: "#0d0d0d", border: "1px solid #3c3c3c", padding: "32px", marginBottom: "32px" }}>
            <p style={{ color: "#ffffff", fontSize: "14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "24px" }}>
              Mtumishi Mpya
            </p>
            {error && (
              <div style={{ background: "#2d0808", border: "1px solid #e74c3c", padding: "12px 16px", marginBottom: "20px", color: "#e74c3c", fontSize: "13px" }}>
                ⚠️ {error}
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "18px", marginBottom: "18px" }}>
              <div>
                <label style={labelStyle}>Jina la Kwanza</label>
                <input name="first_name" value={form.first_name} onChange={handleChange} placeholder="Jina" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Jina la Ukoo</label>
                <input name="last_name" value={form.last_name} onChange={handleChange} placeholder="Ukoo" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Jina la Mtumiaji *</label>
                <input name="username" value={form.username} onChange={handleChange} required placeholder="username" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Nywila *</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Nywila" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Barua Pepe</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="barua@mfano.com" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Simu</label>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="+255..." style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Jukumu</label>
                <select name="role" value={form.role} onChange={handleChange} style={{ ...inputStyle, color: form.role !== "" ? "#ffffff" : "#7e7e7e" }}>
                  <option value="citizen">Mwananchi</option>
                  <option value="water_officer">Afisa wa Maji</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: "0 24px", height: "42px", background: "transparent", border: "1px solid #3c3c3c", color: "#7e7e7e", fontSize: "12px", fontWeight: 700, cursor: "pointer", textTransform: "uppercase", letterSpacing: "1px" }}>
                Ghairi
              </button>
              <button type="submit" disabled={saving} style={{ padding: "0 32px", height: "42px", background: saving ? "#1a1a1a" : "#0066b1", border: "none", color: "#ffffff", fontSize: "12px", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", textTransform: "uppercase", letterSpacing: "1px" }}>
                {saving ? "Inahifadhi..." : "Ongeza Mtumishi"}
              </button>
            </div>
          </form>
        )}

        {/* Users Table */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
            {[1,2,3,4].map(i => <div key={i} style={{ background: "#0d0d0d", height: "64px" }} />)}
          </div>
        ) : users.length === 0 ? (
          <div style={{ border: "1px solid #3c3c3c", padding: "64px 32px", textAlign: "center" }}>
            <p style={{ color: "#7e7e7e", fontWeight: 300, marginBottom: "8px" }}>Hakuna watumishi walioorodheshwa.</p>
            <p style={{ color: "#3c3c3c", fontSize: "12px" }}>Bonyeza "+ Ongeza Mtumishi" kuanza.</p>
          </div>
        ) : (
          <div style={{ border: "1px solid #3c3c3c", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #3c3c3c", background: "#0d0d0d" }}>
                  {["Mtumishi", "Barua Pepe", "Simu", "Jukumu", "Kijiji"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => {
                  const role = ROLE_COLORS[u.role] || ROLE_COLORS.citizen;
                  return (
                    <tr key={u.id} style={{ borderBottom: "1px solid #1a1a1a", transition: "background 0.12s" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#0d0d0d")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "14px 16px" }}>
                        <p style={{ color: "#ffffff", fontSize: "14px", fontWeight: 700 }}>{u.first_name} {u.last_name}</p>
                        <p style={{ color: "#7e7e7e", fontSize: "12px" }}>@{u.username}</p>
                      </td>
                      <td style={{ padding: "14px 16px", color: "#bbbbbb", fontSize: "13px", fontWeight: 300 }}>{u.email || "—"}</td>
                      <td style={{ padding: "14px 16px", color: "#bbbbbb", fontSize: "13px", fontWeight: 300 }}>{u.phone || "—"}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ color: role.color, fontSize: "10px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", border: `1px solid ${role.color}44`, padding: "2px 10px" }}>
                          {role.label}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", color: "#7e7e7e", fontSize: "12px", fontWeight: 300 }}>{u.village?.name || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <p style={{ color: "#3c3c3c", fontSize: "11px", marginTop: "12px" }}>
          Jumla ya watumishi: {users.length}
        </p>
      </div>
    </div>
  );
}
