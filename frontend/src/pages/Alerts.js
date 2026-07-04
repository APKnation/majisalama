import React, { useState, useEffect } from "react";
import api from "../utils/api";

const ALERT_COLORS = {
  quality_drop:    { color: "#e22718", bg: "#2e0800" },
  damage:          { color: "#f4b400", bg: "#2a2200" },
  maintenance_due: { color: "#1c69d4", bg: "#001a3e" },
  source_dry:      { color: "#7e7e7e", bg: "#1a1a1a" },
  general:         { color: "#0066b1", bg: "#001a2e" },
};

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAlerts(); }, []);

  const fetchAlerts = async () => {
    try {
      const r = await api.get("/alerts/");
      setAlerts(r.data.results || r.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#000000", minHeight: "100vh", color: "#ffffff" }}>
      <div className="m-stripe" />
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px" }}>
        <p style={{ color: "#0066b1", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "10px" }}>
          Mfumo wa Maji
        </p>
        <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, textTransform: "uppercase", marginBottom: "32px" }}>
          Arifa
        </h1>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} style={{ background: "#0d0d0d", height: "80px", borderLeft: "2px solid #1a1a1a" }} />
            ))}
          </div>
        ) : alerts.length === 0 ? (
          <div style={{ border: "1px solid #3c3c3c", padding: "48px", textAlign: "center", color: "#7e7e7e", fontWeight: 300 }}>
            Hakuna arifa mpya kwa sasa.
          </div>
        ) : (
          <div className="space-y-px" style={{ background: "#3c3c3c" }}>
            {alerts.map((alert) => {
              const c = ALERT_COLORS[alert.alert_type] || ALERT_COLORS.general;
              return (
                <div
                  key={alert.id}
                  style={{ background: "#0d0d0d", borderLeft: `2px solid ${c.color}`, padding: "20px 24px", transition: "background 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#1a1a1a")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#0d0d0d")}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", marginBottom: "8px" }}>
                    <span style={{ display: "inline-block", padding: "2px 10px", background: c.bg, color: c.color, fontSize: "10px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", border: `1px solid ${c.color}33` }}>
                      {alert.alert_type_display}
                    </span>
                    <span style={{ color: "#7e7e7e", fontSize: "11px", fontWeight: 300, whiteSpace: "nowrap" }}>
                      {new Date(alert.created_at).toLocaleDateString("sw-TZ")}
                    </span>
                  </div>
                  <p style={{ color: "#e6e6e6", fontSize: "14px", fontWeight: 300, lineHeight: 1.5 }}>{alert.message}</p>
                  {alert.water_source?.name && (
                    <p style={{ color: "#7e7e7e", fontSize: "12px", marginTop: "6px", fontWeight: 300 }}>
                      Chanzo: {alert.water_source.name}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
