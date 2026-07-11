import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

// ── BMW M Status badge ──────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    pending:     { label: "Inasubiri",  color: "#f4b400", bg: "#2a2200" },
    assigned:    { label: "Imepewa",    color: "#0066b1", bg: "#001a2e" },
    in_progress: { label: "Inafanywa",  color: "#1c69d4", bg: "#001a3e" },
    resolved:    { label: "Imetatuliwa",color: "#0fa336", bg: "#012010" },
    closed:      { label: "Imefungwa",  color: "#7e7e7e", bg: "#1a1a1a" },
    safe:        { label: "Salama",     color: "#0fa336", bg: "#012010" },
    unsafe:      { label: "Hatarini",   color: "#ffffff", bg: "#2e0800" },
    caution:     { label: "Tahadhari",  color: "#f4b400", bg: "#2a2200" },
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
      }}
    >
      {s.label}
    </span>
  );
}

// ── Stat card ───────────────────────────────────────────────────────
function StatCard({ title, value, accent, loading }) {
  return (
    <div
      style={{
        background: "#0d0d0d",
        borderTop: `2px solid ${accent}`,
        padding: "24px",
        transition: "background 0.15s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#1a1a1a")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "#0d0d0d")}
    >
      <p
        style={{
          color: "#7e7e7e",
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          marginBottom: "12px",
        }}
      >
        {title}
      </p>
      {loading ? (
        <div style={{ height: "40px", width: "80px", background: "#1a1a1a" }} />
      ) : (
        <p style={{ color: "#ffffff", fontSize: "40px", fontWeight: 700, lineHeight: 1 }}>
          {value}
        </p>
      )}
    </div>
  );
}

// ── Action card (role-based quick links) ────────────────────────────
function ActionCard({ to, abbr, title, desc, accent }) {
  return (
    <Link
      to={to}
      style={{
        display: "block",
        background: "#0d0d0d",
        borderLeft: `2px solid ${accent}`,
        padding: "20px 24px",
        textDecoration: "none",
        transition: "background 0.15s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#1a1a1a")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "#0d0d0d")}
    >
      <div className="flex items-start gap-4">
        <div
          style={{
            width: "36px",
            height: "36px",
            background: `${accent}22`,
            border: `1px solid ${accent}44`,
            color: accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.5px",
            flexShrink: 0,
          }}
        >
          {abbr}
        </div>
        <div>
          <p style={{ color: "#ffffff", fontSize: "14px", fontWeight: 700, marginBottom: "4px", letterSpacing: "0.3px" }}>
            {title}
          </p>
          <p style={{ color: "#7e7e7e", fontSize: "13px", fontWeight: 300 }}>{desc}</p>
        </div>
      </div>
    </Link>
  );
}

// ── Role-based actions ───────────────────────────────────────────────
function RoleActions({ role }) {
  const actions = {
    water_officer: [
      { to: "/reports?filter=assigned", abbr: "KZ", title: "Kazi Zangu",    desc: "Angalia ripoti ulizopangiwa",       accent: "#0066b1" },
      { to: "/quality/new",             abbr: "UP", title: "Weka Upimaji",  desc: "Rekodi matokeo mapya ya maji",      accent: "#0fa336" },
      { to: "/messages",                abbr: "UJ", title: "Soma Ujumbe",   desc: "Wasiliana na viongozi",             accent: "#1c69d4" },
    ],
    village_leader: [
      { to: "/reports",        abbr: "GW", title: "Gawa Kazi",       desc: "Pangia mafundi ripoti mpya",          accent: "#f4b400" },
      { to: "/water-sources",  abbr: "SV", title: "Simamia Vyanzo",  desc: "Tazama na rekebisha vyanzo",          accent: "#0066b1" },
      { to: "/messages",       abbr: "UJ", title: "Soma Ujumbe",     desc: "Wasiliana na mafundi na wilaya",      accent: "#1c69d4" },
    ],
    district_officer: [
      { to: "/reports",   abbr: "RW", title: "Ripoti za Wilaya",  desc: "Tazama hali ya wilaya nzima",         accent: "#1c69d4" },
      { to: "/villages",  abbr: "OV", title: "Orodha ya Vijiji",  desc: "Simamia vijiji na viongozi",          accent: "#0fa336" },
      { to: "/messages",  abbr: "UJ", title: "Soma Ujumbe",       desc: "Wasiliana na viongozi wa vijiji",     accent: "#0066b1" },
    ],
    citizen: [
      { to: "/reports/new",    abbr: "RU", title: "Ripoti Uharibifu",    desc: "Ripoti tatizo kwenye chanzo",    accent: "#ffffff" },
      { to: "/water-sources",  abbr: "VK", title: "Vyanzo Vya Karibu",   desc: "Tafuta vyanzo salama karibu nawe", accent: "#0066b1" },
      { to: "/messages",       abbr: "UJ", title: "Soma Ujumbe",         desc: "Wasiliana na kiongozi wako",     accent: "#1c69d4" },
    ],
  };

  const list = actions[role] || actions.citizen;

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-3 gap-px"
      style={{ background: "#3c3c3c" }}
    >
      {list.map((a) => (
        <ActionCard key={a.to} {...a} />
      ))}
    </div>
  );
}

// ── Main Dashboard ───────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalSources: 0, safeSources: 0, unsafeSources: 0, pendingReports: 0 });
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [sRes, rRes] = await Promise.all([api.get("/water-sources/"), api.get("/damage-reports/")]);
      const sources = sRes.data.results || sRes.data;
      const reports = rRes.data.results || rRes.data;
      setStats({
        totalSources:   sources.length,
        safeSources:    sources.filter((s) => s.status === "safe").length,
        unsafeSources:  sources.filter((s) => s.status === "unsafe").length,
        pendingReports: reports.filter((r) => r.status === "pending").length,
      });
      setRecentReports(reports.slice(0, 8));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const role = user?.role || "citizen";

  return (
    <div style={{ background: "#000000", minHeight: "100vh", color: "#ffffff" }}>
      {/* ─── M STRIPE ─── */}
      <div className="m-stripe" />

      {/* ─── TOP NAV ─── */}
      <nav
        style={{
          background: "#0d0d0d",
          borderBottom: "1px solid #3c3c3c",
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 32px",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div className="flex items-center gap-4">
          <div className="m-stripe" style={{ width: "28px", height: "3px" }} />
          <span style={{ color: "#ffffff", fontSize: "12px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase" }}>
            Maji Salama
          </span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/alerts" style={{ color: "#7e7e7e", fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase", textDecoration: "none" }}>
            Arifa
          </Link>
          <Link to="/messages" style={{ color: "#7e7e7e", fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase", textDecoration: "none" }}>
            Ujumbe
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "40px 32px" }}>

        {/* ─── HEADER ─── */}
        <div style={{ marginBottom: "48px" }} className="animate-fade-in-up">
          <p style={{ color: "#0066b1", fontSize: "11px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "12px" }}>
            {role.replace("_", " ")} · Dashibodi
          </p>
          <h1
            style={{ color: "#ffffff", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, textTransform: "uppercase", lineHeight: 1.05, marginBottom: "8px" }}
          >
            Karibu, {user?.first_name || user?.username}
          </h1>
        </div>

        {/* ─── STATS ROW ─── */}
        <section style={{ marginBottom: "48px" }}>
          <p style={{ color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "16px" }}>
            Muhtasari
          </p>
          <div
            className="grid grid-cols-2 lg:grid-cols-4 gap-px"
            style={{ background: "#3c3c3c" }}
          >
            <StatCard title="Jumla ya Vyanzo"  value={stats.totalSources}   accent="#0066b1" loading={loading} />
            <StatCard title="Vyanzo Salama"     value={stats.safeSources}    accent="#0fa336" loading={loading} />
            <StatCard title="Vyanzo Hatarini"   value={stats.unsafeSources}  accent="#ffffff" loading={loading} />
            <StatCard title="Ripoti (Subiri)"   value={stats.pendingReports} accent="#f4b400" loading={loading} />
          </div>
        </section>

        {/* ─── QUICK ACTIONS ─── */}
        <section style={{ marginBottom: "48px" }} className="animate-fade-in-up delay-100">
          <p style={{ color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "16px" }}>
            Vitendo vya Haraka
          </p>
          <RoleActions role={role} />
        </section>

        {/* ─── RECENT REPORTS TABLE ─── */}
        <section className="animate-fade-in-up delay-200">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <p style={{ color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase" }}>
              Ripoti za Hivi Karibuni
            </p>
            <Link
              to="/reports"
              style={{ color: "#0066b1", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", textDecoration: "none", fontWeight: 700 }}
            >
              Ona Zote →
            </Link>
          </div>

          {/* Table */}
          <div style={{ border: "1px solid #3c3c3c", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #3c3c3c", background: "#0d0d0d" }}>
                  {["Kichwa", "Chanzo", "Kipaumbele", "Hali", "Tarehe"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        color: "#7e7e7e",
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "1.5px",
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [1, 2, 3, 4].map((i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #262626" }}>
                      {[1, 2, 3, 4, 5].map((j) => (
                        <td key={j} style={{ padding: "14px 16px" }}>
                          <div style={{ height: "12px", background: "#1a1a1a", width: "80%" }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : recentReports.length > 0 ? (
                  recentReports.map((r, idx) => (
                    <tr
                      key={r.id}
                      style={{
                        borderBottom: "1px solid #1a1a1a",
                        background: "transparent",
                        transition: "background 0.12s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#0d0d0d")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "14px 16px", color: "#ffffff", fontSize: "14px", fontWeight: 400 }}>
                        {r.title}
                      </td>
                      <td style={{ padding: "14px 16px", color: "#bbbbbb", fontSize: "13px", fontWeight: 300 }}>
                        {r.water_source?.name || "—"}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <StatusBadge status={r.priority} />
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <StatusBadge status={r.status} />
                      </td>
                      <td style={{ padding: "14px 16px", color: "#7e7e7e", fontSize: "12px", fontWeight: 300, whiteSpace: "nowrap" }}>
                        {r.report_date ? new Date(r.report_date).toLocaleDateString("sw-TZ") : "—"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      style={{ padding: "48px 16px", textAlign: "center", color: "#7e7e7e", fontSize: "14px", fontWeight: 300 }}
                    >
                      Hakuna ripoti mpya kwa sasa.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
