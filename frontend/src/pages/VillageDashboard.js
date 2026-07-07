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
  const [stats, setStats] = useState({ totalSources: 0, safeSources: 0, pendingReports: 0, totalWorkers: 0, approvedReports: 0, resolvedReports: 0 });

  useEffect(() => { if (user?.village?.id) fetchData(); }, [user]);

  const fetchData = async () => {
    try {
      const [sRes, rRes, wRes] = await Promise.all([
        api.get(`/water-sources/?village=${user.village.id}`),
        api.get("/damage-reports/"),
        api.get(`/users/?village=${user.village.id}&role=water_officer`),
      ]);
      const s = sRes.data.results || sRes.data;
      const r = rRes.data.results || rRes.data;
      const w = wRes.data.results || wRes.data;
      setStats({
        totalSources:   s.length,
        safeSources:    s.filter(x => x.status === "safe").length,
        pendingReports: r.filter(x => x.status === "pending_village").length,
        totalWorkers:   w.length,
        approvedReports: r.filter(x => x.status === "village_approved").length,
        resolvedReports: r.filter(x => x.status === "resolved").length,
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

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: "#3c3c3c", marginBottom: "24px" }}>
          <StatCard label="Vyanzo Vyote"          value={stats.totalSources}    accent="#0066b1" />
          <StatCard label="Salama"                value={stats.safeSources}     accent="#0fa336" />
          <StatCard label="Wafanyakazi wa Maji"   value={stats.totalWorkers}    accent="#1c69d4" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px" style={{ background: "#3c3c3c", marginBottom: "40px" }}>
          <StatCard label="🔔 Zinasubiri Idhini Yako" value={stats.pendingReports}   accent="#f4b400" />
          <StatCard label="✅ Zilizoidhinishwa"        value={stats.approvedReports} accent="#9b59b6" />
          <StatCard label="🏁 Zimetatuliwa"            value={stats.resolvedReports} accent="#0fa336" />
        </div>

        {/* Quick Actions */}
        <p style={{ color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "16px" }}>Vitendo vya Haraka</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: "#3c3c3c" }}>
          {[
            { href: "/village-reports",     icon: "📋", title: "Angalia Ripoti",     desc: "Idhibitia au kataa ripoti" },
            { href: "/village-create",      icon: "✏️", title: "Anzisha Ripoti",     desc: "Tuma ripoti mpya ya uharibifu" },
            { href: "/village-sources",     icon: "💧", title: "Vyanzo vya Maji",   desc: "Simamia vyanzo vya kijiji" },
            { href: "/village-inspections", icon: "🔬", title: "Uchunguzi wa Ubora", desc: "Ingiza matokeo ya ukaguzi" },
          ].map(a => (
            <a key={a.href} href={a.href} style={{ background: "#0d0d0d", padding: "24px", textDecoration: "none", display: "block", transition: "background 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#1a1a1a")}
              onMouseLeave={e => (e.currentTarget.style.background = "#0d0d0d")}
            >
              <p style={{ fontSize: "28px", marginBottom: "12px" }}>{a.icon}</p>
              <p style={{ color: "#ffffff", fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>{a.title}</p>
              <p style={{ color: "#7e7e7e", fontSize: "12px", fontWeight: 300 }}>{a.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}