import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

export default function ExportReports() {
  const { user } = useAuth();
  const [reports, setReports]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo]     = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  useEffect(() => { fetchReports(); }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.get("/damage-reports/");
      setReports(res.data.results || res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  // Apply filters
  const filtered = reports.filter(r => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (priorityFilter !== "all" && r.priority !== priorityFilter) return false;
    if (dateFrom && new Date(r.report_date) < new Date(dateFrom)) return false;
    if (dateTo && new Date(r.report_date) > new Date(dateTo + "T23:59:59")) return false;
    return true;
  });

  // CSV export
  const exportCSV = () => {
    const headers = ["ID", "Kichwa", "Chanzo", "Kipaumbele", "Hali", "Mripoti", "Tarehe", "Maelezo"];
    const rows = filtered.map(r => [
      r.id,
      `"${r.title.replace(/"/g, '""')}"`,
      `"${(r.water_source?.name || "").replace(/"/g, '""')}"`,
      r.priority,
      r.status,
      `"${(r.reported_by?.username || "Mgeni").replace(/"/g, '""')}"`,
      new Date(r.report_date).toLocaleDateString("sw-TZ"),
      `"${(r.description || "").replace(/"/g, '""')}"`,
    ]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ripoti-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Print
  const handlePrint = () => window.print();

  const STATUS_LABELS = {
    pending_village: "Inasubiri Idhini", village_approved: "Imeidhinishwa",
    forwarded_to_district: "Wilayani", rejected: "Imekataliwa",
    assigned: "Imepewa", in_progress: "Inafanywa Kazi",
    resolved: "Imetatuliwa", closed: "Imefungwa", pending: "Inasubiri",
  };
  const PRIORITY_LABELS = { low: "Ndogo", medium: "Wastani", high: "Kubwa", critical: "Dharura" };
  const PRIORITY_COLORS = { low: "#7e7e7e", medium: "#0066b1", high: "#f4b400", critical: "#e74c3c" };

  return (
    <div style={{ background: "#000000", minHeight: "100vh", color: "#ffffff" }}>
      <div className="m-stripe" />
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 32px" }}>

        {/* Header */}
        <p style={{ color: "#0066b1", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "10px" }}>
          Kijiji · {user?.village?.name}
        </p>
        <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, textTransform: "uppercase", marginBottom: "8px" }}>
          Hamisha Ripoti
        </h1>
        <p style={{ color: "#bbbbbb", fontSize: "14px", fontWeight: 300, marginBottom: "32px" }}>
          Chuja ripoti na uzipakie kama CSV au uzichapishie.
        </p>

        {/* Filter Panel */}
        <div style={{ background: "#0d0d0d", border: "1px solid #3c3c3c", padding: "28px", marginBottom: "24px" }}>
          <p style={{ color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "18px" }}>
            Chuja
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "20px" }}>
            <div>
              <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>
                Tarehe Kuanzia
              </label>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", background: "#1a1a1a", border: "1px solid #3c3c3c", color: "#ffffff", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>
                Tarehe Hadi
              </label>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", background: "#1a1a1a", border: "1px solid #3c3c3c", color: "#ffffff", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>
                Hali
              </label>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", background: "#1a1a1a", border: "1px solid #3c3c3c", color: "#ffffff", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
              >
                <option value="all">Zote</option>
                {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>
                Kipaumbele
              </label>
              <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", background: "#1a1a1a", border: "1px solid #3c3c3c", color: "#ffffff", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
              >
                <option value="all">Zote</option>
                {Object.entries(PRIORITY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ color: "#7e7e7e", fontSize: "13px" }}>
              Ripoti zilizopatikana: <strong style={{ color: "#ffffff" }}>{filtered.length}</strong>
            </span>
            <button onClick={exportCSV} style={{ padding: "0 24px", height: "40px", background: "#0fa336", color: "#ffffff", border: "none", fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer" }}>
              ⬇ Pakua CSV
            </button>
            <button onClick={handlePrint} style={{ padding: "0 24px", height: "40px", background: "transparent", color: "#7e7e7e", border: "1px solid #3c3c3c", fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer" }}>
              🖨 Chapisha
            </button>
            {(dateFrom || dateTo || statusFilter !== "all" || priorityFilter !== "all") && (
              <button onClick={() => { setDateFrom(""); setDateTo(""); setStatusFilter("all"); setPriorityFilter("all"); }}
                style={{ padding: "0 16px", height: "40px", background: "transparent", color: "#e74c3c", border: "1px solid #e74c3c44", fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer" }}>
                ✕ Futa Vichujio
              </button>
            )}
          </div>
        </div>

        {/* Results Table */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
            {[1, 2, 3, 4].map(i => <div key={i} style={{ background: "#0d0d0d", height: "64px" }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ border: "1px solid #3c3c3c", padding: "64px 32px", textAlign: "center" }}>
            <p style={{ color: "#7e7e7e", fontWeight: 300 }}>Hakuna ripoti zinazolingana na vichujio vilivyochaguliwa.</p>
          </div>
        ) : (
          <div style={{ border: "1px solid #3c3c3c", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #3c3c3c", background: "#0d0d0d" }}>
                  {["#", "Kichwa", "Chanzo", "Kipaumbele", "Hali", "Mripoti", "Tarehe"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} style={{ borderBottom: "1px solid #1a1a1a", transition: "background 0.12s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#0d0d0d")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "12px 16px", color: "#3c3c3c", fontSize: "12px" }}>{r.id}</td>
                    <td style={{ padding: "12px 16px", color: "#ffffff", fontSize: "14px", fontWeight: 700 }}>{r.title}</td>
                    <td style={{ padding: "12px 16px", color: "#bbbbbb", fontSize: "13px", whiteSpace: "nowrap" }}>{r.water_source?.name || "—"}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ color: PRIORITY_COLORS[r.priority], fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
                        {PRIORITY_LABELS[r.priority] || r.priority}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ color: "#7e7e7e", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        {STATUS_LABELS[r.status] || r.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#7e7e7e", fontSize: "12px" }}>{r.reported_by?.username || "Mgeni"}</td>
                    <td style={{ padding: "12px 16px", color: "#7e7e7e", fontSize: "12px", whiteSpace: "nowrap" }}>
                      {new Date(r.report_date).toLocaleDateString("sw-TZ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
