// src/layouts/MLayout.js — Shared BMW M Sidebar Layout (replaces VillageLeaderLayout, WaterOfficerLayout, DistrictOfficerLayout)

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function MLayout({ children, menuItems, roleLabel }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const activeLabel =
    menuItems.find((m) => isActive(m.path))?.label || roleLabel;

  return (
    <div style={{ background: "#000000", minHeight: "100vh" }} className="flex">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{ background: "rgba(0,0,0,0.7)" }}
          onClick={() => setMobileOpen(false)}
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
          top: 0,
          left: 0,
          zIndex: 40,
        }}
        className={`${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Brand */}
        <div style={{ borderBottom: "1px solid #3c3c3c" }}>
          <div className="m-stripe" />
          <div className="flex items-center gap-3 px-4 py-4">
            <div
              style={{
                width: "32px", height: "32px", flexShrink: 0,
                background: "#1a1a1a", border: "1px solid #3c3c3c",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <div className="m-stripe" style={{ width: "16px", height: "2px" }} />
            </div>
            {!collapsed && (
              <div>
                <p style={{ color: "#ffffff", fontSize: "11px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase" }}>
                  Maji Salama
                </p>
                <p style={{ color: "#7e7e7e", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase" }}>
                  {roleLabel}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {menuItems.map(({ path, label, abbr }) => {
            const active = isActive(path);
            return (
              <Link
                key={path}
                to={path}
                onClick={() => mobileOpen && setMobileOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "11px 16px",
                  margin: "2px 8px",
                  textDecoration: "none",
                  fontSize: "13px",
                  fontWeight: active ? 700 : 400,
                  color: active ? "#ffffff" : "#7e7e7e",
                  background: active ? "#1a1a1a" : "transparent",
                  borderLeft: `2px solid ${active ? "#0066b1" : "transparent"}`,
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = "#ffffff";
                    e.currentTarget.style.background = "#1a1a1a";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = "#7e7e7e";
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                <span
                  style={{
                    width: "28px", height: "28px", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: active ? "#0066b1" : "#262626",
                    color: active ? "#ffffff" : "#7e7e7e",
                    fontSize: "10px", fontWeight: 700, letterSpacing: "0.5px",
                  }}
                >
                  {abbr}
                </span>
                {!collapsed && <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div style={{ borderTop: "1px solid #3c3c3c", padding: "16px 12px" }}>
          <div className="flex items-center gap-3 mb-3">
            <div
              style={{
                width: "32px", height: "32px", flexShrink: 0,
                background: "#262626", border: "1px solid #3c3c3c",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#7e7e7e", fontSize: "13px", fontWeight: 700,
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
                  {user?.village?.name || user?.role}
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

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:block"
          style={{
            borderTop: "1px solid #3c3c3c", padding: "10px",
            color: "#7e7e7e", background: "transparent",
            textAlign: "center", fontSize: "12px", cursor: "pointer",
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
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden"
            style={{ color: "#7e7e7e", background: "transparent", cursor: "pointer" }}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <p style={{ color: "#ffffff", fontSize: "12px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase" }}>
            {activeLabel}
          </p>
          <Link
            to="/"
            style={{ color: "#7e7e7e", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", textDecoration: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#7e7e7e")}
          >
            ← Mwanzo
          </Link>
        </header>
        <div className="m-stripe" />

        {/* Page content */}
        <main style={{ padding: "32px 24px", flex: 1, background: "#000000" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
