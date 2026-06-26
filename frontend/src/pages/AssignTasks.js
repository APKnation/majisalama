import React, { useState, useEffect } from "react";
import api from "../utils/api";

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
      const response = await api.get("/damage-reports/?status=pending");
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
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Tenga Kazi</h1>
        <p className="text-gray-600 mt-2">Chagua ripoti na ipe mfanyakazi anayefaa.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-x-auto mb-8">
        <table className="w-full min-w-[900px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chanzo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ripoti</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kipaumbele</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hali</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uchague</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedReport(report)}>
                <td className="px-6 py-4 font-medium text-gray-900">{report.water_source?.name}</td>
                <td className="px-6 py-4 text-gray-600">{report.title}</td>
                <td className="px-6 py-4 capitalize text-gray-600">{report.priority}</td>
                <td className="px-6 py-4 capitalize text-gray-600">{report.status}</td>
                <td className="px-6 py-4">
                  {selectedReport?.id === report.id ? (
                    <span className="text-blue-600 font-semibold">Imechaguliwa</span>
                  ) : (
                    <span className="text-gray-500">Gonga chagua</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedReport ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Ripoti: {selectedReport.title}</h2>
          <p className="text-gray-600 mb-4">{selectedReport.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chagua mfanyakazi</label>
              <select
                value={assignWorkerId}
                onChange={(e) => setAssignWorkerId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="">Chagua mfanyakazi</option>
                {workers.map((worker) => (
                  <option key={worker.id} value={worker.id}>
                    {worker.username} ({worker.village?.name})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={() => setSelectedReport(null)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Ghairi
            </button>
            <button
              onClick={handleAssign}
              disabled={!assignWorkerId || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Inatuma..." : "Tuma Kazi"}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-gray-600">Chagua ripoti kutoka kwenye jedwali ili kuanza kugawa kazi.</div>
      )}
    </div>
  );
}
