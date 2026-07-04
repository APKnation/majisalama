import React, { useState, useEffect } from "react";
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

export default function VillageReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchReports(); }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await api.get("/damage-reports/");
      setReports(response.data.results || response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#000000", minHeight: "100vh", color: "#ffffff" }}>
      <div className="m-stripe" />
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 32px" }}>
        <p style={{ color: "#0066b1", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "10px" }}>
          Kijiji Chako
        </p>
        <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, textTransform: "uppercase", marginBottom: "8px" }}>
          Ripoti
        </h1>
        <p style={{ color: "#bbbbbb", fontSize: "14px", fontWeight: 300, marginBottom: "32px" }}>
          Tazama ripoti zote za kijiji chako.
        </p>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => <div key={i} style={{ background: "#0d0d0d", height: "120px", borderLeft: "2px solid #1a1a1a" }} />)}
          </div>
        ) : reports.length === 0 ? (
          <div style={{ border: "1px solid #3c3c3c", padding: "48px", textAlign: "center", color: "#7e7e7e", fontWeight: 300 }}>
            Hakuna ripoti zilizopatikana.
          </div>
        ) : (
          <div className="space-y-px" style={{ background: "#3c3c3c" }}>
            {reports.map((report) => (
              <div key={report.id} style={{ background: "#0d0d0d", padding: "24px", display: "flex", flexDirection: "column", gap: "12px", transition: "background 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#1a1a1a")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#0d0d0d")}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" }}>
                  <div>
                    <h2 style={{ color: "#ffffff", fontSize: "16px", fontWeight: 700, marginBottom: "6px" }}>{report.title}</h2>
                    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                      <span style={{ color: "#7e7e7e", fontSize: "12px", fontWeight: 300 }}>Chanzo: {report.water_source?.name || 'Chanzo hakijulikani'}</span>
                      <span style={{ color: "#7e7e7e", fontSize: "12px", fontWeight: 300 }}>Kipaumbele: {report.priority}</span>
                      <span style={{ color: "#7e7e7e", fontSize: "12px", fontWeight: 300 }}>Imepewa: {report.assigned_to?.username || 'Haijapewa'}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                    <StatusBadge status={report.status} />
                  </div>
                </div>
                {report.description && <p style={{ color: "#bbbbbb", fontSize: "14px", fontWeight: 300 }}>{report.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
