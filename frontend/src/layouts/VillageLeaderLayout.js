import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function VillageLeaderLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    { path: "/village-dashboard", icon: "📊", label: "Dashboard" },
    { path: "/village-sources", icon: "💧", label: "Vyanzo vya Maji" },
    { path: "/village-reports", icon: "📋", label: "Ripoti" },
    { path: "/village-create", icon: "➕", label: "Anzisha Ripoti" },
    { path: "/village-assign", icon: "🧭", label: "Tenga Kazi" },
    { path: "/village-inspections", icon: "🔬", label: "Uchunguzi / Ubora" },
    { path: "/village-messages", icon: "✉️", label: "Ujumbe" },
    { path: "/village-users", icon: "👥", label: "Watumishi" },
    { path: "/village-notifications", icon: "🔔", label: "Arifa" },
    { path: "/village-export", icon: "📤", label: "Export / Ripoti" },
    { path: "/village-settings", icon: "⚙️", label: "Mipangilio" },
  ];

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative lg:flex flex-col bg-blue-800 text-white transition-all duration-300 h-screen z-40 ${
          sidebarOpen ? "w-64" : "w-0 -left-64 lg:left-0"
        } ${sidebarCollapsed ? "lg:w-20" : "lg:w-64"}`}
      >
        <div className="p-4 lg:p-6 border-b border-blue-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-xl text-blue-800 flex-shrink-0">
              💧
            </div>
            {(sidebarOpen || !sidebarCollapsed) && (
              <div className="min-w-0">
                <h1 className="font-bold text-lg truncate">WaterTrack</h1>
                <p className="text-xs text-blue-200 truncate">Kiongozi wa Kijiji</p>
              </div>
            )}
          </div>
        </div>

        {/* Close button for mobile */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-4 text-blue-200 hover:text-white border-b border-blue-700 text-right"
        >
          ✕
        </button>

        {/* Collapse button for desktop */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden lg:block p-4 text-blue-200 hover:text-white border-b border-blue-700"
        >
          {sidebarCollapsed ? "▶" : "◀"}
        </button>

        <nav className="flex-1 py-4 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => sidebarOpen && setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors text-sm md:text-base ${
                isActive(item.path) ? "bg-blue-600 text-white" : "text-blue-200 hover:bg-blue-700 hover:text-white"
              }`}
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              {(sidebarOpen || !sidebarCollapsed) && (
                <span className="font-medium truncate">{item.label}</span>
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-blue-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
              👤
            </div>
            {(sidebarOpen || !sidebarCollapsed) && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.username}</p>
                <p className="text-xs text-blue-300 truncate">{user?.village?.name}</p>
              </div>
            )}
          </div>
          {(sidebarOpen || !sidebarCollapsed) && (
            <button
              onClick={logout}
              className="mt-3 w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors"
            >
              Toka
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-auto w-full">
        <header className="bg-white shadow-sm px-4 lg:px-8 py-3 lg:py-4 flex items-center justify-between sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-800"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h2 className="text-lg lg:text-xl font-bold text-gray-800">
            {menuItems.find((item) => item.path === location.pathname)?.label || "Dashboard"}
          </h2>
          <div className="w-6" />
        </header>
        <div className="p-4 sm:p-6 lg:p-8 overflow-auto">{children}</div>
      </main>
    </div>
  );
}