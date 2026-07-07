import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

function StatusBadge({ status, label }) {
  const map = {
    safe:         { color: "#0fa336", bg: "#012010" },
    caution:      { color: "#f4b400", bg: "#2a2200" },
    unsafe:       { color: "#ffffff", bg: "#2e0800" },
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

export default function WaterOfficerSources() {
  const { user } = useAuth();
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchSources(); }, [user]);

  const fetchSources = async () => {
    setLoading(true);
    try {
      const r = await api.get(`/water-sources/?managed_by=${user?.id}`);
      setSources(r.data.results || r.data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  return (
    <div style={{ background: "#000000", minHeight: "100vh", color: "#ffffff" }}>
      <div className="m-stripe" />
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 32px" }}>
        <p style={{ color: "#0066b1", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "10px" }}>Vyanzo Vilivyopewa</p>
        <h1 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 700, textTransform: "uppercase", marginBottom: "8px" }}>Vyanzo Vya Maji</h1>
        <p style={{ color: "#bbbbbb", fontSize: "14px", fontWeight: 300, marginBottom: "32px" }}>Tazama vyanzo vya maji unavyosimamia na tathmini hali zao.</p>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: "#3c3c3c" }}>
            {[1,2,3,4].map(i => <div key={i} style={{ background: "#0d0d0d", height: "120px" }} />)}
          </div>
        ) : sources.length === 0 ? (
          <div style={{ border: "1px solid #3c3c3c", padding: "48px", textAlign: "center", color: "#7e7e7e", fontWeight: 300 }}>Hakuna vyanzo vilivyopewa kwako.</div>
        ) : (
          <div style={{ border: "1px solid #3c3c3c", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #3c3c3c", background: "#0d0d0d" }}>
                  {["Jina", "Aina", "Hali", "Ukaguzi wa Mwisho", "Maji Safi"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sources.map(s => (
                  <tr key={s.id} style={{ borderBottom: "1px solid #1a1a1a", transition: "background 0.12s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#0d0d0d")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "14px 16px", color: "#ffffff", fontSize: "14px", fontWeight: 700 }}>{s.name}</td>
                    <td style={{ padding: "14px 16px", color: "#bbbbbb", fontSize: "13px", fontWeight: 300 }}>{s.source_type_display}</td>
                    <td style={{ padding: "14px 16px" }}><StatusBadge status={s.status} label={s.status_display} /></td>
                    <td style={{ padding: "14px 16px", color: "#7e7e7e", fontSize: "12px", fontWeight: 300, whiteSpace: "nowrap" }}>{s.last_tested ? new Date(s.last_tested).toLocaleDateString("sw-TZ") : "—"}</td>
                    <td style={{ padding: "14px 16px" }}>
                      {s.latest_quality ? (
                        <StatusBadge status={s.latest_quality.is_safe ? "safe" : "unsafe"} label={s.latest_quality.is_safe ? "Ndiyo" : "Hapana"} />
                      ) : <span style={{ color: "#7e7e7e", fontSize: "12px" }}>—</span>}
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
