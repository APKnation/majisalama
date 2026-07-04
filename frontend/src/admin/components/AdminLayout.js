// src/admin/components/AdminLayout.jsx — BMW M Design System

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const MENU = [
  { path: "/admin",               label: "Dashboard",           abbr: "DB" },
  { path: "/admin/water-sources", label: "Vyanzo vya Maji",     abbr: "VS" },
  { path: "/admin/reports",       label: "Ripoti za Uharibifu", abbr: "RP" },
  { path: "/admin/quality",       label: "Ripoti za Ubora",     abbr: "QR" },
  { path: "/admin/villages",      label: "Vijiji",              abbr: "VJ" },
  { path: "/admin/users",         label: "Watumiaji",           abbr: "WA" },
  { path: "/admin/alerts",        label: "Arifa",               abbr: "AR" },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;
  const activeLabel = MENU.find((m) => m.path === location.pathname)?.label || "Admin";

  return (
    <div
      style={{ background: "#000000", minHeight: "100vh" }}
      className="flex"
    >
      {/* ─── MOBILE OVERLAY ─── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{ background: "rgba(0,0,0,0.7)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── SIDEBAR ─── */}
      <aside
        style={{
          background: "#0d0d0d",
          borderRight: "1px solid #3c3c3c",
          width: collapsed ? "64px" : "240px",
          minHeight: "100vh",
          transition: "width 0.2s ease",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0, left: 0,
          zIndex: 40,
          transform: sidebarOpen ? "translateX(0)" : undefined,
        }}
        className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Brand + M stripe */}
        <div style={{ borderBottom: "1px solid #3c3c3c" }}>
          <div className="m-stripe" />
          <div className="flex items-center gap-3 px-4 py-4">
            <div
              style={{
                width: "32px", height: "32px", flexShrink: 0,
                background: "#1a1a1a",
                border: "1px solid #3c3c3c",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <div className="m-stripe" style={{ width: "16px", height: "2px" }} />
            </div>
            {!collapsed && (
              <div>
                <p style={{ color: "#ffffff", fontSize: "12px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase" }}>
                  Maji Salama
                </p>
                <p style={{ color: "#7e7e7e", fontSize: "10px", fontWeight: 400, letterSpacing: "1px", textTransform: "uppercase" }}>
                  Admin Panel
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {MENU.map(({ path, label, abbr }) => (
            <Link
              key={path}
              to={path}
              onClick={() => sidebarOpen && setSidebarOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: collapsed ? "12px 16px" : "11px 16px",
                margin: "2px 8px",
                textDecoration: "none",
                fontSize: "13px",
                fontWeight: isActive(path) ? 700 : 400,
                letterSpacing: isActive(path) ? "0.5px" : "0",
                color: isActive(path) ? "#ffffff" : "#7e7e7e",
                background: isActive(path) ? "#1a1a1a" : "transparent",
                borderLeft: isActive(path) ? "2px solid #0066b1" : "2px solid transparent",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                if (!isActive(path)) {
                  e.currentTarget.style.color = "#ffffff";
                  e.currentTarget.style.background = "#1a1a1a";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(path)) {
                  e.currentTarget.style.color = "#7e7e7e";
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              <span
                style={{
                  width: "28px", height: "28px", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: isActive(path) ? "#0066b1" : "#262626",
                  color: isActive(path) ? "#ffffff" : "#7e7e7e",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                }}
              >
                {abbr}
              </span>
              {!collapsed && <span style={{ whiteSpace: "nowrap" }}>{label}</span>}
            </Link>
          ))}
        </nav>

        {/* User + Logout */}
        <div style={{ borderTop: "1px solid #3c3c3c", padding: "16px 12px" }}>
          <div className="flex items-center gap-3 mb-3">
            <div
              style={{
                width: "32px", height: "32px", flexShrink: 0,
                background: "#262626",
                border: "1px solid #3c3c3c",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#7e7e7e", fontSize: "14px",
              }}
            >
              {user?.username?.[0]?.toUpperCase() || "U"}
            </div>
            {!collapsed && (
              <div style={{ overflow: "hidden" }}>
                <p style={{ color: "#ffffff", fontSize: "13px", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {user?.username}
                </p>
                <p style={{ color: "#7e7e7e", fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>
                  {user?.role}
                </p>
              </div>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={logout}
              className="btn-m-outline w-full"
              style={{ height: "36px", fontSize: "11px", padding: "0 16px" }}
            >
              Toka
            </button>
          )}
        </div>

        {/* Collapse toggle (desktop) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:block"
          style={{
            borderTop: "1px solid #3c3c3c",
            padding: "10px",
            color: "#7e7e7e",
            background: "transparent",
            textAlign: "center",
            fontSize: "12px",
            cursor: "pointer",
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#7e7e7e")}
        >
          {collapsed ? "▶" : "◀"}
        </button>
      </aside>

      {/* ─── MAIN AREA ─── */}
      <div
        style={{
          flex: 1,
          marginLeft: collapsed ? "64px" : "240px",
          transition: "margin-left 0.2s ease",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
        className="lg:block"
      >
        {/* Top Bar */}
        <header
          style={{
            background: "#0d0d0d",
            borderBottom: "1px solid #3c3c3c",
            height: "56px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
            position: "sticky",
            top: 0,
            zIndex: 20,
          }}
        >
          {/* Mobile burger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
            style={{ color: "#7e7e7e", background: "transparent", cursor: "pointer" }}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <p
            style={{
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
            }}
          >
            {activeLabel}
          </p>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              style={{ color: "#7e7e7e", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#7e7e7e")}
            >
              ← Mwanzo
            </Link>
          </div>
        </header>

        {/* ─── M STRIPE ACCENT ─── */}
        <div className="m-stripe" />

        {/* Page Content */}
        <main style={{ padding: "32px 24px", flex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
