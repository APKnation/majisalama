import React, { useState, useEffect } from "react";
import api from "../utils/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalSources: 0,
    safeSources: 0,
    unsafeSources: 0,
    pendingReports: 0,
  });
  const [recentReports, setRecentReports] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const sourcesRes = await api.get("/water-sources/");
      const reportsRes = await api.get("/damage-reports/");

      const sources = sourcesRes.data.results || sourcesRes.data;
      const reports = reportsRes.data.results || reportsRes.data;

      setStats({
        totalSources: sources.length,
        safeSources: sources.filter((s) => s.status === "safe").length,
        unsafeSources: sources.filter((s) => s.status === "unsafe").length,
        pendingReports: reports.filter((r) => r.status === "pending").length,
      });

      setRecentReports(reports.slice(0, 5));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <p className="text-sm text-gray-600">Jumla ya Vyanzo</p>
          <p className="text-3xl font-bold text-gray-900">
            {stats.totalSources}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <p className="text-sm text-gray-600">Vyanzo Salama</p>
          <p className="text-3xl font-bold text-green-600">
            {stats.safeSources}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <p className="text-sm text-gray-600">Vyanzo Hatarini</p>
          <p className="text-3xl font-bold text-red-600">
            {stats.unsafeSources}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <p className="text-sm text-gray-600">Ripoti Zinazosubiri</p>
          <p className="text-3xl font-bold text-yellow-600">
            {stats.pendingReports}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Ripoti za Hivi Karibuni</h2>
        </div>
        <div className="divide-y">
          {recentReports.map((report) => (
            <div key={report.id} className="p-4">
              <p className="font-medium">{report.title}</p>
              <p className="text-sm text-gray-500">
                {report.water_source?.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
