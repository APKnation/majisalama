import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalSources: 0,
    safeSources: 0,
    unsafeSources: 0,
    pendingReports: 0,
  });
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, colorClass, delay }) => (
    <div className={`relative overflow-hidden bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up ${delay}`}>
      <div className={`absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full opacity-10 ${colorClass}`}></div>
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</h3>
        <span className={`text-2xl p-3 rounded-xl bg-gray-50 ${colorClass.replace('bg-', 'text-')}`}>{icon}</span>
      </div>
      {loading ? (
        <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
      ) : (
        <p className="text-4xl font-extrabold text-gray-900 relative z-10">{value}</p>
      )}
    </div>
  );

  const ActionButton = ({ to, icon, title, description, colorClass }) => (
    <Link to={to} className={`group relative overflow-hidden bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 block`}>
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${colorClass}`}></div>
      <div className="flex items-start gap-4 relative z-10">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl shadow-sm ${colorClass.replace('bg-', 'bg-opacity-20 text-').replace('500', '600')}`}>
          {icon}
        </div>
        <div>
          <h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{title}</h4>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
      </div>
    </Link>
  );

  const renderRoleActions = () => {
    const role = user?.role || 'citizen';
    
    switch(role) {
      case 'water_officer':
        return (
          <>
            <ActionButton to="/reports?filter=assigned" icon="📋" title="Kazi Zangu" description="Angalia ripoti ulizopangiwa" colorClass="bg-blue-500" />
            <ActionButton to="/quality/new" icon="🔬" title="Weka Upimaji" description="Rekodi matokeo mapya ya maji" colorClass="bg-green-500" />
            <ActionButton to="/messages" icon="✉️" title="Soma Ujumbe" description="Wasiliana na viongozi" colorClass="bg-purple-500" />
          </>
        );
      case 'village_leader':
        return (
          <>
            <ActionButton to="/reports" icon="👨‍🔧" title="Gawa Kazi" description="Pangia mafundi ripoti mpya" colorClass="bg-yellow-500" />
            <ActionButton to="/water-sources" icon="💧" title="Simamia Vyanzo" description="Tazama na rekebisha vyanzo" colorClass="bg-blue-500" />
            <ActionButton to="/messages" icon="✉️" title="Soma Ujumbe" description="Wasiliana na mafundi na wilaya" colorClass="bg-purple-500" />
          </>
        );
      case 'district_officer':
        return (
          <>
            <ActionButton to="/reports" icon="📊" title="Ripoti za Wilaya" description="Tazama hali ya wilaya nzima" colorClass="bg-indigo-500" />
            <ActionButton to="/villages" icon="🏘️" title="Orodha ya Vijiji" description="Simamia vijiji na viongozi" colorClass="bg-teal-500" />
            <ActionButton to="/messages" icon="✉️" title="Soma Ujumbe" description="Wasiliana na viongozi wa vijiji" colorClass="bg-purple-500" />
          </>
        );
      default: // citizen
        return (
          <>
            <ActionButton to="/reports/new" icon="⚠️" title="Ripoti Uharibifu" description="Ripoti tatizo kwenye chanzo cha maji" colorClass="bg-red-500" />
            <ActionButton to="/water-sources" icon="📍" title="Vyanzo Vya Karibu" description="Tafuta vyanzo salama karibu nawe" colorClass="bg-blue-500" />
            <ActionButton to="/messages" icon="✉️" title="Soma Ujumbe" description="Wasiliana na kiongozi wako" colorClass="bg-purple-500" />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="mb-10 animate-fade-in-up">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Karibu, {user?.first_name || user?.username}
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Huu ni muhtasari wako kama <span className="font-semibold text-blue-600 capitalize">{user?.role?.replace('_', ' ')}</span>
          </p>
        </div>

        {/* Role-Based Quick Actions */}
        <div className="mb-12 animate-fade-in-up delay-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-2 h-6 bg-purple-500 rounded-full mr-3"></span>
            Vitendo vya Haraka
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {renderRoleActions()}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard 
            title="Jumla ya Vyanzo" 
            value={stats.totalSources} 
            icon="💧" 
            colorClass="bg-blue-500" 
            delay="delay-100"
          />
          <StatCard 
            title="Vyanzo Salama" 
            value={stats.safeSources} 
            icon="✅" 
            colorClass="bg-green-500" 
            delay="delay-200"
          />
          <StatCard 
            title="Vyanzo Hatarini" 
            value={stats.unsafeSources} 
            icon="⚠️" 
            colorClass="bg-red-500" 
            delay="delay-300"
          />
          <StatCard 
            title="Ripoti (Subiri)" 
            value={stats.pendingReports} 
            icon="📋" 
            colorClass="bg-yellow-500" 
            delay="delay-400"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in-up delay-300">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <span className="w-2 h-6 bg-blue-500 rounded-full mr-3"></span>
              Ripoti za Hivi Karibuni
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="p-6 animate-pulse flex space-x-4">
                  <div className="flex-1 space-y-3 py-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            ) : recentReports.length > 0 ? (
              recentReports.map((report) => (
                <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors duration-150 flex items-start justify-between group cursor-pointer">
                  <div>
                    <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{report.title}</p>
                    <p className="text-sm text-gray-500 mt-1 flex items-center">
                      <span className="mr-2">📍</span> {report.water_source?.name || 'Chanzo hakijatajwa'}
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {report.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-10 text-center text-gray-500">
                <span className="text-4xl mb-3 block">📭</span>
                Hakuna ripoti mpya kwa sasa.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
