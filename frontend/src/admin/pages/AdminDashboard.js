// src/admin/pages/AdminDashboard.jsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import {
  getAllWaterSources,
  getAllDamageReports,
  getAllQualityReports,
} from "../utils/adminApi";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalSources: 0,
    safeSources: 0,
    cautionSources: 0,
    unsafeSources: 0,
    pendingReports: 0,
    totalReports: 0,
    totalQualityChecks: 0,
    recentAlerts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [sourcesRes, reportsRes, qualityRes] = await Promise.all([
        getAllWaterSources(),
        getAllDamageReports(),
        getAllQualityReports(),
      ]);

      const sources = sourcesRes.data.results || sourcesRes.data;
      const reports = reportsRes.data.results || reportsRes.data;
      const quality = qualityRes.data.results || qualityRes.data;

      setStats({
        totalSources: sources.length,
        safeSources: sources.filter((s) => s.status === "safe").length,
        cautionSources: sources.filter((s) => s.status === "caution").length,
        unsafeSources: sources.filter((s) => s.status === "unsafe").length,
        pendingReports: reports.filter((r) => r.status === "pending").length,
        totalReports: reports.length,
        totalQualityChecks: quality.length,
        recentAlerts: sources.filter((s) => s.status === "unsafe").length,
      });

      // Recent activity
      const activity = [
        ...reports.slice(0, 3).map((r) => ({
          id: r.id,
          type: "report",
          message: `Ripoti mpya: ${r.title}`,
          time: r.report_date,
          status: r.status,
        })),
        ...quality.slice(0, 3).map((q) => ({
          id: q.id,
          type: "quality",
          message: `Upimaji: ${q.water_source?.name}`,
          time: q.test_date,
          status: q.is_safe ? "safe" : "unsafe",
        })),
      ]
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 5);

      setRecentActivity(activity);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, subtitle, color, icon, trend }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          {trend && (
            <p
              className={`text-sm mt-2 font-medium ${trend > 0 ? "text-green-600" : "text-red-600"}`}
            >
              {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}% mwezi huu
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Jumla ya Vyanzo"
          value={stats.totalSources}
          subtitle="Vyanzo vyote vya maji"
          color="bg-blue-100"
          icon="💧"
          trend={5}
        />
        <StatCard
          title="Vyanzo Salama"
          value={stats.safeSources}
          subtitle={`${Math.round((stats.safeSources / stats.totalSources) * 100) || 0}% ya jumla`}
          color="bg-green-100"
          icon="✅"
          trend={3}
        />
        <StatCard
          title="Vyanvo Hatarini"
          value={stats.unsafeSources}
          subtitle="Vinahitaji hatua haraka"
          color="bg-red-100"
          icon="⚠️"
          trend={-2}
        />
        <StatCard
          title="Ripoti Zinazosubiri"
          value={stats.pendingReports}
          subtitle="Zinahitaji uchunguzi"
          color="bg-yellow-100"
          icon="📋"
          trend={8}
        />
      </div>

      {/* Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Mgawanyo wa Hali
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Salama</span>
                <span className="font-medium">{stats.safeSources}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${(stats.safeSources / stats.totalSources) * 100 || 0}%`,
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Tahadhari</span>
                <span className="font-medium">{stats.cautionSources}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{
                    width: `${(stats.cautionSources / stats.totalSources) * 100 || 0}%`,
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Hatarini</span>
                <span className="font-medium">{stats.unsafeSources}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{
                    width: `${(stats.unsafeSources / stats.totalSources) * 100 || 0}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Vitendo vya Haraka
          </h3>
          <div className="space-y-3">
            <Link
              to="/admin/water-sources"
              className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              <span className="text-2xl">➕</span>
              <div>
                <p className="font-medium text-gray-900">Ongeza Chanzo Kipya</p>
                <p className="text-sm text-gray-600">
                  Sajili chanzo kipya cha maji
                </p>
              </div>
            </Link>
            <Link
              to="/admin/quality"
              className="flex items-center gap-3 p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
            >
              <span className="text-2xl">🔬</span>
              <div>
                <p className="font-medium text-gray-900">Weka Upimaji Mpya</p>
                <p className="text-sm text-gray-600">Rekodi matokeo ya ubora</p>
              </div>
            </Link>
            <Link
              to="/admin/reports"
              className="flex items-center gap-3 p-3 rounded-lg bg-yellow-50 hover:bg-yellow-100 transition-colors"
            >
              <span className="text-2xl">📋</span>
              <div>
                <p className="font-medium text-gray-900">Angalia Ripoti</p>
                <p className="text-sm text-gray-600">
                  {stats.pendingReports} zinazosubiri
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Shughuli za Hivi Karibuni
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    activity.type === "report" ? "bg-yellow-100" : "bg-blue-100"
                  }`}
                >
                  {activity.type === "report" ? "📋" : "🔬"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.time).toLocaleDateString("sw-TZ")}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activity.status === "safe" || activity.status === "resolved"
                      ? "bg-green-100 text-green-800"
                      : activity.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
