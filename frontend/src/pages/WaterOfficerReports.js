import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

export default function WaterOfficerReports() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/damage-reports/?assigned_to=${user?.id}`);
      setReports(response.data.results || response.data);
    } catch (error) {
      console.error("Error fetching assigned reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (reportId, nextStatus) => {
    try {
      await api.post(`/damage-reports/${reportId}/${nextStatus}/`, {});
      fetchReports();
    } catch (error) {
      console.error("Error updating report status:", error);
      alert("Hakuna ruhusa au hitilafu imekutokea.");
    }
  };

  const getNextAction = (status) => {
    if (status === "assigned") return "in_progress";
    if (status === "in_progress") return "resolve";
    return null;
  };

  const getActionLabel = (status) => {
    if (status === "assigned") return "Anza Kazi";
    if (status === "in_progress") return "Kamilisha Kazi";
    return "";
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Ripoti Zangu</h1>
        <p className="text-gray-600">Soma ripoti uliyopewa na tenda hatua kupitia mfumo.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        {loading ? (
          <p className="text-gray-600">Inapakia ripoti...</p>
        ) : reports.length === 0 ? (
          <p className="text-gray-600">Hakuna ripoti zilizowekwa kwako.</p>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{report.title}</h2>
                    <p className="text-sm text-gray-600 mt-1">Chanzo: {report.water_source?.name}</p>
                    <p className="text-sm text-gray-500">Hali: {report.status_display}</p>
                    <p className="text-sm text-gray-500">Kipaumbele: {report.priority_display}</p>
                    <p className="text-sm text-gray-500">Ripoti kutoka: {report.reported_by?.username}</p>
                  </div>
                  <div className="flex flex-col gap-3 items-start md:items-end">
                    {getNextAction(report.status) && (
                      <button
                        onClick={() => updateStatus(report.id, getNextAction(report.status))}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        {getActionLabel(report.status)}
                      </button>
                    )}
                    {report.status === "resolved" && (
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">Kamilika</span>
                    )}
                  </div>
                </div>
                <p className="mt-4 text-gray-700">{report.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
