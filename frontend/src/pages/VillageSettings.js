import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

export default function VillageSettings() {
  const { user } = useAuth();
  const [tab, setTab]         = useState("profile");
  const [saving, setSaving]   = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError]     = useState("");

  const [profile, setProfile] = useState({
    first_name:  user?.first_name  || "",
    last_name:   user?.last_name   || "",
    email:       user?.email       || "",
    phone:       user?.phone       || "",
  });

  const [passwords, setPasswords] = useState({
    current: "", newPass: "", confirm: "",
  });

  const handleProfileChange = e => setProfile({ ...profile, [e.target.name]: e.target.value });
  const handlePassChange    = e => setPasswords({ ...passwords, [e.target.name]: e.target.value });

  const saveProfile = async e => {
    e.preventDefault();
    setSaving(true); setError(""); setSuccess("");
    try {
      await api.patch(`/users/${user?.id}/`, profile);
      setSuccess("Wasifu umehifadhiwa!");
    } catch (err) {
      setError(err.response?.data?.detail || "Hitilafu. Jaribu tena.");
    } finally { setSaving(false); }
  };

  const savePassword = async e => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) {
      setError("Nywila mpya hazilingani."); return;
    }
    if (passwords.newPass.length < 8) {
      setError("Nywila lazima iwe na herufi 8 au zaidi."); return;
    }
    setSaving(true); setError(""); setSuccess("");
    try {
      await api.patch(`/users/${user?.id}/`, { password: passwords.newPass });
      setSuccess("Nywila imebadilishwa!");
      setPasswords({ current: "", newPass: "", confirm: "" });
    } catch (err) {
      setError(err.response?.data?.detail || "Hitilafu. Jaribu tena.");
    } finally { setSaving(false); }
  };

  const inputStyle = {
    width: "100%", padding: "12px 14px", background: "#1a1a1a",
    border: "1px solid #3c3c3c", color: "#ffffff", fontSize: "14px",
    outline: "none", boxSizing: "border-box", transition: "border-color 0.15s",
  };
  const labelStyle = {
    display: "block", color: "#7e7e7e", fontSize: "10px",
    fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "7px",
  };

  const TABS = [
    { key: "profile",  label: "Wasifu Wangu" },
    { key: "password", label: "Badilisha Nywila" },
    { key: "info",     label: "Taarifa za Kijiji" },
  ];

  return (
    <div style={{ background: "#000000", minHeight: "100vh", color: "#ffffff" }}>
      <div className="m-stripe" />
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 32px" }}>

        {/* Header */}
        <p style={{ color: "#0066b1", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "10px" }}>
          Akaunti
        </p>
        <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, textTransform: "uppercase", marginBottom: "8px" }}>
          Mipangilio
        </h1>
        <p style={{ color: "#bbbbbb", fontSize: "14px", fontWeight: 300, marginBottom: "32px" }}>
          Simamia wasifu wako na mipangilio ya akaunti.
        </p>

        {/* Tab switcher */}
        <div style={{ display: "flex", gap: "1px", background: "#3c3c3c", marginBottom: "32px" }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => { setTab(t.key); setError(""); setSuccess(""); }}
              style={{
                flex: 1, padding: "12px", fontSize: "11px", fontWeight: 700,
                letterSpacing: "1px", textTransform: "uppercase",
                background: tab === t.key ? "#0066b1" : "#0d0d0d",
                color: tab === t.key ? "#ffffff" : "#7e7e7e",
                border: "none", cursor: "pointer", transition: "all 0.15s",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Alerts */}
        {success && (
          <div style={{ background: "#012010", border: "1px solid #0fa336", padding: "14px 20px", marginBottom: "24px", color: "#0fa336", fontSize: "13px" }}>
            ✅ {success}
          </div>
        )}
        {error && (
          <div style={{ background: "#2d0808", border: "1px solid #e74c3c", padding: "14px 20px", marginBottom: "24px", color: "#e74c3c", fontSize: "13px" }}>
            ⚠️ {error}
          </div>
        )}

        {/* Profile Tab */}
        {tab === "profile" && (
          <form onSubmit={saveProfile} style={{ background: "#0d0d0d", border: "1px solid #3c3c3c", padding: "32px" }}>
            <p style={{ color: "#ffffff", fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "24px" }}>
              Taarifa za Kibinafsi
            </p>

            {/* Role badge */}
            <div style={{ marginBottom: "24px", padding: "14px", background: "#0066b111", border: "1px solid #0066b133" }}>
              <p style={{ color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "4px" }}>Jukumu lako</p>
              <p style={{ color: "#0066b1", fontSize: "14px", fontWeight: 700 }}>Kiongozi wa Kijiji — {user?.village?.name}</p>
              <p style={{ color: "#7e7e7e", fontSize: "12px", marginTop: "2px" }}>@{user?.username}</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", marginBottom: "18px" }}>
              <div>
                <label style={labelStyle}>Jina la Kwanza</label>
                <input name="first_name" value={profile.first_name} onChange={handleProfileChange} placeholder="Jina" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Jina la Ukoo</label>
                <input name="last_name" value={profile.last_name} onChange={handleProfileChange} placeholder="Ukoo" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Barua Pepe</label>
                <input name="email" type="email" value={profile.email} onChange={handleProfileChange} placeholder="barua@mfano.com" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Nambari ya Simu</label>
                <input name="phone" value={profile.phone} onChange={handleProfileChange} placeholder="+255..." style={inputStyle} />
              </div>
            </div>

            <button type="submit" disabled={saving} style={{ padding: "0 32px", height: "44px", background: saving ? "#1a1a1a" : "#0066b1", border: "none", color: "#ffffff", fontSize: "12px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", cursor: saving ? "not-allowed" : "pointer" }}>
              {saving ? "Inahifadhi..." : "Hifadhi Mabadiliko"}
            </button>
          </form>
        )}

        {/* Password Tab */}
        {tab === "password" && (
          <form onSubmit={savePassword} style={{ background: "#0d0d0d", border: "1px solid #3c3c3c", padding: "32px" }}>
            <p style={{ color: "#ffffff", fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "24px" }}>
              Badilisha Nywila
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px", marginBottom: "24px" }}>
              <div>
                <label style={labelStyle}>Nywila Mpya *</label>
                <input name="newPass" type="password" value={passwords.newPass} onChange={handlePassChange} required placeholder="Nywila mpya (herufi 8+)" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Thibitisha Nywila Mpya *</label>
                <input name="confirm" type="password" value={passwords.confirm} onChange={handlePassChange} required placeholder="Rudia nywila mpya" style={inputStyle} />
              </div>
            </div>
            <button type="submit" disabled={saving} style={{ padding: "0 32px", height: "44px", background: saving ? "#1a1a1a" : "#0066b1", border: "none", color: "#ffffff", fontSize: "12px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", cursor: saving ? "not-allowed" : "pointer" }}>
              {saving ? "Inabadilisha..." : "Badilisha Nywila"}
            </button>
          </form>
        )}

        {/* Village Info Tab */}
        {tab === "info" && (
          <div style={{ background: "#0d0d0d", border: "1px solid #3c3c3c", padding: "32px" }}>
            <p style={{ color: "#ffffff", fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "24px" }}>
              Taarifa za Kijiji
            </p>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {[
                { label: "Jina la Kijiji",  value: user?.village?.name      || "—" },
                { label: "Wilaya",           value: user?.village?.district  || "—" },
                { label: "Mkoa",             value: user?.village?.region    || "—" },
                { label: "Idadi ya Watu",    value: user?.village?.population?.toLocaleString() || "—" },
                { label: "Kiongozi Wako",    value: `@${user?.username}` },
                { label: "Jukumu",           value: "Kiongozi wa Kijiji" },
              ].map(row => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid #1a1a1a" }}>
                  <span style={{ color: "#7e7e7e", fontSize: "12px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>{row.label}</span>
                  <span style={{ color: "#ffffff", fontSize: "14px" }}>{row.value}</span>
                </div>
              ))}
            </div>
            <p style={{ color: "#3c3c3c", fontSize: "11px", marginTop: "20px" }}>
              Ili kubadilisha taarifa za kijiji, wasiliana na Msimamizi wa mfumo.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
