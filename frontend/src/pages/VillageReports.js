import React, { useState, useEffect } from "react";
import api from "../utils/api";

const STATUS_MAP = {
  pending_village:       { color: "#f4b400", bg: "#2a2200", label: "Inasubiri Idhini" },
  village_approved:      { color: "#1c69d4", bg: "#001a3e", label: "Imeidhinishwa" },
  forwarded_to_district: { color: "#9b59b6", bg: "#1a0029", label: "Imetumwa Wilayani" },
  rejected:              { color: "#e74c3c", bg: "#2d0808", label: "Imekataliwa" },
  assigned:              { color: "#0066b1", bg: "#001a2e", label: "Imepewa Mfanyakazi" },
  in_progress:           { color: "#1c69d4", bg: "#001a3e", label: "Inafanywa Kazi" },
  resolved:              { color: "#0fa336", bg: "#012010", label: "Imetatuliwa" },
  closed:                { color: "#7e7e7e", bg: "#1a1a1a", label: "Imefungwa" },
  pending:               { color: "#f4b400", bg: "#2a2200", label: "Inasubiri" },
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

export default function VillageReports() {
  const [reports, setReports]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [rejectModal, setRejectModal] = useState(null); // report object or null
  const [rejectReason, setRejectReason]   = useState("");
  const [filter, setFilter]           = useState("all");

  useEffect(() => { fetchReports(); }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.get("/damage-reports/");
      setReports(res.data.results || res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleApprove = async (report) => {
    setActionLoading(report.id + "_approve");
    try {
      await api.post(`/damage-reports/${report.id}/village_approve/`, {});
      fetchReports();
    } catch (e) {
      alert(e.response?.data?.error || "Hitilafu imekutokea.");
    } finally { setActionLoading(null); }
  };

  const openRejectModal = (report) => {
    setRejectReason("");
    setRejectModal(report);
  };

  const handleReject = async () => {
    if (!rejectModal) return;
    setActionLoading(rejectModal.id + "_reject");
    try {
      await api.post(`/damage-reports/${rejectModal.id}/village_reject/`, { reason: rejectReason });
      setRejectModal(null);
      fetchReports();
    } catch (e) {
      alert(e.response?.data?.error || "Hitilafu imekutokea.");
    } finally { setActionLoading(null); }
  };

  const FILTERS = [
    { key: "all",             label: "Zote" },
    { key: "pending_village", label: "Zinasubiri Idhini" },
    { key: "village_approved",label: "Zilizoidhinishwa" },
    { key: "forwarded_to_district", label: "Wilayani" },
    { key: "rejected",        label: "Zilizokataliwa" },
    { key: "resolved",        label: "Zimetatuliwa" },
  ];

  const filtered = filter === "all" ? reports : reports.filter(r => r.status === filter);

  return (
    <div style={{ background: "#000000", minHeight: "100vh", color: "#ffffff" }}>
      <div className="m-stripe" />
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 32px" }}>

        {/* Header */}
        <p style={{ color: "#0066b1", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "10px" }}>
          Kijiji Chako
        </p>
        <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, textTransform: "uppercase", marginBottom: "8px" }}>
          Ripoti za Uharibifu
        </h1>
        <p style={{ color: "#bbbbbb", fontSize: "14px", fontWeight: 300, marginBottom: "32px" }}>
          Idhibitia au kataa ripoti za uharibifu kutoka kwa wananchi wa kijiji chako.
        </p>

        {/* Workflow Steps */}
        <div style={{ display: "flex", gap: "0", marginBottom: "40px", overflowX: "auto" }}>
          {[
            { step: "1", label: "Mwananchi Ripoti", color: "#f4b400" },
            { step: "2", label: "Mwenyekiti Idhibitia", color: "#0066b1", active: true },
            { step: "3", label: "Afisa wa Maji Tuma", color: "#9b59b6" },
            { step: "4", label: "Wilaya Panga Kazi", color: "#1c69d4" },
            { step: "5", label: "Wafanyakazi Fanya", color: "#0fa336" },
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
                <p style={{ fontSize: "10px", color: s.active ? s.color : "#7e7e7e", fontWeight: s.active ? 700 : 300, letterSpacing: "0.5px" }}>
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
                borderColor: filter === f.key ? "#0066b1" : "#3c3c3c",
                background: filter === f.key ? "#0066b1" : "transparent",
                color: filter === f.key ? "#ffffff" : "#7e7e7e",
                cursor: "pointer", transition: "all 0.15s",
              }}
            >
              {f.label}
              {f.key !== "all" && <span style={{ marginLeft: "6px", opacity: 0.7 }}>
                ({reports.filter(r => r.status === f.key).length})
              </span>}
            </button>
          ))}
        </div>

        {/* Reports List */}
        {loading ? (
          <div>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ background: "#0d0d0d", height: "120px", marginBottom: "1px", borderLeft: "2px solid #1a1a1a" }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ border: "1px solid #3c3c3c", padding: "64px 48px", textAlign: "center" }}>
            <p style={{ color: "#7e7e7e", fontWeight: 300, marginBottom: "8px" }}>Hakuna ripoti zilizopatikana.</p>
            <p style={{ color: "#3c3c3c", fontSize: "12px" }}>Ripoti zitaonekana hapa wananchi wakiwasilisha.</p>
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
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                      <h2 style={{ color: "#ffffff", fontSize: "16px", fontWeight: 700 }}>{r.title}</h2>
                      <StatusBadge status={r.status} />
                    </div>
                    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: r.description ? "10px" : 0 }}>
                      <span style={{ color: "#7e7e7e", fontSize: "12px" }}>📍 {r.water_source?.name || "—"}</span>
                      <span style={{ color: "#7e7e7e", fontSize: "12px" }}>⚠️ Kipaumbele: <span style={{ color: r.priority === "critical" ? "#e74c3c" : r.priority === "high" ? "#f4b400" : "#bbbbbb" }}>{r.priority_display || r.priority}</span></span>
                      <span style={{ color: "#7e7e7e", fontSize: "12px" }}>👤 Mripoti: {r.reported_by?.username || "Mgeni"}</span>
                      <span style={{ color: "#7e7e7e", fontSize: "12px" }}>🗓 {new Date(r.report_date).toLocaleDateString("sw-TZ")}</span>
                    </div>
                    {r.description && (
                      <p style={{ color: "#bbbbbb", fontSize: "13px", fontWeight: 300, marginTop: "6px" }}>{r.description}</p>
                    )}
                    {r.status === "rejected" && r.rejection_reason && (
                      <p style={{ color: "#e74c3c", fontSize: "12px", marginTop: "6px", fontStyle: "italic" }}>
                        Sababu ya kukataliwa: {r.rejection_reason}
                      </p>
                    )}
                    {r.status === "village_approved" && r.village_approved_by && (
                      <p style={{ color: "#1c69d4", fontSize: "12px", marginTop: "6px" }}>
                        ✅ Imeidhinishwa na: {r.village_approved_by.username}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {r.status === "pending_village" && (
                    <div style={{ display: "flex", gap: "10px", flexShrink: 0 }}>
                      <button
                        onClick={() => handleApprove(r)}
                        disabled={actionLoading === r.id + "_approve"}
                        style={{
                          padding: "0 20px", height: "38px", fontSize: "11px", fontWeight: 700,
                          letterSpacing: "1px", textTransform: "uppercase",
                          background: "#0fa336", color: "#ffffff", border: "none",
                          cursor: "pointer", opacity: actionLoading === r.id + "_approve" ? 0.6 : 1,
                          transition: "opacity 0.15s",
                        }}
                      >
                        {actionLoading === r.id + "_approve" ? "..." : "✓ Idhibitia"}
                      </button>
                      <button
                        onClick={() => openRejectModal(r)}
                        style={{
                          padding: "0 20px", height: "38px", fontSize: "11px", fontWeight: 700,
                          letterSpacing: "1px", textTransform: "uppercase",
                          background: "transparent", color: "#e74c3c",
                          border: "1px solid #e74c3c44",
                          cursor: "pointer", transition: "all 0.15s",
                        }}
                      >
                        ✕ Kataa
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: "20px",
        }}>
          <div style={{ background: "#0d0d0d", border: "1px solid #3c3c3c", padding: "40px", maxWidth: "500px", width: "100%" }}>
            <p style={{ color: "#e74c3c", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>
              Kataa Ripoti
            </p>
            <h2 style={{ color: "#ffffff", fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>
              {rejectModal.title}
            </h2>
            <p style={{ color: "#7e7e7e", fontSize: "13px", fontWeight: 300, marginBottom: "24px" }}>
              Una uhakika unataka kukataa ripoti hii? Toa sababu ili mwananchi aelewe.
            </p>
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>
                Sababu ya Kukataa (Hiari)
              </label>
              <textarea
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="Eleza kwa nini ripoti hii imekataliwa..."
                rows={3}
                style={{
                  width: "100%", padding: "12px", background: "#1a1a1a",
                  border: "1px solid #3c3c3c", color: "#ffffff", fontSize: "14px",
                  resize: "vertical", outline: "none", boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setRejectModal(null)}
                style={{
                  flex: 1, height: "42px", background: "transparent",
                  border: "1px solid #3c3c3c", color: "#7e7e7e",
                  fontSize: "12px", fontWeight: 700, cursor: "pointer",
                  textTransform: "uppercase", letterSpacing: "1px",
                }}
              >
                Ghairi
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading === rejectModal.id + "_reject"}
                style={{
                  flex: 1, height: "42px", background: "#e74c3c",
                  border: "none", color: "#ffffff",
                  fontSize: "12px", fontWeight: 700, cursor: "pointer",
                  textTransform: "uppercase", letterSpacing: "1px",
                  opacity: actionLoading === rejectModal.id + "_reject" ? 0.6 : 1,
                }}
              >
                {actionLoading === rejectModal.id + "_reject" ? "Inatuma..." : "Kataa Ripoti"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
