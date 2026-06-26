import React, { useState, useEffect } from "react";
import api from "../utils/api";

export default function VillageReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await api.get("/damage-reports/");
      setReports(response.data.results || response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Ripoti</h1>
        <p className="text-gray-600 mt-2">Tazama ripoti zote za kijiji chako.</p>
      </div>

      {loading ? (
        <div className="text-gray-600">Inapakia ripoti...</div>
      ) : reports.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-gray-600">
          Hakuna ripoti zilizopatikana.
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{report.title}</h2>
                  <p className="text-gray-600">{report.water_source?.name || 'Chanzo hakijulikani'}</p>
                </div>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 capitalize">
                  {report.status}
                </span>
              </div>
              <p className="mt-4 text-gray-700">{report.description}</p>
              <div className="mt-4 text-sm text-gray-500 flex flex-wrap gap-3">
                <span>Kipaumbele: {report.priority}</span>
                <span>Imepewa: {report.assigned_to?.username || 'Haijapewa'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
