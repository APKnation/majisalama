// src/components/Navbar.jsx — BMW M Design System
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav style={{ background: "#000000", borderBottom: "1px solid #3c3c3c", position: "sticky", top: 0, zIndex: 40 }}>
      <div className="m-stripe" />
      <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 32px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

        {/* Brand */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
          <div className="m-stripe" style={{ width: "28px", height: "3px" }} />
          <span style={{ color: "#ffffff", fontSize: "12px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase" }}>
            Maji Salama
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {[{ to: "/", label: "Nyumbani" }, { to: "/predict", label: "Uliza" }].map(({ to, label }) => (
            <Link key={to} to={to} style={{ color: "#7e7e7e", fontSize: "13px", letterSpacing: "0.5px", textDecoration: "none", transition: "color 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#7e7e7e")}
            >{label}</Link>
          ))}

          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "16px", borderLeft: "1px solid #3c3c3c", paddingLeft: "16px" }}>
              {isAdmin?.() && (
                <Link to="/admin" className="btn-m-outline" style={{ height: "36px", padding: "0 16px", fontSize: "11px" }}>Admin</Link>
              )}
              <Link to="/report" className="btn-m-primary" style={{ height: "36px", padding: "0 16px", fontSize: "11px" }}>Ripoti</Link>
              <span style={{ color: "#7e7e7e", fontSize: "13px", fontWeight: 300 }}>{user.username}</span>
              <button onClick={logout} style={{ color: "#ffffff", fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", background: "transparent", cursor: "pointer" }}>
                Toka
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Link to="/login" style={{ color: "#7e7e7e", fontSize: "13px", textDecoration: "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#7e7e7e")}
              >Ingia</Link>
              <Link to="/register" className="btn-m-outline" style={{ height: "36px", padding: "0 16px", fontSize: "11px" }}>Jiunge</Link>
            </div>
          )}
        </div>

        {/* Mobile burger */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden" style={{ color: "#7e7e7e", background: "transparent", cursor: "pointer" }}>
          <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{ background: "#0d0d0d", borderTop: "1px solid #3c3c3c", padding: "16px 24px" }}>
          {[{ to: "/", label: "Nyumbani" }, { to: "/predict", label: "Uliza" }].map(({ to, label }) => (
            <Link key={to} to={to} onClick={() => setMobileOpen(false)}
              style={{ display: "block", color: "#7e7e7e", fontSize: "13px", padding: "10px 0", textDecoration: "none", borderBottom: "1px solid #1a1a1a" }}>
              {label}
            </Link>
          ))}
          {user ? (
            <>
              {isAdmin?.() && <Link to="/admin" onClick={() => setMobileOpen(false)} style={{ display: "block", color: "#0066b1", fontSize: "13px", padding: "10px 0", textDecoration: "none", borderBottom: "1px solid #1a1a1a" }}>Admin Panel</Link>}
              <Link to="/report" onClick={() => setMobileOpen(false)} style={{ display: "block", color: "#ffffff", fontSize: "13px", padding: "10px 0", textDecoration: "none", borderBottom: "1px solid #1a1a1a" }}>Ripoti Uharibifu</Link>
              <button onClick={() => { logout(); setMobileOpen(false); }} style={{ display: "block", color: "#ffffff", fontSize: "13px", padding: "10px 0", background: "transparent", cursor: "pointer", width: "100%", textAlign: "left" }}>Toka</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)} style={{ display: "block", color: "#7e7e7e", fontSize: "13px", padding: "10px 0", textDecoration: "none", borderBottom: "1px solid #1a1a1a" }}>Ingia</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} style={{ display: "block", color: "#ffffff", fontSize: "13px", padding: "10px 0", textDecoration: "none" }}>Jiunge</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
