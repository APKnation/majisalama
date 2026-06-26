import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

export default function WaterOfficerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    assignedReports: 0,
    inProgressReports: 0,
    completedReports: 0,
    totalSourcesManaged: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const reportsRes = await api.get("/damage-reports/?assigned_to__id=" + user?.id);
      const sourcesRes = await api.get("/water-sources/?managed_by__id=" + user?.id);

      const reports = reportsRes.data.results || reportsRes.data;
      const sources = sourcesRes.data.results || sourcesRes.data;

      setStats({
        assignedReports: reports.length,
        inProgressReports: reports.filter(r => r.status === "in_progress").length,
        completedReports: reports.filter(r => r.status === "resolved").length,
        totalSourcesManaged: sources.length,
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Wafanyakazi wa Maji</h1>
        <p className="text-gray-600 mt-1">Karibu, {user?.username}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <p className="text-sm text-gray-600">Ripoti Zilizopewa</p>
          <p className="text-3xl font-bold text-gray-900">{stats.assignedReports}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <p className="text-sm text-gray-600">Inafanywa Kazi</p>
          <p className="text-3xl font-bold text-blue-600">{stats.inProgressReports}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <p className="text-sm text-gray-600">Imetatuliwa</p>
          <p className="text-3xl font-bold text-green-600">{stats.completedReports}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <p className="text-sm text-gray-600">Vyanzo vya Karibu</p>
          <p className="text-3xl font-bold text-purple-600">{stats.totalSourcesManaged}</p>
        </div>
      </div>
    </div>
  );
}