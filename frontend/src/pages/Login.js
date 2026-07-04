// frontend/src/pages/Login.jsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      await login(formData.username, formData.password);
    } catch (err) {
      setError("Jina la mtumiaji au nywila sio sahihi");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-gray-50">
      {/* Left side: Premium Abstract Gradient */}
      <div className="hidden lg:flex flex-col justify-center items-start w-1/2 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white p-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative z-10 animate-fade-in-up">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/20">
            <span className="text-4xl">💧</span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-4">
            WaterTrack
          </h1>
          <p className="text-xl text-blue-100 max-w-md font-light leading-relaxed">
            Mfumo wa kisasa wa kusimamia, kufuatilia na kuripoti hali ya vyanzo vya maji kote nchini.
          </p>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-8 sm:p-12 lg:p-24 relative bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="w-full max-w-md animate-fade-in-up delay-100">
          <div className="text-center lg:text-left mb-10">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Karibu Tena
            </h2>
            <p className="text-gray-500 mt-2 font-medium">
              Ingia kwenye akaunti yako ili kuendelea.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg mb-6 animate-fade-in-up flex items-center shadow-sm">
              <span className="text-xl mr-3">⚠️</span>
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-blue-600">
                Jina la Mtumiaji
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full pl-4 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 shadow-sm"
                  placeholder="apk"
                  required
                />
              </div>
            </div>
            
            <div className="group">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-700 transition-colors group-focus-within:text-blue-600">
                  Nywila
                </label>
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors">
                  Umesahau nywila?
                </a>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full pl-4 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 shadow-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full relative flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-[15px] shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transform hover:-translate-y-0.5 transition-all duration-200 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Ingia"
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-gray-500 font-medium">
              Huna akaunti?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-800 font-bold ml-1 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all hover:after:w-full"
              >
                Jiunge Sasa
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
