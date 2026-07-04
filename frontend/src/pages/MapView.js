import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import api from "../utils/api";

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

export default function MapView() {
  const [waterSources, setWaterSources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWaterSources();
  }, []);

  const fetchWaterSources = async () => {
    try {
      const response = await api.get("/water-sources/");
      setWaterSources(response.data.results || response.data);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#000000", color: "#ffffff", overflow: "hidden" }}>
      <div style={{ width: "380px", borderRight: "1px solid #3c3c3c", display: "flex", flexDirection: "column", background: "#0d0d0d" }}>
        <div style={{ padding: "32px 24px", borderBottom: "1px solid #3c3c3c" }}>
          <p style={{ color: "#0066b1", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>Ramani</p>
          <h1 style={{ fontSize: "24px", fontWeight: 700, textTransform: "uppercase" }}>Vyanzo vya Maji</h1>
          <p style={{ color: "#7e7e7e", fontSize: "12px", marginTop: "4px" }}>Angalia vyanzo vilivyo karibu.</p>
        </div>
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
          {loading ? (
            <div style={{ padding: "24px", color: "#7e7e7e" }}>Inapakia...</div>
          ) : waterSources.length === 0 ? (
            <div style={{ padding: "24px", color: "#7e7e7e" }}>Hakuna vyanzo vilivyopatikana.</div>
          ) : (
            waterSources.map((source) => (
              <div key={source.id} style={{ padding: "20px 24px", borderBottom: "1px solid #1a1a1a", transition: "background 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#1a1a1a")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div>
                    <h3 style={{ color: "#ffffff", fontSize: "15px", fontWeight: 700, textTransform: "uppercase" }}>{source.name}</h3>
                    <p style={{ color: "#7e7e7e", fontSize: "12px" }}>{source.village?.name}</p>
                  </div>
                  <StatusBadge status={source.status} label={source.status_display} />
                </div>
                <Link to={`/source/${source.id}`} style={{ color: "#0066b1", fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", textDecoration: "none", display: "inline-block" }}>
                  Angalia Zaidi →
                </Link>
              </div>
            ))
          )}
        </div>
      </div>

      <div style={{ flex: 1, position: "relative" }}>
        <MapContainer center={[-6.8, 39.28]} zoom={12} style={{ height: "100%", width: "100%", zIndex: 1 }}>
          <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {waterSources.map(
            (source) =>
              source.latitude && source.longitude && (
                <Marker key={source.id} position={[source.latitude, source.longitude]}>
                  <Popup>
                    <div style={{ minWidth: "160px" }}>
                      <h3 style={{ fontWeight: "bold", fontSize: "14px", marginBottom: "8px" }}>{source.name}</h3>
                      <div style={{ marginBottom: "12px" }}>
                        <span style={{ fontSize: "11px", color: "#666" }}>{source.status_display}</span>
                      </div>
                      <Link to={`/source/${source.id}`} style={{ display: "block", textAlign: "center", background: "#0066b1", color: "#fff", padding: "6px 12px", borderRadius: "4px", fontSize: "12px", textDecoration: "none" }}>
                        Angalia Maelezo
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              )
          )}
        </MapContainer>
      </div>
    </div>
  );
}
