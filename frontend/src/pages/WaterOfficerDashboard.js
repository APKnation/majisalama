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

export default function WaterOfficerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ assignedReports: 0, inProgressReports: 0, completedReports: 0, totalSourcesManaged: 0 });

  useEffect(() => { fetchData(); }, [user]);

  const fetchData = async () => {
    try {
      const [rRes, sRes] = await Promise.all([
        api.get(`/damage-reports/?assigned_to=${user?.id}`),
        api.get("/water-sources/"),
      ]);
      const r = rRes.data.results || rRes.data;
      const s = sRes.data.results || sRes.data;
      setStats({
        assignedReports: r.length,
        inProgressReports: r.filter(x => x.status === "in_progress").length,
        completedReports: r.filter(x => x.status === "resolved").length,
        totalSourcesManaged: s.length,
      });
    } catch (e) { console.error(e); }
  };

  return (
    <div style={{ background: "#000000", minHeight: "100vh", color: "#ffffff" }}>
      <div className="m-stripe" />
      <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "40px 32px" }}>
        <p style={{ color: "#0066b1", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "10px" }}>
          Mfanyakazi wa Maji
        </p>
        <h1 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 700, textTransform: "uppercase", marginBottom: "8px" }}>
          Karibu, {user?.username}
        </h1>
        <p style={{ color: "#bbbbbb", fontSize: "14px", fontWeight: 300, marginBottom: "40px" }}>Hali ya kazi zako za sasa.</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: "#3c3c3c" }}>
          <StatCard label="Ripoti Zilizopewa" value={stats.assignedReports}    accent="#0066b1" />
          <StatCard label="Inafanywa Kazi"    value={stats.inProgressReports}  accent="#f4b400" />
          <StatCard label="Imetatuliwa"       value={stats.completedReports}   accent="#0fa336" />
          <StatCard label="Vyanzo vya Karibu" value={stats.totalSourcesManaged} accent="#1c69d4" />
        </div>
      </div>
    </div>
  );
}