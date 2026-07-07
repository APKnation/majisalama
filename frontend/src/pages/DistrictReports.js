import React, { useState, useEffect } from "react";
import api from "../utils/api";

const STATUS_MAP = {
  forwarded_to_district: { color: "#9b59b6", bg: "#1a0029", label: "Imetumwa Wilayani" },
  assigned:              { color: "#0066b1", bg: "#001a2e", label: "Imepewa Mfanyakazi" },
  in_progress:           { color: "#1c69d4", bg: "#001a3e", label: "Inafanywa Kazi" },
  resolved:              { color: "#0fa336", bg: "#012010", label: "Imetatuliwa" },
  closed:                { color: "#7e7e7e", bg: "#1a1a1a", label: "Imefungwa" },
};

const PRIORITY_COLOR = { critical: "#e74c3c", high: "#f4b400", medium: "#0066b1", low: "#7e7e7e" };

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

export default function DistrictReports() {
  const [reports, setReports]           = useState([]);
  const [workers, setWorkers]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [assignModal, setAssignModal]   = useState(null);
  const [workerId, setWorkerId]         = useState("");
  const [assigning, setAssigning]       = useState(false);
  const [filter, setFilter]             = useState("forwarded_to_district");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rRes, wRes] = await Promise.all([
        api.get("/damage-reports/"),
        api.get("/users/?role=water_officer"),
      ]);
      setReports(rRes.data.results || rRes.data);
      setWorkers(wRes.data.results || wRes.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const openAssign = (report) => {
    setWorkerId("");
    setAssignModal(report);
  };

  const handleAssign = async () => {
    if (!assignModal || !workerId) return;
    setAssigning(true);
    try {
      await api.post(`/damage-reports/${assignModal.id}/assign/`, { worker_id: workerId });
      setAssignModal(null);
      fetchData();
    } catch (e) {
      alert(e.response?.data?.error || "Hitilafu imekutokea.");
    } finally { setAssigning(false); }
  };

  const FILTERS = [
    { key: "forwarded_to_district", label: "Zinasubiri Kupangwa" },
    { key: "assigned",              label: "Zilizopewa Wafanyakazi" },
    { key: "in_progress",           label: "Zinafanyiwa Kazi" },
    { key: "resolved",              label: "Zimetatuliwa" },
    { key: "all",                   label: "Zote" },
  ];

  const filtered = filter === "all" ? reports : reports.filter(r => r.status === filter);
  const pendingCount = reports.filter(r => r.status === "forwarded_to_district").length;

  return (
    <div style={{ background: "#000000", minHeight: "100vh", color: "#ffffff" }}>
      <div className="m-stripe" />
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 32px" }}>

        {/* Header */}
        <p style={{ color: "#0066b1", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "10px" }}>
          Ofisa wa Wilaya
        </p>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", marginBottom: "8px", flexWrap: "wrap" }}>
          <h1 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 700, textTransform: "uppercase" }}>
            Ripoti za Wilaya
          </h1>
          {pendingCount > 0 && (
            <div style={{ background: "#9b59b6", color: "#fff", padding: "6px 18px", fontSize: "12px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", alignSelf: "center" }}>
              {pendingCount} Zinasubiri Kupangwa
            </div>
          )}
        </div>
        <p style={{ color: "#bbbbbb", fontSize: "14px", fontWeight: 300, marginBottom: "32px" }}>
          Ripoti zilizotumwa na Afisa wa Maji kutoka vijiji. Panga wafanyakazi (wafanyakazi wa maji) kufanya kazi.
        </p>

        {/* Workflow Steps */}
        <div style={{ display: "flex", gap: "0", marginBottom: "40px", overflowX: "auto" }}>
          {[
            { step: "1", label: "Mwananchi Ripoti",    color: "#f4b400" },
            { step: "2", label: "Mwenyekiti Idhibitia", color: "#0066b1" },
            { step: "3", label: "Afisa wa Maji Tuma",   color: "#9b59b6" },
            { step: "4", label: "Wilaya Panga Kazi",    color: "#1c69d4", active: true },
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
                borderColor: filter === f.key ? "#1c69d4" : "#3c3c3c",
                background: filter === f.key ? "#1c69d4" : "transparent",
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
              <div key={i} style={{ background: "#0d0d0d", height: "130px", marginBottom: "1px" }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ border: "1px solid #3c3c3c", padding: "64px 48px", textAlign: "center" }}>
            <p style={{ color: "#7e7e7e", fontWeight: 300, marginBottom: "8px" }}>Hakuna ripoti zilizopatikana.</p>
            <p style={{ color: "#3c3c3c", fontSize: "12px" }}>Ripoti zitaonekana baada ya Afisa wa Maji kuzituma.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "#3c3c3c" }}>
            {filtered.map((r) => (
              <div
                key={r.id}
                style={{ background: "#0d0d0d", padding: "28px 24px", transition: "background 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#111111")}
                onMouseLeave={e => (e.currentTarget.style.background = "#0d0d0d")}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "20px", flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: "200px" }}>
                    {/* Title + Badge */}
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px", flexWrap: "wrap" }}>
                      <h2 style={{ color: "#ffffff", fontSize: "16px", fontWeight: 700 }}>{r.title}</h2>
                      <StatusBadge status={r.status} />
                      <span style={{
                        padding: "2px 10px", fontSize: "10px", fontWeight: 700,
                        letterSpacing: "1px", textTransform: "uppercase",
                        color: PRIORITY_COLOR[r.priority] || "#7e7e7e",
                        border: `1px solid ${PRIORITY_COLOR[r.priority] || "#7e7e7e"}44`,
                      }}>
                        {r.priority_display || r.priority}
                      </span>
                    </div>

                    {/* Meta */}
                    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "8px" }}>
                      <span style={{ color: "#7e7e7e", fontSize: "12px" }}>📍 {r.water_source?.name || "—"}</span>
                      <span style={{ color: "#7e7e7e", fontSize: "12px" }}>🏘 {r.water_source?.village?.name || "—"}</span>
                      <span style={{ color: "#7e7e7e", fontSize: "12px" }}>👤 Mripoti: {r.reported_by?.username || "Mgeni"}</span>
                      <span style={{ color: "#7e7e7e", fontSize: "12px" }}>🗓 {new Date(r.report_date).toLocaleDateString("sw-TZ")}</span>
                    </div>

                    {r.description && (
                      <p style={{ color: "#bbbbbb", fontSize: "13px", fontWeight: 300, marginBottom: "6px" }}>{r.description}</p>
                    )}

                    {/* Tracking info */}
                    {r.forwarded_by && (
                      <p style={{ color: "#9b59b6", fontSize: "11px" }}>
                        📤 Imetumwa na Afisa wa Maji: {r.forwarded_by.username}
                      </p>
                    )}
                    {r.assigned_to && (
                      <p style={{ color: "#0066b1", fontSize: "11px", marginTop: "4px" }}>
                        🔧 Mfanyakazi Aliyepewa: <strong>{r.assigned_to.username}</strong>
                        {r.assigned_to.village?.name && ` (${r.assigned_to.village.name})`}
                      </p>
                    )}
                  </div>

                  {/* Assign Button */}
                  {r.status === "forwarded_to_district" && (
                    <button
                      onClick={() => openAssign(r)}
                      style={{
                        padding: "0 24px", height: "42px", fontSize: "11px", fontWeight: 700,
                        letterSpacing: "1px", textTransform: "uppercase",
                        background: "#1c69d4", color: "#ffffff", border: "none",
                        cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap",
                        transition: "opacity 0.15s",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
                      onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                    >
                      🔧 Panga Mfanyakazi
                    </button>
                  )}
                  {r.status === "assigned" && (
                    <button
                      onClick={() => openAssign(r)}
                      style={{
                        padding: "0 24px", height: "42px", fontSize: "11px", fontWeight: 700,
                        letterSpacing: "1px", textTransform: "uppercase",
                        background: "transparent", color: "#0066b1",
                        border: "1px solid #0066b144",
                        cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap",
                      }}
                    >
                      ↩ Badilisha Mfanyakazi
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assign Modal */}
      {assignModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: "20px",
        }}>
          <div style={{ background: "#0d0d0d", border: "1px solid #3c3c3c", padding: "40px", maxWidth: "520px", width: "100%" }}>
            <p style={{ color: "#1c69d4", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>
              Panga Mfanyakazi
            </p>
            <h2 style={{ color: "#ffffff", fontSize: "20px", fontWeight: 700, marginBottom: "6px" }}>
              {assignModal.title}
            </h2>
            <p style={{ color: "#7e7e7e", fontSize: "13px", marginBottom: "6px" }}>
              📍 {assignModal.water_source?.name} &nbsp;|&nbsp; 🏘 {assignModal.water_source?.village?.name}
            </p>
            {assignModal.description && (
              <p style={{ color: "#bbbbbb", fontSize: "13px", fontWeight: 300, marginBottom: "24px", borderLeft: "2px solid #3c3c3c", paddingLeft: "12px" }}>
                {assignModal.description}
              </p>
            )}

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>
                Chagua Mfanyakazi wa Maji
              </label>
              <select
                value={workerId}
                onChange={e => setWorkerId(e.target.value)}
                style={{
                  width: "100%", padding: "12px 16px", background: "#1a1a1a",
                  border: `1px solid ${workerId ? "#1c69d4" : "#3c3c3c"}`,
                  color: workerId ? "#ffffff" : "#7e7e7e", fontSize: "14px",
                  outline: "none", boxSizing: "border-box",
                }}
              >
                <option value="">— Chagua mfanyakazi —</option>
                {workers.map(w => (
                  <option key={w.id} value={w.id}>
                    {w.username} {w.first_name && `(${w.first_name} ${w.last_name})`} — {w.village?.name || "Kijiji hakijulikani"}
                  </option>
                ))}
              </select>
              {workers.length === 0 && (
                <p style={{ color: "#e74c3c", fontSize: "11px", marginTop: "6px" }}>
                  ⚠️ Hakuna wafanyakazi wa maji waliosajiliwa kwenye mfumo.
                </p>
              )}
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setAssignModal(null)}
                style={{
                  flex: 1, height: "44px", background: "transparent",
                  border: "1px solid #3c3c3c", color: "#7e7e7e",
                  fontSize: "12px", fontWeight: 700, cursor: "pointer",
                  textTransform: "uppercase", letterSpacing: "1px",
                }}
              >
                Ghairi
              </button>
              <button
                onClick={handleAssign}
                disabled={!workerId || assigning}
                style={{
                  flex: 2, height: "44px",
                  background: !workerId || assigning ? "#1a1a1a" : "#1c69d4",
                  border: "none", color: !workerId ? "#3c3c3c" : "#ffffff",
                  fontSize: "12px", fontWeight: 700, cursor: !workerId ? "not-allowed" : "pointer",
                  textTransform: "uppercase", letterSpacing: "1px",
                  transition: "all 0.15s",
                }}
              >
                {assigning ? "Inapanga..." : "🔧 Panga Mfanyakazi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
