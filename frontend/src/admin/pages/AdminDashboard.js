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

  const StatCard = ({ title, value, subtitle, colorClass, icon, trend, delay }) => (
    <div className={`relative overflow-hidden bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up ${delay}`}>
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 ${colorClass}`}></div>
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
          <p className="text-4xl font-extrabold text-gray-900 mt-2">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-2">{subtitle}</p>}
          {trend && (
            <p className={`text-sm mt-2 font-medium flex items-center ${trend > 0 ? "text-green-600" : "text-red-600"}`}>
              {trend > 0 ? (
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
              ) : (
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
              )}
              {Math.abs(trend)}% mwezi huu
            </p>
          )}
        </div>
        <div className={`p-4 rounded-xl ${colorClass.replace('bg-', 'bg-opacity-10 text-')}`}>
          <span className="text-3xl">{icon}</span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-bold text-gray-900">Dashibodi ya Usimamizi</h1>
        <p className="text-gray-500 mt-1">Uhakiki kamili wa mfumo na takwimu.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Jumla ya Vyanzo"
          value={stats.totalSources}
          subtitle="Vyanzo vyote vya maji"
          colorClass="bg-blue-500"
          icon="💧"
          trend={5}
          delay="delay-100"
        />
        <StatCard
          title="Vyanzo Salama"
          value={stats.safeSources}
          subtitle={`${Math.round((stats.safeSources / (stats.totalSources || 1)) * 100)}% ya jumla`}
          colorClass="bg-green-500"
          icon="✅"
          trend={3}
          delay="delay-200"
        />
        <StatCard
          title="Vyanzo Hatarini"
          value={stats.unsafeSources}
          subtitle="Vinahitaji hatua haraka"
          colorClass="bg-red-500"
          icon="⚠️"
          trend={-2}
          delay="delay-300"
        />
        <StatCard
          title="Ripoti Zinazosubiri"
          value={stats.pendingReports}
          subtitle="Zinahitaji uchunguzi"
          colorClass="bg-yellow-500"
          icon="📋"
          trend={8}
          delay="delay-400"
        />
      </div>

      {/* Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Status Distribution */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 animate-fade-in-up delay-100 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-2 h-6 bg-blue-500 rounded-full mr-3"></span>
            Mgawanyo wa Hali
          </h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-gray-700">Salama</span>
                <span className="font-bold text-gray-900">{stats.safeSources}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-green-500 h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${(stats.safeSources / (stats.totalSources || 1)) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-gray-700">Tahadhari</span>
                <span className="font-bold text-gray-900">{stats.cautionSources}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-yellow-400 h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${(stats.cautionSources / (stats.totalSources || 1)) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-gray-700">Hatarini</span>
                <span className="font-bold text-gray-900">{stats.unsafeSources}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-red-500 h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${(stats.unsafeSources / (stats.totalSources || 1)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 animate-fade-in-up delay-200 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-2 h-6 bg-purple-500 rounded-full mr-3"></span>
            Vitendo vya Haraka
          </h3>
          <div className="space-y-4">
            <Link
              to="/admin/water-sources"
              className="group flex items-center p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50 transition-all duration-200"
            >
              <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">➕</div>
              <div className="ml-4">
                <p className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">Ongeza Chanzo Kipya</p>
                <p className="text-sm text-gray-500">Sajili chanzo kipya cha maji</p>
              </div>
            </Link>
            <Link
              to="/admin/quality"
              className="group flex items-center p-4 rounded-xl border border-gray-100 hover:border-green-100 hover:bg-green-50 transition-all duration-200"
            >
              <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🔬</div>
              <div className="ml-4">
                <p className="font-bold text-gray-900 group-hover:text-green-700 transition-colors">Weka Upimaji Mpya</p>
                <p className="text-sm text-gray-500">Rekodi matokeo ya ubora</p>
              </div>
            </Link>
            <Link
              to="/admin/reports"
              className="group flex items-center p-4 rounded-xl border border-gray-100 hover:border-yellow-100 hover:bg-yellow-50 transition-all duration-200"
            >
              <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">📋</div>
              <div className="ml-4">
                <p className="font-bold text-gray-900 group-hover:text-yellow-700 transition-colors">Angalia Ripoti</p>
                <p className="text-sm text-gray-500">{stats.pendingReports} zinazosubiri</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 animate-fade-in-up delay-300 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-2 h-6 bg-teal-500 rounded-full mr-3"></span>
            Shughuli za Hivi Karibuni
          </h3>
          <div className="space-y-6">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, idx) => (
                <div key={activity.id + '-' + idx} className="relative pl-6 pb-2 border-l-2 border-gray-100 last:border-0 last:pb-0">
                  <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white ${
                    activity.type === "report" ? "bg-yellow-400" : "bg-blue-400"
                  }`}></div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1 font-medium">{new Date(activity.time).toLocaleString("sw-TZ")}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                      activity.status === "safe" || activity.status === "resolved"
                        ? "bg-green-100 text-green-700"
                        : activity.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Hakuna shughuli hivi karibuni.</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
