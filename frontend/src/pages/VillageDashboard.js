import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

function StatCard({ label, value, accent }) {
  return (
    <div style={{ background: "#000000", borderTop: `2px solid ${accent}`, padding: "20px 24px" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#0d0d0d")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "#000000")}
    >
      <p style={{ color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "10px" }}>{label}</p>
      <p style={{ color: "#ffffff", fontSize: "36px", fontWeight: 700, lineHeight: 1 }}>{value}</p>
    </div>
  );
}

export default function VillageDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalSources: 0, safeSources: 0, pendingReports: 0, totalWorkers: 0 });

  useEffect(() => { if (user?.village?.id) fetchData(); }, [user]);

  const fetchData = async () => {
    try {
      const [sRes, rRes] = await Promise.all([
        api.get(`/water-sources/?village=${user.village.id}`),
        api.get("/damage-reports/"),
      ]);
      const s = sRes.data.results || sRes.data;
      const r = rRes.data.results || rRes.data;
      setStats({
        totalSources: s.length,
        safeSources: s.filter(x => x.status === "safe").length,
        pendingReports: r.filter(x => x.status === "pending").length,
        totalWorkers: 0,
      });
    } catch (e) { console.error(e); }
  };

  return (
    <div style={{ background: "#000000", minHeight: "100vh", color: "#ffffff" }}>
      <div className="m-stripe" />
      <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "40px 32px" }}>
        <p style={{ color: "#0066b1", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "10px" }}>
          Kiongozi wa Kijiji · {user?.village?.name}
        </p>
        <h1 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 700, textTransform: "uppercase", marginBottom: "8px" }}>
          Karibu, {user?.first_name || user?.username}
        </h1>
        <p style={{ color: "#bbbbbb", fontSize: "14px", fontWeight: 300, marginBottom: "40px" }}>Muhtasari wa hali ya kijiji chako.</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: "#3c3c3c" }}>
          <StatCard label="Vyanzo Vyote"        value={stats.totalSources}   accent="#0066b1" />
          <StatCard label="Salama"              value={stats.safeSources}    accent="#0fa336" />
          <StatCard label="Ripoti Zinazosubiri" value={stats.pendingReports} accent="#f4b400" />
          <StatCard label="Wafanyakazi"         value={stats.totalWorkers}   accent="#1c69d4" />
        </div>
      </div>
    </div>
  );
}