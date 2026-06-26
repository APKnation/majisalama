import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function VillageLeaderLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    { path: "/village-dashboard", icon: "📊", label: "Dashboard" },
    { path: "/village-sources", icon: "💧", label: "Vyanzo vya Maji" },
    { path: "/village-reports", icon: "📋", label: "Ripoti" },
    { path: "/alerts", icon: "🔔", label: "Arifa" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className={`${sidebarOpen ? "w-64" : "w-20"} bg-blue-800 text-white transition-all duration-300 flex flex-col`}>
        <div className="p-6 border-b border-blue-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-xl text-blue-800">
              💧
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="font-bold text-lg">WaterTrack</h1>
                <p className="text-xs text-blue-200">Kiongozi wa Kijiji</p>
              </div>
            )}
          </div>
        </div>

        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-4 text-blue-200 hover:text-white border-b border-blue-700">
          {sidebarOpen ? "◀" : "▶"}
        </button>

        <nav className="flex-1 py-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors ${
                isActive(item.path) ? "bg-blue-600 text-white" : "text-blue-200 hover:bg-blue-700 hover:text-white"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-blue-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center">
              👤
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.username}</p>
                <p className="text-xs text-blue-300">{user?.village?.name}</p>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <button onClick={logout} className="mt-3 w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors">
              Toka
            </button>
          )}
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm px-8 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            {menuItems.find((item) => item.path === location.pathname)?.label || "Dashboard"}
          </h2>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}