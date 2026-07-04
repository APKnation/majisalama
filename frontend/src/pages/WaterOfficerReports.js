import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

function StatusBadge({ status, label }) {
  const map = {
    pending:     { color: "#f4b400", bg: "#2a2200" },
    assigned:    { color: "#0066b1", bg: "#001a2e" },
    in_progress: { color: "#1c69d4", bg: "#001a3e" },
    resolved:    { color: "#0fa336", bg: "#012010" },
    closed:      { color: "#7e7e7e", bg: "#1a1a1a" },
  };
  const s = map[status] || { color: "#7e7e7e", bg: "#1a1a1a" };
  return (
    <span style={{ display: "inline-block", padding: "2px 10px", background: s.bg, color: s.color, fontSize: "10px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", border: `1px solid ${s.color}33` }}>
      {label || status}
    </span>
  );
}

export default function WaterOfficerReports() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchReports(); }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const r = await api.get(`/damage-reports/?assigned_to=${user?.id}`);
      setReports(r.data.results || r.data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const updateStatus = async (id, action) => {
    try {
      await api.post(`/damage-reports/${id}/${action}/`, {});
      fetchReports();
    } catch (e) { alert("Hitilafu imekutokea."); }
  };

  return (
    <div style={{ background: "#000000", minHeight: "100vh", color: "#ffffff" }}>
      <div className="m-stripe" />
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 32px" }}>
        <p style={{ color: "#0066b1", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "10px" }}>Kazi Zangu</p>
        <h1 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 700, textTransform: "uppercase", marginBottom: "8px" }}>Ripoti Zangu</h1>
        <p style={{ color: "#bbbbbb", fontSize: "14px", fontWeight: 300, marginBottom: "32px" }}>Soma ripoti uliyopewa na tenda hatua kupitia mfumo.</p>

        {loading ? (
          <div className="space-y-2">
            {[1,2,3].map(i => <div key={i} style={{ background: "#0d0d0d", height: "120px", borderLeft: "2px solid #1a1a1a" }} />)}
          </div>
        ) : reports.length === 0 ? (
          <div style={{ border: "1px solid #3c3c3c", padding: "48px", textAlign: "center", color: "#7e7e7e", fontWeight: 300 }}>
            Hakuna ripoti zilizowekwa kwako.
          </div>
        ) : (
          <div className="space-y-px" style={{ background: "#3c3c3c" }}>
            {reports.map((r) => (
              <div key={r.id} style={{ background: "#0d0d0d", padding: "24px", display: "flex", flexDirection: "column", gap: "12px", transition: "background 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#1a1a1a")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#0d0d0d")}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" }}>
                  <div>
                    <h2 style={{ color: "#ffffff", fontSize: "16px", fontWeight: 700, marginBottom: "6px" }}>{r.title}</h2>
                    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                      <span style={{ color: "#7e7e7e", fontSize: "12px", fontWeight: 300 }}>Chanzo: {r.water_source?.name || "—"}</span>
                      <span style={{ color: "#7e7e7e", fontSize: "12px", fontWeight: 300 }}>Kipaumbele: {r.priority_display}</span>
                      <span style={{ color: "#7e7e7e", fontSize: "12px", fontWeight: 300 }}>Mripoti: {r.reported_by?.username}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                    <StatusBadge status={r.status} label={r.status_display} />
                    {r.status === "assigned" && (
                      <button onClick={() => updateStatus(r.id, "in_progress")} className="btn-m-outline" style={{ height: "34px", padding: "0 16px", fontSize: "11px" }}>Anza Kazi</button>
                    )}
                    {r.status === "in_progress" && (
                      <button onClick={() => updateStatus(r.id, "resolve")} className="btn-m-primary" style={{ height: "34px", padding: "0 16px", fontSize: "11px" }}>Kamilisha</button>
                    )}
                  </div>
                </div>
                {r.description && <p style={{ color: "#bbbbbb", fontSize: "14px", fontWeight: 300 }}>{r.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
