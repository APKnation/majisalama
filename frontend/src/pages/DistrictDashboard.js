import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

export default function DistrictDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalVillages: 0,
    totalSources: 0,
    safeSources: 0,
    pendingReports: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const sourcesRes = await api.get("/water-sources/");
      const reportsRes = await api.get("/damage-reports/");
      const villagesRes = await api.get("/villages/");

      const sources = sourcesRes.data.results || sourcesRes.data;
      const reports = reportsRes.data.results || reportsRes.data;
      const villages = villagesRes.data.results || villagesRes.data;

      setStats({
        totalVillages: villages.length,
        totalSources: sources.length,
        safeSources: sources.filter(s => s.status === "safe").length,
        pendingReports: reports.filter(r => r.status === "pending").length,
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mfanyikazi wa Wilaya</h1>
        <p className="text-gray-600 mt-1">Karibu, {user?.username}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <p className="text-sm text-gray-600">Vijiji</p>
          <p className="text-3xl font-bold text-gray-900">{stats.totalVillages}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <p className="text-sm text-gray-600">Vyanzo vya Maji</p>
          <p className="text-3xl font-bold text-blue-600">{stats.totalSources}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <p className="text-sm text-gray-600">Salama</p>
          <p className="text-3xl font-bold text-green-600">{stats.safeSources}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <p className="text-sm text-gray-600">Ripoti Zinazosubiri</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.pendingReports}</p>
        </div>
      </div>
    </div>
  );
}