import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

export default function VillageUsers() {
  const { user } = useAuth();
  const [users, setUsers]         = useState([]);
  const [loading, setLoading]     = useState(true);


  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/users/?village=${user?.village?.id}`);
      setUsers(res.data.results || res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
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
        </div>


        {/* Users Table */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
            {[1,2,3,4].map(i => <div key={i} style={{ background: "#0d0d0d", height: "64px" }} />)}
          </div>
        ) : users.length === 0 ? (
          <div style={{ border: "1px solid #3c3c3c", padding: "64px 32px", textAlign: "center" }}>
            <p style={{ color: "#7e7e7e", fontWeight: 300, marginBottom: "8px" }}>Hakuna watumishi walioorodheshwa.</p>
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
