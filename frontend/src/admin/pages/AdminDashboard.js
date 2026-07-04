// src/admin/pages/AdminDashboard.jsx — BMW M Design System

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { getAllWaterSources, getAllDamageReports, getAllQualityReports } from "../utils/adminApi";

// ── Status Badge ─────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    pending:     { label: "Inasubiri",   color: "#f4b400", bg: "#2a2200" },
    assigned:    { label: "Imepewa",     color: "#0066b1", bg: "#001a2e" },
    in_progress: { label: "Inafanywa",   color: "#1c69d4", bg: "#001a3e" },
    resolved:    { label: "Imetatuliwa", color: "#0fa336", bg: "#012010" },
    closed:      { label: "Imefungwa",   color: "#7e7e7e", bg: "#1a1a1a" },
    safe:        { label: "Salama",      color: "#0fa336", bg: "#012010" },
    unsafe:      { label: "Hatarini",    color: "#e22718", bg: "#2e0800" },
    caution:     { label: "Tahadhari",   color: "#f4b400", bg: "#2a2200" },
  };
  const s = map[status] || { label: status, color: "#7e7e7e", bg: "#1a1a1a" };
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        background: s.bg,
        color: s.color,
        fontSize: "10px",
        fontWeight: 700,
        letterSpacing: "1px",
        textTransform: "uppercase",
        border: `1px solid ${s.color}33`,
        whiteSpace: "nowrap",
      }}
    >
      {s.label}
    </span>
  );
}

// ── Stat Card ────────────────────────────────────────────────────────
function StatCard({ title, value, sub, accent, loading }) {
  return (
    <div
      style={{
        background: "#000000",
        borderTop: `2px solid ${accent}`,
        padding: "24px",
        transition: "background 0.15s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#0d0d0d")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "#000000")}
    >
      <p style={{ color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "16px" }}>
        {title}
      </p>
      {loading ? (
        <div style={{ height: "44px", width: "80px", background: "#1a1a1a" }} />
      ) : (
        <p style={{ color: "#ffffff", fontSize: "44px", fontWeight: 700, lineHeight: 1, marginBottom: "8px" }}>
          {value}
        </p>
      )}
      {sub && <p style={{ color: "#7e7e7e", fontSize: "12px", fontWeight: 300 }}>{sub}</p>}
    </div>
  );
}

// ── Quick Link Card ──────────────────────────────────────────────────
function QuickCard({ to, abbr, title, desc, accent }) {
  return (
    <Link
      to={to}
      style={{
        display: "block",
        background: "#000000",
        borderLeft: `2px solid ${accent}`,
        padding: "20px 24px",
        textDecoration: "none",
        transition: "background 0.15s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#0d0d0d")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "#000000")}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
        <div style={{
          width: "36px", height: "36px", flexShrink: 0,
          background: `${accent}18`, border: `1px solid ${accent}44`,
          color: accent,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "10px", fontWeight: 700, letterSpacing: "0.5px",
        }}>
          {abbr}
        </div>
        <div>
          <p style={{ color: "#ffffff", fontSize: "13px", fontWeight: 700, letterSpacing: "0.3px", marginBottom: "4px" }}>{title}</p>
          <p style={{ color: "#7e7e7e", fontSize: "12px", fontWeight: 300 }}>{desc}</p>
        </div>
      </div>
    </Link>
  );
}

// ── Main ─────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalSources: 0, safeSources: 0, cautionSources: 0, unsafeSources: 0,
    pendingReports: 0, totalReports: 0, totalQualityChecks: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [sRes, rRes, qRes] = await Promise.all([
        getAllWaterSources(),
        getAllDamageReports(),
        getAllQualityReports(),
      ]);
      const sources = sRes.data.results || sRes.data;
      const reports = rRes.data.results || rRes.data;
      const quality = qRes.data.results || qRes.data;

      setStats({
        totalSources:      sources.length,
        safeSources:       sources.filter((s) => s.status === "safe").length,
        cautionSources:    sources.filter((s) => s.status === "caution").length,
        unsafeSources:     sources.filter((s) => s.status === "unsafe").length,
        pendingReports:    reports.filter((r) => r.status === "pending").length,
        totalReports:      reports.length,
        totalQualityChecks: quality.length,
      });

      const activity = [
        ...reports.slice(0, 4).map((r) => ({
          id: `r${r.id}`, type: "report",
          message: r.title,
          sub: r.water_source?.name || "—",
          time: r.report_date,
          status: r.status,
        })),
        ...quality.slice(0, 3).map((q) => ({
          id: `q${q.id}`, type: "quality",
          message: `Upimaji: ${q.water_source?.name || "—"}`,
          sub: q.is_safe ? "Salama" : "Sio salama",
          time: q.test_date,
          status: q.is_safe ? "safe" : "unsafe",
        })),
      ]
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 6);

      setRecentActivity(activity);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      {/* ─── PAGE HEADER ─── */}
      <div style={{ marginBottom: "40px" }} className="animate-fade-in-up">
        <p style={{ color: "#0066b1", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "10px" }}>
          Msimamizi · Muhtasari wa Mfumo
        </p>
        <h1 style={{ color: "#ffffff", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, textTransform: "uppercase", lineHeight: 1.05 }}>
          Dashboard
        </h1>
      </div>

      {/* ─── PRIMARY STATS ─── */}
      <section style={{ marginBottom: "40px" }}>
        <p style={{ color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "16px" }}>
          Vyanzo vya Maji
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: "#3c3c3c" }}>
          <StatCard title="Jumla ya Vyanzo"  value={stats.totalSources}   accent="#0066b1" loading={loading} />
          <StatCard title="Vyanzo Salama"    value={stats.safeSources}    accent="#0fa336" loading={loading} sub={`${stats.totalSources > 0 ? Math.round((stats.safeSources / stats.totalSources) * 100) : 0}% ya jumla`} />
          <StatCard title="Tahadhari"        value={stats.cautionSources} accent="#f4b400" loading={loading} />
          <StatCard title="Hatarini"         value={stats.unsafeSources}  accent="#e22718" loading={loading} />
        </div>
      </section>

      <section style={{ marginBottom: "40px" }}>
        <p style={{ color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "16px" }}>
          Ripoti &amp; Ubora
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: "#3c3c3c" }}>
          <StatCard title="Ripoti Zote"       value={stats.totalReports}       accent="#1c69d4" loading={loading} />
          <StatCard title="Zinasubiri"        value={stats.pendingReports}     accent="#f4b400" loading={loading} />
          <StatCard title="Upimaji wa Ubora"  value={stats.totalQualityChecks} accent="#0066b1" loading={loading} />
        </div>
      </section>

      {/* ─── MAIN GRID: ACTIVITY + QUICK LINKS ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-px" style={{ background: "#3c3c3c" }}>

        {/* Recent Activity (2/3 width) */}
        <div style={{ background: "#000000", gridColumn: "span 2" }} className="lg:col-span-2">
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #3c3c3c" }}>
            <p style={{ color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase" }}>
              Shughuli za Hivi Karibuni
            </p>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #1a1a1a" }}>
                  {["Tukio", "Chanzo / Maelezo", "Hali", "Wakati"].map((h) => (
                    <th key={h} style={{
                      padding: "10px 16px", textAlign: "left",
                      color: "#7e7e7e", fontSize: "10px", fontWeight: 700,
                      letterSpacing: "1.5px", textTransform: "uppercase", whiteSpace: "nowrap",
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [1,2,3,4].map((i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #1a1a1a" }}>
                      {[1,2,3,4].map((j) => (
                        <td key={j} style={{ padding: "14px 16px" }}>
                          <div style={{ height: "10px", background: "#1a1a1a", width: "70%" }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : recentActivity.length > 0 ? (
                  recentActivity.map((item) => (
                    <tr
                      key={item.id}
                      style={{ borderBottom: "1px solid #0d0d0d", transition: "background 0.12s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#0d0d0d")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "13px 16px" }}>
                        <div
                          style={{
                            display: "inline-block",
                            padding: "2px 8px",
                            background: item.type === "report" ? "#001a2e" : "#001a3e",
                            color: item.type === "report" ? "#0066b1" : "#1c69d4",
                            fontSize: "9px",
                            fontWeight: 700,
                            letterSpacing: "1px",
                            textTransform: "uppercase",
                            marginBottom: "4px",
                          }}
                        >
                          {item.type === "report" ? "Ripoti" : "Ubora"}
                        </div>
                        <p style={{ color: "#e6e6e6", fontSize: "13px", fontWeight: 400 }}>{item.message}</p>
                      </td>
                      <td style={{ padding: "13px 16px", color: "#7e7e7e", fontSize: "12px", fontWeight: 300 }}>
                        {item.sub}
                      </td>
                      <td style={{ padding: "13px 16px" }}>
                        <StatusBadge status={item.status} />
                      </td>
                      <td style={{ padding: "13px 16px", color: "#7e7e7e", fontSize: "11px", fontWeight: 300, whiteSpace: "nowrap" }}>
                        {item.time ? new Date(item.time).toLocaleDateString("sw-TZ") : "—"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ padding: "40px 16px", textAlign: "center", color: "#7e7e7e", fontSize: "14px", fontWeight: 300 }}>
                      Hakuna shughuli mpya.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Links (1/3 width) */}
        <div style={{ background: "#000000" }} className="lg:col-span-1">
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #3c3c3c" }}>
            <p style={{ color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase" }}>
              Viungo vya Haraka
            </p>
          </div>
          <div className="divide-y" style={{ borderColor: "#1a1a1a" }}>
            {[
              { to: "/admin/water-sources", abbr: "VS", title: "Vyanzo vya Maji",    desc: "Simamia vyanzo vyote",           accent: "#0066b1" },
              { to: "/admin/reports",       abbr: "RP", title: "Ripoti za Uharibifu", desc: "Angalia na gawa kazi",           accent: "#e22718" },
              { to: "/admin/quality",       abbr: "QR", title: "Ripoti za Ubora",    desc: "Rekodi upimaji wa maji",         accent: "#0fa336" },
              { to: "/admin/users",         abbr: "WA", title: "Watumiaji",           desc: "Simamia akaunti za watumiaji",   accent: "#1c69d4" },
              { to: "/admin/alerts",        abbr: "AR", title: "Arifa",               desc: "Tuma arifa kwa wananchi",        accent: "#f4b400" },
              { to: "/admin/villages",      abbr: "VJ", title: "Vijiji",              desc: "Simamia vijiji na maeneo",       accent: "#7e7e7e" },
            ].map((card) => (
              <div key={card.to} style={{ borderBottom: "1px solid #1a1a1a" }}>
                <QuickCard {...card} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
