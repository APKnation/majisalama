// frontend/src/components/Navbar.jsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">💧</span>
              <span className="text-lg sm:text-xl font-bold text-gray-900">
                WaterTrack
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Nyumbani
            </Link>
            <Link
              to="/map"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Ramani
            </Link>

            {user ? (
              <>
                {isAdmin() && (
                  <Link
                    to="/admin"
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition"
                  >
                    Admin Panel
                  </Link>
                )}

                <Link
                  to="/report"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                >
                  Ripoti Uharibifu
                </Link>

                <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
                  <span className="text-sm text-gray-600">{user.username}</span>
                  <button
                    onClick={logout}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Toka
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Ingia
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                >
                  Jiunge
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Nyumbani
            </Link>
            <Link
              to="/map"
              className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Ramani
            </Link>

            {user ? (
              <>
                {isAdmin() && (
                  <Link
                    to="/admin"
                    className="block px-3 py-2 rounded-md bg-purple-600 text-white text-sm font-medium hover:bg-purple-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}

                <Link
                  to="/report"
                  className="block px-3 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Ripoti Uharibifu
                </Link>

                <div className="px-3 py-2 border-t border-gray-200 pt-3 space-y-2">
                  <p className="text-sm text-gray-600">Karibu, {user.username}</p>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-red-600 hover:text-red-800 hover:bg-red-50 text-sm font-medium"
                  >
                    Toka
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-sm font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Ingia
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Jiunge
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
