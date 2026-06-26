// frontend/src/components/Navbar.jsx

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">💧</span>
              <span className="text-xl font-bold text-gray-900">
                WaterTrack
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/map"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Ramani
            </Link>

            {user ? (
              <>
                {/* ✅ Admin Link */}
                {isAdmin() && (
                  <Link
                    to="/admin"
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700"
                  >
                    Admin Panel
                  </Link>
                )}

                <Link
                  to="/report"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  Ripoti Uharibifu
                </Link>

                <div className="flex items-center gap-2">
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
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  Jiunge
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
