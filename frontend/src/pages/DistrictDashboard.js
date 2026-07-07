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

export default function DistrictDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalVillages: 0, totalSources: 0, safeSources: 0, pendingAssign: 0, inProgress: 0, resolved: 0 });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [sRes, rRes, vRes] = await Promise.all([
        api.get("/water-sources/"),
        api.get("/damage-reports/"),
        api.get("/villages/"),
      ]);
      const s = sRes.data.results || sRes.data;
      const r = rRes.data.results || rRes.data;
      const v = vRes.data.results || vRes.data;
      setStats({
        totalVillages:   v.length,
        totalSources:    s.length,
        safeSources:     s.filter(x => x.status === "safe").length,
        pendingAssign:   r.filter(x => x.status === "forwarded_to_district").length,
        inProgress:      r.filter(x => x.status === "in_progress").length,
        resolved:        r.filter(x => x.status === "resolved").length,
      });
    } catch (e) { console.error(e); }
  };

  return (
    <div style={{ background: "#000000", minHeight: "100vh", color: "#ffffff" }}>
      <div className="m-stripe" />
      <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "40px 32px" }}>
        <p style={{ color: "#0066b1", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "10px" }}>
          Mfanyakazi wa Wilaya
        </p>
        <h1 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 700, textTransform: "uppercase", marginBottom: "8px" }}>
          Karibu, {user?.username}
        </h1>
        <p style={{ color: "#bbbbbb", fontSize: "14px", fontWeight: 300, marginBottom: "40px" }}>Muhtasari wa hali ya wilaya nzima.</p>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: "#3c3c3c", marginBottom: "24px" }}>
          <StatCard label="Vijiji"              value={stats.totalVillages} accent="#0066b1" />
          <StatCard label="Vyanzo vya Maji"     value={stats.totalSources}  accent="#1c69d4" />
          <StatCard label="Salama"              value={stats.safeSources}   accent="#0fa336" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px" style={{ background: "#3c3c3c" }}>
          <StatCard label="🔔 Zinasubiri Kupangwa" value={stats.pendingAssign} accent="#9b59b6" />
          <StatCard label="🔧 Zinafanyiwa Kazi"     value={stats.inProgress}   accent="#f4b400" />
          <StatCard label="✅ Zimetatuliwa"          value={stats.resolved}     accent="#0fa336" />
        </div>
      </div>
    </div>
  );
}