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
    <div style={{ background: "#000000", minHeight: "100vh" }} className="flex flex-col">
      {/* ─── M TRICOLOR STRIPE ─── */}
      <div className="m-stripe" />

      <div className="flex flex-1">
        {/* ─── LEFT PANEL ─── */}
        <div
          className="hidden lg:flex flex-col justify-between w-1/2 p-16 relative overflow-hidden"
          style={{ background: "#0d0d0d", borderRight: "1px solid #3c3c3c" }}
        >
          {/* subtle grid */}
          <div
            style={{
              position: "absolute", inset: 0,
              backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
              pointerEvents: "none",
            }}
          />

          {/* Top: brand */}
          <div className="relative z-10">
            <div className="m-stripe" style={{ width: "40px", height: "3px", marginBottom: "24px" }} />
            <span
              className="font-bold text-white tracking-[2px] uppercase text-sm"
            >
              Maji Salama
            </span>
          </div>

          {/* Center: headline */}
          <div className="relative z-10">
            <p className="label-uppercase mb-6" style={{ color: "#0066b1" }}>
              Karibu Tena
            </p>
            <h1 className="display-lg text-white mb-6">
              Dhibiti Maji.<br />Linda Jamii.
            </h1>
            <p className="body-md" style={{ color: "#bbbbbb", maxWidth: "400px" }}>
              Mfumo wa kisasa wa kusimamia, kufuatilia na kuripoti hali ya
              vyanzo vya maji kote nchini.
            </p>
          </div>

          {/* Bottom: stat strip */}
          <div
            className="relative z-10 grid grid-cols-3 gap-px"
            style={{ background: "#3c3c3c" }}
          >
            {[
              { value: "500+", label: "Vyanzo" },
              { value: "120+", label: "Vijiji" },
              { value: "85K+", label: "Wananchi" },
            ].map(({ value, label }) => (
              <div
                key={label}
                style={{ background: "#000000" }}
                className="p-4 text-center"
              >
                <p className="text-2xl font-bold text-white">{value}</p>
                <p style={{ color: "#7e7e7e", fontSize: "11px", fontWeight: 400, letterSpacing: "1px" }} className="uppercase mt-1">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── RIGHT PANEL: FORM ─── */}
        <div
          className="flex flex-col justify-center items-center w-full lg:w-1/2 p-8 sm:p-12 lg:p-16"
          style={{ background: "#000000" }}
        >
          <div className="w-full max-w-sm animate-fade-in-up">
            {/* mobile brand */}
            <div className="lg:hidden mb-8 flex items-center gap-3">
              <div className="m-stripe" style={{ width: "28px", height: "3px" }} />
              <span className="font-bold text-white tracking-[2px] uppercase text-sm">
                Maji Salama
              </span>
            </div>

            <p className="label-uppercase mb-2" style={{ color: "#0066b1" }}>
              Akaunti yako
            </p>
            <h2 className="text-3xl font-bold text-white mb-8 uppercase tracking-wide">
              Ingia
            </h2>

            {error && (
              <div
                style={{ background: "#1a1a1a", borderLeft: "2px solid #ffffff" }}
                className="flex items-center gap-3 px-4 py-3 mb-6"
              >
                <span style={{ color: "#ffffff" }}>⚠</span>
                <p className="body-sm" style={{ color: "#bbbbbb" }}>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label-uppercase block mb-2" style={{ color: "#7e7e7e", fontSize: "11px" }}>
                  Jina la Mtumiaji
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="m-input"
                  placeholder="username"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="label-uppercase" style={{ color: "#7e7e7e", fontSize: "11px" }}>
                    Nywila
                  </label>
                  <a href="#" style={{ color: "#0066b1", fontSize: "12px", letterSpacing: "0.5px" }}>
                    Umesahau?
                  </a>
                </div>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="m-input"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div style={{ paddingTop: "8px" }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-m-primary w-full"
                  style={{ opacity: isSubmitting ? 0.6 : 1 }}
                >
                  {isSubmitting ? (
                    <div
                      style={{
                        width: "18px", height: "18px",
                        border: "2px solid rgba(0,0,0,0.3)",
                        borderTopColor: "#000",
                        borderRadius: "50%",
                        animation: "spin 0.7s linear infinite",
                      }}
                    />
                  ) : "Ingia"}
                </button>
              </div>
            </form>

            <div
              style={{ borderTop: "1px solid #3c3c3c", marginTop: "32px", paddingTop: "24px" }}
              className="text-center"
            >
              <p style={{ color: "#7e7e7e", fontSize: "14px", fontWeight: 300 }}>
                Huna akaunti?{" "}
                <Link
                  to="/register"
                  style={{ color: "#ffffff", fontWeight: 700, letterSpacing: "0.5px", textDecoration: "none" }}
                >
                  Jiunge Sasa →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
