import React, { useState, useEffect } from "react";
import api from "../utils/api";

export default function Notifications() {
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
          Kijiji chako
        </p>
        <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, textTransform: "uppercase", marginBottom: "8px" }}>
          Arifa
        </h1>
        <p style={{ color: "#bbbbbb", fontSize: "14px", fontWeight: 300, marginBottom: "32px" }}>
          Angalia arifa za maji ambazo zimekuja kwa kijiji chako.
        </p>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} style={{ background: "#0d0d0d", height: "90px", borderLeft: "2px solid #1a1a1a" }} />)}
          </div>
        ) : alerts.length === 0 ? (
          <div style={{ border: "1px solid #3c3c3c", padding: "48px", textAlign: "center", color: "#7e7e7e", fontWeight: 300 }}>
            Hakuna arifa mpya.
          </div>
        ) : (
          <div className="divide-y" style={{ borderTop: "1px solid #3c3c3c", borderBottom: "1px solid #3c3c3c" }}>
            {alerts.map((alert) => (
              <div
                key={alert.id}
                style={{ padding: "20px 0", transition: "background 0.15s", display: "flex", gap: "16px" }}
              >
                <div style={{ width: "2px", background: alert.is_read ? "#3c3c3c" : "#0066b1", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <p style={{ color: "#ffffff", fontSize: "14px", fontWeight: alert.is_read ? 400 : 700 }}>
                      {alert.alert_type_display}
                    </p>
                    <span style={{ color: "#7e7e7e", fontSize: "11px", fontWeight: 300 }}>
                      {new Date(alert.created_at).toLocaleString("sw-TZ")}
                    </span>
                  </div>
                  <p style={{ color: "#bbbbbb", fontSize: "14px", fontWeight: 300 }}>{alert.message}</p>
                  {alert.water_source?.name && (
                    <p style={{ color: "#7e7e7e", fontSize: "12px", marginTop: "4px", fontWeight: 300 }}>
                      Chanzo: {alert.water_source.name}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
