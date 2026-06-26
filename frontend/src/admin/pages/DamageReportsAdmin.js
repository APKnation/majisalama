import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { getAllDamageReports, assignDamageReport, resolveDamageReport, getAllUsers } from "../utils/adminApi";

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
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkers = async () => {
    try {
      const response = await getAllUsers();
      const allUsers = response.data.results || response.data;
      const officers = allUsers.filter((user) => user.role === "water_officer");
      setWorkers(officers);
    } catch (error) {
      console.error("Error fetching worker list:", error);
    }
  };

  const handleAssign = async (reportId) => {
    try {
      await assignDamageReport(reportId, { worker_id: assignWorkerId });
      setSelectedReport(null);
      setAssignWorkerId("");
      fetchReports();
    } catch (error) {
      console.error("Error assigning report:", error);
      alert("Kuna hitilafu wakati wa kupeana ripoti.");
    }
  };

  const handleResolve = async (reportId) => {
    try {
      await resolveDamageReport(reportId, { notes: resolutionNotes });
      setSelectedReport(null);
      setResolutionNotes("");
      fetchReports();
    } catch (error) {
      console.error("Error resolving report:", error);
      alert("Kuna hitilafu wakati wa kutatua ripoti.");
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Ripoti za Uharibifu</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chanzo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ripoti</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kipaumbele</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hali</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Imepewa</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vitendo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{report.water_source?.name}</td>
                <td className="px-6 py-4 text-gray-600">{report.title}</td>
                <td className="px-6 py-4 capitalize text-gray-600">{report.priority}</td>
                <td className="px-6 py-4 capitalize text-gray-600">{report.status}</td>
                <td className="px-6 py-4 text-gray-600">{report.assigned_to?.username || "-"}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Hariri
                    </button>
                    {report.status !== "resolved" && (
                      <button
                        onClick={() => handleResolve(report.id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        Tatua
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedReport && (
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Peana Ripoti kwa Msimamizi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chagua Msimamizi</label>
              <select
                value={assignWorkerId}
                onChange={(e) => setAssignWorkerId(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Chagua</option>
                {workers.map((worker) => (
                  <option key={worker.id} value={worker.id}>{worker.username}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Maoni ya utatuzi</label>
              <textarea
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                rows="3"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setSelectedReport(null)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Funga
            </button>
            {assignWorkerId && (
              <button
                onClick={() => handleAssign(selectedReport.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Peana
              </button>
            )}
            <button
              onClick={() => handleResolve(selectedReport.id)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Tatua
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
