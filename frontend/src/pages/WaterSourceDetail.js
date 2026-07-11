import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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

export default function WaterSourceDetail() {
  const { id } = useParams();
  const [source, setSource] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchSource(); }, [id]);

  const fetchSource = async () => {
    try {
      const response = await api.get(`/water-sources/${id}/`);
      setSource(response.data);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  if (loading) return <div style={{ background: "#000000", minHeight: "100vh", padding: "48px", color: "#7e7e7e", textAlign: "center" }}>Inapakia...</div>;
  if (!source) return <div style={{ background: "#000000", minHeight: "100vh", padding: "48px", color: "#7e7e7e", textAlign: "center" }}>Chanzo hakipatikani</div>;

  return (
    <div style={{ background: "#000000", minHeight: "100vh", color: "#ffffff" }}>
      <div className="m-stripe" />
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 32px" }}>
        <div style={{ marginBottom: "32px" }}>
          <Link to="/" style={{ color: "#0066b1", fontSize: "12px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", textDecoration: "none" }}>
            ← Rudi Mwanzo
          </Link>
        </div>

        <div style={{ background: "#0d0d0d", border: "1px solid #3c3c3c", display: "flex", flexDirection: "column", md: { flexDirection: "row" } }} className="animate-fade-in-up">
          {source.image && (
            <div style={{ borderBottom: "1px solid #3c3c3c", md: { borderRight: "1px solid #3c3c3c", borderBottom: "none" }, flexShrink: 0 }}>
              <img src={source.image} alt={source.name} style={{ width: "100%", md: { width: "400px" }, height: "100%", objectFit: "cover" }} />
            </div>
          )}

          <div style={{ padding: "48px", flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <p style={{ color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>Maelezo ya Chanzo</p>
                <h1 style={{ color: "#ffffff", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700, textTransform: "uppercase", lineHeight: 1.1 }}>{source.name}</h1>
              </div>
              <StatusBadge status={source.status} label={source.status_display} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "32px", marginBottom: "48px" }}>
              <div>
                <h3 style={{ color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "4px" }}>Aina</h3>
                <p style={{ color: "#ffffff", fontSize: "15px", fontWeight: 300 }}>{source.source_type_display}</p>
              </div>
              <div>
                <h3 style={{ color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "4px" }}>Kijiji</h3>
                <p style={{ color: "#ffffff", fontSize: "15px", fontWeight: 300 }}>{source.village?.name}</p>
              </div>
              <div>
                <h3 style={{ color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "4px" }}>pH</h3>
                <p style={{ color: "#ffffff", fontSize: "15px", fontWeight: 300 }}>{source.ph_level || "Haijapimwa"}</p>
              </div>
              <div>
                <h3 style={{ color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "4px" }}>Vimelea</h3>
                <p style={{ color: "#ffffff", fontSize: "15px", fontWeight: 300 }}>{source.bacteria_count ? `${source.bacteria_count} CFU/100ml` : "Haijapimwa"}</p>
              </div>
              <div>
                <h3 style={{ color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "4px" }}>Usafishaji Mwisho</h3>
                <p style={{ color: "#ffffff", fontSize: "15px", fontWeight: 300 }}>{source.last_cleaned ? new Date(source.last_cleaned).toLocaleDateString("sw-TZ") : "Haijarekodiwa"}</p>
              </div>
              <div>
                <h3 style={{ color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "4px" }}>Upimaji Mwisho</h3>
                <p style={{ color: "#ffffff", fontSize: "15px", fontWeight: 300 }}>{source.last_tested ? new Date(source.last_tested).toLocaleDateString("sw-TZ") : "Haijapimwa"}</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "16px", borderTop: "1px solid #1a1a1a", paddingTop: "32px" }}>
              <Link to="/report" style={{ display: "inline-block", background: "transparent", color: "#ffffff", border: "1px solid #ffffff", padding: "12px 24px", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", textDecoration: "none", transition: "background 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#2e0800" }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent" }}
              >
                Ripoti Uharibifu
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
