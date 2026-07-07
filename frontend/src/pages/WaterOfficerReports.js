import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const STATUS_MAP = {
  pending_village:       { color: "#f4b400", bg: "#2a2200", label: "Inasubiri Idhini" },
  village_approved:      { color: "#1c69d4", bg: "#001a3e", label: "Imeidhinishwa ✓" },
  forwarded_to_district: { color: "#9b59b6", bg: "#1a0029", label: "Imetumwa Wilayani" },
  rejected:              { color: "#e74c3c", bg: "#2d0808", label: "Imekataliwa" },
  assigned:              { color: "#0066b1", bg: "#001a2e", label: "Imepewa Mfanyakazi" },
  in_progress:           { color: "#1c69d4", bg: "#001a3e", label: "Inafanywa Kazi" },
  resolved:              { color: "#0fa336", bg: "#012010", label: "Imetatuliwa" },
  closed:                { color: "#7e7e7e", bg: "#1a1a1a", label: "Imefungwa" },
};

function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || { color: "#7e7e7e", bg: "#1a1a1a", label: status };
  return (
    <span style={{
      display: "inline-block", padding: "3px 12px",
      background: s.bg, color: s.color,
      fontSize: "10px", fontWeight: 700, letterSpacing: "1px",
      textTransform: "uppercase", border: `1px solid ${s.color}44`,
    }}>
      {s.label}
    </span>
  );
}

export default function WaterOfficerReports() {
  const { user } = useAuth();
  const [reports, setReports]             = useState([]);
  const [loading, setLoading]             = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [filter, setFilter]               = useState("village_approved");

  useEffect(() => { fetchReports(); }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.get("/damage-reports/");
      setReports(res.data.results || res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleForward = async (report) => {
    setActionLoading(report.id + "_forward");
    try {
      await api.post(`/damage-reports/${report.id}/forward_to_district/`, {});
      fetchReports();
    } catch (e) {
      alert(e.response?.data?.error || "Hitilafu imekutokea.");
    } finally { setActionLoading(null); }
  };

  const handleStatus = async (id, action) => {
    setActionLoading(id + "_" + action);
    try {
      await api.post(`/damage-reports/${id}/${action}/`, {});
      fetchReports();
    } catch (e) { alert(e.response?.data?.error || "Hitilafu imekutokea."); }
    finally { setActionLoading(null); }
  };

  const FILTERS = [
    { key: "village_approved",      label: "Zinasubiri Kutumwa" },
    { key: "forwarded_to_district", label: "Zimetumwa Wilayani" },
    { key: "assigned",              label: "Zilizopewa Mfanyakazi" },
    { key: "in_progress",           label: "Zinafanyiwa Kazi" },
    { key: "resolved",              label: "Zimetatuliwa" },
    { key: "all",                   label: "Zote" },
  ];

  const filtered = filter === "all" ? reports : reports.filter(r => r.status === filter);

  return (
    <div style={{ background: "#000000", minHeight: "100vh", color: "#ffffff" }}>
      <div className="m-stripe" />
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 32px" }}>

        {/* Header */}
        <p style={{ color: "#0066b1", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "10px" }}>
          Afisa wa Maji
        </p>
        <h1 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 700, textTransform: "uppercase", marginBottom: "8px" }}>
          Ripoti za Kijiji
        </h1>
        <p style={{ color: "#bbbbbb", fontSize: "14px", fontWeight: 300, marginBottom: "32px" }}>
          Angalia ripoti zilizoidhinishwa na mwenyekiti na zitume kwa Ofisa wa Wilaya kwa ajili ya kupangwa wafanyakazi.
        </p>

        {/* Workflow Steps */}
        <div style={{ display: "flex", gap: "0", marginBottom: "40px", overflowX: "auto" }}>
          {[
            { step: "1", label: "Mwananchi Ripoti",    color: "#f4b400" },
            { step: "2", label: "Mwenyekiti Idhibitia", color: "#0066b1" },
            { step: "3", label: "Afisa wa Maji Tuma",   color: "#9b59b6", active: true },
            { step: "4", label: "Wilaya Panga Kazi",    color: "#1c69d4" },
            { step: "5", label: "Wafanyakazi Fanya",    color: "#0fa336" },
          ].map((s, i) => (
            <div key={s.step} style={{ display: "flex", alignItems: "center", minWidth: "180px" }}>
              <div style={{ textAlign: "center", flex: 1 }}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "50%", margin: "0 auto 8px",
                  background: s.active ? s.color : "transparent",
                  border: `2px solid ${s.color}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "13px", fontWeight: 700, color: s.active ? "#000" : s.color,
                }}>
                  {s.step}
                </div>
                <p style={{ fontSize: "10px", color: s.active ? s.color : "#7e7e7e", fontWeight: s.active ? 700 : 300 }}>
                  {s.label}
                </p>
              </div>
              {i < 4 && <div style={{ width: "32px", height: "1px", background: "#3c3c3c", flexShrink: 0 }} />}
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div style={{ display: "flex", gap: "4px", marginBottom: "24px", flexWrap: "wrap" }}>
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                padding: "6px 16px", fontSize: "11px", fontWeight: 700, letterSpacing: "1px",
                textTransform: "uppercase", border: "1px solid",
                borderColor: filter === f.key ? "#9b59b6" : "#3c3c3c",
                background: filter === f.key ? "#9b59b6" : "transparent",
                color: filter === f.key ? "#ffffff" : "#7e7e7e",
                cursor: "pointer", transition: "all 0.15s",
              }}
            >
              {f.label}
              {f.key !== "all" && (
                <span style={{ marginLeft: "6px", opacity: 0.7 }}>
                  ({reports.filter(r => r.status === f.key).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Reports List */}
        {loading ? (
          <div>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ background: "#0d0d0d", height: "120px", marginBottom: "1px" }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ border: "1px solid #3c3c3c", padding: "64px 48px", textAlign: "center" }}>
            <p style={{ color: "#7e7e7e", fontWeight: 300, marginBottom: "8px" }}>
              {filter === "village_approved" ? "Hakuna ripoti zinazosubiri kutumwa kwa wilaya." : "Hakuna ripoti zilizopatikana."}
            </p>
            <p style={{ color: "#3c3c3c", fontSize: "12px" }}>Ripoti zitaonekana baada ya mwenyekiti kuzidhibitia.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "#3c3c3c" }}>
            {filtered.map((r) => (
              <div
                key={r.id}
                style={{ background: "#0d0d0d", padding: "24px", transition: "background 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#111111")}
                onMouseLeave={e => (e.currentTarget.style.background = "#0d0d0d")}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: "200px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px", flexWrap: "wrap" }}>
                      <h2 style={{ color: "#ffffff", fontSize: "16px", fontWeight: 700 }}>{r.title}</h2>
                      <StatusBadge status={r.status} />
                    </div>
                    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "6px" }}>
                      <span style={{ color: "#7e7e7e", fontSize: "12px" }}>📍 {r.water_source?.name || "—"}</span>
                      <span style={{ color: "#7e7e7e", fontSize: "12px" }}>⚠️ {r.priority_display || r.priority}</span>
                      <span style={{ color: "#7e7e7e", fontSize: "12px" }}>👤 {r.reported_by?.username || "Mgeni"}</span>
                      {r.assigned_to && <span style={{ color: "#0066b1", fontSize: "12px" }}>🔧 Mfanyakazi: {r.assigned_to.username}</span>}
                    </div>
                    {r.description && (
                      <p style={{ color: "#bbbbbb", fontSize: "13px", fontWeight: 300 }}>{r.description}</p>
                    )}
                    {r.forwarded_by && (
                      <p style={{ color: "#9b59b6", fontSize: "12px", marginTop: "6px" }}>
                        📤 Imetumwa na: {r.forwarded_by.username}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", flexShrink: 0 }}>
                    {r.status === "village_approved" && (
                      <button
                        onClick={() => handleForward(r)}
                        disabled={actionLoading === r.id + "_forward"}
                        style={{
                          padding: "0 20px", height: "38px", fontSize: "11px", fontWeight: 700,
                          letterSpacing: "1px", textTransform: "uppercase",
                          background: "#9b59b6", color: "#ffffff", border: "none",
                          cursor: "pointer", opacity: actionLoading === r.id + "_forward" ? 0.6 : 1,
                          transition: "opacity 0.15s", whiteSpace: "nowrap",
                        }}
                      >
                        {actionLoading === r.id + "_forward" ? "Inatuma..." : "📤 Tuma kwa Wilaya"}
                      </button>
                    )}
                    {r.status === "assigned" && (
                      <button
                        onClick={() => handleStatus(r.id, "in_progress")}
                        disabled={actionLoading === r.id + "_in_progress"}
                        className="btn-m-outline"
                        style={{ height: "38px", padding: "0 20px", fontSize: "11px" }}
                      >
                        {actionLoading === r.id + "_in_progress" ? "..." : "Anza Kazi"}
                      </button>
                    )}
                    {r.status === "in_progress" && (
                      <button
                        onClick={() => handleStatus(r.id, "resolve")}
                        disabled={actionLoading === r.id + "_resolve"}
                        className="btn-m-primary"
                        style={{ height: "38px", padding: "0 20px", fontSize: "11px" }}
                      >
                        {actionLoading === r.id + "_resolve" ? "..." : "Kamilisha ✓"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
