import React, { useState, useEffect } from "react";
import api from "../utils/api";

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

export default function AssignTasks() {
  const [reports, setReports] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [assignWorkerId, setAssignWorkerId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReports();
    fetchWorkers();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await api.get("/damage-reports/?status=forwarded_to_district");
      setReports(response.data.results || response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const fetchWorkers = async () => {
    try {
      const response = await api.get("/users/?role=water_officer");
      setWorkers(response.data.results || response.data);
    } catch (error) {
      console.error("Error fetching workers:", error);
    }
  };

  const handleAssign = async () => {
    if (!selectedReport || !assignWorkerId) return;

    setLoading(true);
    try {
      await api.post(`/damage-reports/${selectedReport.id}/assign/`, {
        worker_id: assignWorkerId,
      });
      setSelectedReport(null);
      setAssignWorkerId("");
      fetchReports();
    } catch (error) {
      console.error("Error assigning report:", error);
      alert("Kuna hitilafu wakati wa kugawa ripoti.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#000000", minHeight: "100vh", color: "#ffffff" }}>
      <div className="m-stripe" />
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 32px" }}>
        <p style={{ color: "#0066b1", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "10px" }}>
          Usimamizi
        </p>
        <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, textTransform: "uppercase", marginBottom: "8px" }}>
          Tenga Kazi
        </h1>
        <p style={{ color: "#bbbbbb", fontSize: "14px", fontWeight: 300, marginBottom: "32px" }}>
          Chagua ripoti na ipe mfanyakazi anayefaa.
        </p>

        <div style={{ border: "1px solid #3c3c3c", overflowX: "auto", marginBottom: "32px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #3c3c3c", background: "#0d0d0d" }}>
                {["Chanzo", "Ripoti", "Kipaumbele", "Hali", "Uchague"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} onClick={() => setSelectedReport(report)} style={{ borderBottom: "1px solid #1a1a1a", cursor: "pointer", transition: "background 0.12s", background: selectedReport?.id === report.id ? "#1a1a1a" : "transparent" }}
                  onMouseEnter={(e) => { if(selectedReport?.id !== report.id) e.currentTarget.style.background = "#0d0d0d" }}
                  onMouseLeave={(e) => { if(selectedReport?.id !== report.id) e.currentTarget.style.background = "transparent" }}
                >
                  <td style={{ padding: "14px 16px", color: "#ffffff", fontSize: "14px", fontWeight: 700 }}>{report.water_source?.name}</td>
                  <td style={{ padding: "14px 16px", color: "#bbbbbb", fontSize: "13px", fontWeight: 300 }}>{report.title}</td>
                  <td style={{ padding: "14px 16px", color: "#bbbbbb", fontSize: "13px", fontWeight: 300, textTransform: "capitalize" }}>{report.priority}</td>
                  <td style={{ padding: "14px 16px" }}><StatusBadge status={report.status} /></td>
                  <td style={{ padding: "14px 16px", color: selectedReport?.id === report.id ? "#0066b1" : "#7e7e7e", fontSize: "12px", fontWeight: selectedReport?.id === report.id ? 700 : 300 }}>
                    {selectedReport?.id === report.id ? "Imechaguliwa" : "Gonga chagua"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedReport ? (
          <div style={{ background: "#0d0d0d", padding: "32px", border: "1px solid #3c3c3c" }} className="animate-fade-in-up">
            <h2 style={{ color: "#ffffff", fontSize: "20px", fontWeight: 700, textTransform: "uppercase", marginBottom: "16px" }}>Ripoti: {selectedReport.title}</h2>
            <p style={{ color: "#bbbbbb", fontSize: "14px", fontWeight: 300, marginBottom: "24px" }}>{selectedReport.description}</p>
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>Chagua mfanyakazi</label>
              <select
                value={assignWorkerId}
                onChange={(e) => setAssignWorkerId(e.target.value)}
                style={{ width: "100%", padding: "12px 16px", background: "#1a1a1a", border: "1px solid #3c3c3c", color: "#ffffff", fontSize: "14px", borderRadius: "0" }}
              >
                <option value="">Chagua mfanyakazi</option>
                {workers.map((worker) => (
                  <option key={worker.id} value={worker.id}>
                    {worker.username} ({worker.village?.name})
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <button onClick={() => setSelectedReport(null)} className="btn-m-outline" style={{ height: "40px", padding: "0 24px", fontSize: "12px" }}>
                Ghairi
              </button>
              <button onClick={handleAssign} disabled={!assignWorkerId || loading} className="btn-m-primary" style={{ height: "40px", padding: "0 24px", fontSize: "12px", opacity: (!assignWorkerId || loading) ? 0.5 : 1 }}>
                {loading ? "Inatuma..." : "Tuma Kazi"}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ border: "1px solid #3c3c3c", padding: "48px", textAlign: "center", color: "#7e7e7e", fontWeight: 300 }}>
            Chagua ripoti kutoka kwenye jedwali ili kuanza kugawa kazi.
          </div>
        )}
      </div>
    </div>
  );
}
