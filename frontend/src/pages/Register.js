import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password1: "",
    password2: "",
    first_name: "",
    last_name: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.password1 !== formData.password2) {
      setError("Nywila hazilingani");
      return;
    }
    setIsSubmitting(true);
    try {
      await register(formData);
      navigate("/login");
    } catch (err) {
      setError("Kuna hitilafu. Jaribu tena.");
      setIsSubmitting(false);
    }
  };

  const Field = ({ label, children }) => (
    <div>
      <label
        className="block mb-2"
        style={{ color: "#7e7e7e", fontSize: "11px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase" }}
      >
        {label}
      </label>
      {children}
    </div>
  );

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
          <div
            style={{
              position: "absolute", inset: 0,
              backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
              pointerEvents: "none",
            }}
          />

          <div className="relative z-10">
            <div className="m-stripe" style={{ width: "40px", height: "3px", marginBottom: "24px" }} />
            <span className="font-bold text-white tracking-[2px] uppercase text-sm">
              Maji Salama
            </span>
          </div>

          <div className="relative z-10">
            <p className="label-uppercase mb-6" style={{ color: "#0066b1" }}>
              Karibu Kwenye Familia
            </p>
            <h1 className="display-lg text-white mb-6">
              Anza Safari<br />Yako Leo.
            </h1>
            <p className="body-md" style={{ color: "#bbbbbb", maxWidth: "400px" }}>
              Jiunge na mtandao wetu na uwe sehemu ya mabadiliko chanya
              katika utunzaji wa vyanzo vya maji Tanzania.
            </p>
          </div>

          {/* perks */}
          <div className="relative z-10 space-y-3">
            {[
              "Ripoti uharibifu wa vyanzo vya maji",
              "Fuatilia hali ya vyanzo kwa wakati halisi",
              "Pata arifa za matengenezo na ubora",
            ].map((perk) => (
              <div key={perk} className="flex items-start gap-3">
                <div
                  style={{ width: "6px", height: "6px", background: "#0066b1", flexShrink: 0, marginTop: "7px" }}
                />
                <p style={{ color: "#bbbbbb", fontSize: "14px", fontWeight: 300 }}>{perk}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── RIGHT PANEL: FORM ─── */}
        <div
          className="flex flex-col justify-center items-center w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 overflow-y-auto"
          style={{ background: "#000000" }}
        >
          <div className="w-full max-w-md animate-fade-in-up py-8">
            {/* mobile brand */}
            <div className="lg:hidden mb-8 flex items-center gap-3">
              <div className="m-stripe" style={{ width: "28px", height: "3px" }} />
              <span className="font-bold text-white tracking-[2px] uppercase text-sm">
                Maji Salama
              </span>
            </div>

            <p className="label-uppercase mb-2" style={{ color: "#0066b1" }}>
              Akaunti Mpya
            </p>
            <h2 className="text-3xl font-bold text-white mb-8 uppercase tracking-wide">
              Jisajili
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
              <div className="grid grid-cols-2 gap-4">
                <Field label="Jina la Kwanza">
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="m-input"
                    required
                  />
                </Field>
                <Field label="Jina la Mwisho">
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="m-input"
                    required
                  />
                </Field>
              </div>

              <Field label="Jina la Mtumiaji">
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="m-input"
                  placeholder="username"
                  required
                />
              </Field>

              <Field label="Barua Pepe">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="m-input"
                  placeholder="email@example.com"
                  required
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Nywila">
                  <input
                    type="password"
                    value={formData.password1}
                    onChange={(e) => setFormData({ ...formData, password1: e.target.value })}
                    className="m-input"
                    placeholder="••••••••"
                    required
                  />
                </Field>
                <Field label="Thibitisha Nywila">
                  <input
                    type="password"
                    value={formData.password2}
                    onChange={(e) => setFormData({ ...formData, password2: e.target.value })}
                    className="m-input"
                    placeholder="••••••••"
                    required
                  />
                </Field>
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
                  ) : "Kamilisha Usajili"}
                </button>
              </div>
            </form>

            <div
              style={{ borderTop: "1px solid #3c3c3c", marginTop: "32px", paddingTop: "24px" }}
              className="text-center"
            >
              <p style={{ color: "#7e7e7e", fontSize: "14px", fontWeight: 300 }}>
                Tayari una akaunti?{" "}
                <Link
                  to="/login"
                  style={{ color: "#ffffff", fontWeight: 700, letterSpacing: "0.5px", textDecoration: "none" }}
                >
                  Ingia Hapa →
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
