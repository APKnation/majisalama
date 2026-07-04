import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { getAllDamageReports, assignDamageReport, resolveDamageReport, getAllUsers } from "../utils/adminApi";

function StatusBadge({ status, label }) {
  const map = {
    pending:     { color: "#f4b400", bg: "#2a2200" },
    assigned:    { color: "#0066b1", bg: "#001a2e" },
    in_progress: { color: "#1c69d4", bg: "#001a3e" },
    resolved:    { color: "#0fa336", bg: "#012010" },
    closed:      { color: "#7e7e7e", bg: "#1a1a1a" },
  };
  const s = map[status] || { color: "#7e7e7e", bg: "#1a1a1a" };
  return (
    <span style={{ display: "inline-block", padding: "2px 10px", background: s.bg, color: s.color, fontSize: "10px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", border: `1px solid ${s.color}33` }}>
      {label || status}
    </span>
  );
}

export default function DamageReportsAdmin() {
  const [reports, setReports] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [assignWorkerId, setAssignWorkerId] = useState("");
  const [resolutionNotes, setResolutionNotes] = useState("");

  useEffect(() => {
    fetchReports();
    fetchWorkers();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await getAllDamageReports();
      setReports(response.data.results || response.data);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const fetchWorkers = async () => {
    try {
      const response = await getAllUsers();
      const allUsers = response.data.results || response.data;
      setWorkers(allUsers.filter((u) => u.role === "water_officer"));
    } catch (error) { console.error(error); }
  };

  const handleAssign = async (id) => {
    try {
      await assignDamageReport(id, { worker_id: assignWorkerId });
      setSelectedReport(null);
      setAssignWorkerId("");
      fetchReports();
    } catch (error) { alert("Kuna hitilafu wakati wa kupeana ripoti."); }
  };

  const handleResolve = async (id) => {
    try {
      await resolveDamageReport(id, { notes: resolutionNotes });
      setSelectedReport(null);
      setResolutionNotes("");
      fetchReports();
    } catch (error) { alert("Kuna hitilafu wakati wa kutatua ripoti."); }
  };

  return (
    <AdminLayout>
      <div style={{ marginBottom: "40px" }} className="animate-fade-in-up">
        <p style={{ color: "#0066b1", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "10px" }}>Usimamizi wa Shughuli</p>
        <h1 style={{ color: "#ffffff", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, textTransform: "uppercase", lineHeight: 1.05 }}>Ripoti za Uharibifu</h1>
      </div>

      <div style={{ border: "1px solid #3c3c3c", overflowX: "auto", marginBottom: "40px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #3c3c3c", background: "#0d0d0d" }}>
              {["Chanzo", "Ripoti", "Kipaumbele", "Hali", "Imepewa", "Vitendo"].map((h) => (
                <th key={h} style={{ padding: "14px 20px", textAlign: "left", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [1,2,3].map(i => (
                <tr key={i} style={{ borderBottom: "1px solid #1a1a1a" }}>
                  {[1,2,3,4,5,6].map(j => <td key={j} style={{ padding: "16px 20px" }}><div style={{ height: "12px", background: "#1a1a1a", width: "70%" }} /></td>)}
                </tr>
              ))
            ) : reports.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: "48px 20px", textAlign: "center", color: "#7e7e7e", fontWeight: 300 }}>Hakuna ripoti zilizosajiliwa.</td></tr>
            ) : (
              reports.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #1a1a1a", transition: "background 0.12s" }} onMouseEnter={(e) => (e.currentTarget.style.background = "#0d0d0d")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td style={{ padding: "16px 20px", color: "#ffffff", fontSize: "14px", fontWeight: 700 }}>{r.water_source?.name || "—"}</td>
                  <td style={{ padding: "16px 20px", color: "#bbbbbb", fontSize: "13px", fontWeight: 300 }}>{r.title}</td>
                  <td style={{ padding: "16px 20px", color: "#bbbbbb", fontSize: "13px", fontWeight: 300, textTransform: "capitalize" }}>{r.priority}</td>
                  <td style={{ padding: "16px 20px" }}><StatusBadge status={r.status} /></td>
                  <td style={{ padding: "16px 20px", color: "#bbbbbb", fontSize: "13px", fontWeight: 300 }}>{r.assigned_to?.username || "—"}</td>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", gap: "12px", flexDirection: "column" }}>
                      <button onClick={() => setSelectedReport(r)} style={{ color: "#0066b1", fontSize: "12px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", background: "transparent", cursor: "pointer", textAlign: "left" }}>Hariri</button>
                      {r.status !== "resolved" && (
                        <button onClick={() => handleResolve(r.id)} style={{ color: "#0fa336", fontSize: "12px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", background: "transparent", cursor: "pointer", textAlign: "left" }}>Tatua</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedReport && (
        <div style={{ background: "#0d0d0d", padding: "32px", border: "1px solid #3c3c3c", maxWidth: "800px" }} className="animate-fade-in-up">
          <h3 style={{ color: "#ffffff", fontSize: "20px", fontWeight: 700, textTransform: "uppercase", marginBottom: "24px" }}>Peana Ripoti kwa Msimamizi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>Chagua Msimamizi</label>
              <select value={assignWorkerId} onChange={(e) => setAssignWorkerId(e.target.value)} className="bmw-input">
                <option value="">Chagua</option>
                {workers.map(w => <option key={w.id} value={w.id}>{w.username}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>Maoni ya utatuzi</label>
              <textarea value={resolutionNotes} onChange={(e) => setResolutionNotes(e.target.value)} className="bmw-input" rows="3" />
            </div>
          </div>
          <div style={{ display: "flex", gap: "16px", marginTop: "24px" }}>
            <button onClick={() => setSelectedReport(null)} className="btn-m-outline flex-1" style={{ height: "44px", fontSize: "12px" }}>Funga</button>
            {assignWorkerId && <button onClick={() => handleAssign(selectedReport.id)} className="btn-m-primary flex-1" style={{ height: "44px", fontSize: "12px" }}>Peana</button>}
            <button onClick={() => handleResolve(selectedReport.id)} className="btn-m-primary flex-1" style={{ height: "44px", fontSize: "12px", background: "#0fa336", borderColor: "#0fa336" }}>Tatua</button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
