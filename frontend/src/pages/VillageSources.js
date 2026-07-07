import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

// ── Status badge ─────────────────────────────────────────────────────
function StatusBadge({ status, label }) {
  const map = {
    safe:        { color: "#0fa336", bg: "#012010" },
    caution:     { color: "#f4b400", bg: "#2a2200" },
    unsafe:      { color: "#e22718", bg: "#2e0800" },
    under_repair:{ color: "#1c69d4", bg: "#001a3e" },
    dry:         { color: "#7e7e7e", bg: "#1a1a1a" },
  };
  const s = map[status] || { color: "#7e7e7e", bg: "#1a1a1a" };
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        background: s.bg,
        color: s.color,
        fontSize: "10px",
        fontWeight: 700,
        letterSpacing: "1px",
        textTransform: "uppercase",
        border: `1px solid ${s.color}33`,
      }}
    >
      {label || status}
    </span>
  );
}

// ── Spec row ─────────────────────────────────────────────────────────
function SpecRow({ label, value }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 0",
        borderBottom: "1px solid #1a1a1a",
      }}
    >
      <span
        style={{
          color: "#7e7e7e",
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "1.5px",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <span style={{ color: "#e6e6e6", fontSize: "14px", fontWeight: 300 }}>
        {value ?? "—"}
      </span>
    </div>
  );
}

export default function VillageSources() {
  const { user } = useAuth();
  const [sources, setSources] = useState([]);
  const [view, setView] = useState("grid"); // "grid" | "table"
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    name: "", source_type: "shallow_well", status: "safe",
    ph_level: "", bacteria_count: "", iron_level: ""
  });


  useEffect(() => {
    if (user?.village?.id) {
      fetchSources();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchSources = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/water-sources/?village=${user.village.id}`);
      setSources(response.data.results || response.data);
    } catch (error) {
      console.error("Error fetching water sources:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true); setError(""); setSuccess("");
    try {
      const payload = {
        ...form,
        village_id: user?.village?.id,
        ph_level: form.ph_level || null,
        bacteria_count: form.bacteria_count || null,
        iron_level: form.iron_level || null,
      };
      await api.post("/water-sources/", payload);
      setSuccess("Chanzo kipya kimeongezwa kikamilifu!");
      setShowForm(false);
      setForm({ name: "", source_type: "shallow_well", status: "safe", ph_level: "", bacteria_count: "", iron_level: "" });
      fetchSources();
    } catch (e) {
      setError(e.response?.data?.detail || "Hitilafu imetokea. Tafadhali jaribu tena.");
    } finally { setSaving(false); }
  };

  const inputStyle = {
    width: "100%", padding: "12px 14px", background: "#1a1a1a",
    border: "1px solid #3c3c3c", color: "#ffffff", fontSize: "14px",
    outline: "none", boxSizing: "border-box",
  };
  const labelStyle = {
    display: "block", color: "#7e7e7e", fontSize: "10px",
    fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "7px",
  };

  // ── Loading skeleton ───────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ background: "#000000", minHeight: "100vh", padding: "40px 32px" }}>
        <div className="m-stripe" style={{ marginBottom: "40px" }} />
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px"
          style={{ background: "#3c3c3c" }}
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} style={{ background: "#0d0d0d", padding: "28px" }}>
              <div style={{ height: "10px", background: "#1a1a1a", width: "40%", marginBottom: "16px" }} />
              <div style={{ height: "24px", background: "#1a1a1a", width: "70%", marginBottom: "12px" }} />
              <div style={{ height: "10px", background: "#1a1a1a", width: "55%" }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#000000", minHeight: "100vh", color: "#ffffff" }}>
      {/* ─── M STRIPE ─── */}
      <div className="m-stripe" />

      {/* ─── HEADER BAR ─── */}
      <div
        style={{
          background: "#0d0d0d",
          borderBottom: "1px solid #3c3c3c",
          padding: "0 32px",
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div className="flex items-center gap-4">
          <div className="m-stripe" style={{ width: "24px", height: "3px" }} />
          <p style={{ color: "#ffffff", fontSize: "12px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase" }}>
            Vyanzo vya Maji
          </p>
        </div>
        {/* View toggle */}
        <div className="flex items-center gap-1">
          {["grid", "table"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                padding: "6px 14px",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                cursor: "pointer",
                background: view === v ? "#ffffff" : "transparent",
                color: view === v ? "#000000" : "#7e7e7e",
                border: "1px solid",
                borderColor: view === v ? "#ffffff" : "#3c3c3c",
                transition: "all 0.15s ease",
              }}
            >
              {v === "grid" ? "⊞ Grid" : "≡ Jedwali"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "40px 32px" }}>

        {/* ─── PAGE TITLE ─── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "40px", flexWrap: "wrap", gap: "16px" }} className="animate-fade-in-up">
          <div>
            <p style={{ color: "#0066b1", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "10px" }}>
              {user?.village?.name || "Kijiji"} · {user?.village?.district}
            </p>
            <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, textTransform: "uppercase", lineHeight: 1.05, marginBottom: "8px" }}>
              Vyanzo vya Maji
            </h1>
            <p style={{ color: "#bbbbbb", fontSize: "14px", fontWeight: 300 }}>
              Orodha ya vyanzo vya maji ndani ya kijiji chako — vyanzo {sources.length} vinapatikana.
            </p>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setError(""); setSuccess(""); }}
            style={{
              padding: "0 24px", height: "42px", background: showForm ? "transparent" : "#0066b1",
              color: showForm ? "#7e7e7e" : "#ffffff", border: `1px solid ${showForm ? "#3c3c3c" : "#0066b1"}`,
              fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase",
              cursor: "pointer", transition: "all 0.15s",
            }}
          >
            {showForm ? "✕ Ghairi" : "+ Ongeza Chanzo"}
          </button>
        </div>

        {/* Success */}
        {success && (
          <div style={{ background: "#012010", border: "1px solid #0fa336", padding: "14px 20px", marginBottom: "20px", color: "#0fa336", fontSize: "13px" }}>
            ✅ {success}
          </div>
        )}

        {/* Add Source Form */}
        {showForm && (
          <form onSubmit={handleSubmit} style={{ background: "#0d0d0d", border: "1px solid #3c3c3c", padding: "32px", marginBottom: "32px" }} className="animate-fade-in-up">
            <p style={{ color: "#ffffff", fontSize: "14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "24px" }}>
              Chanzo Kipya Cha Maji
            </p>
            {error && (
              <div style={{ background: "#2d0808", border: "1px solid #e74c3c", padding: "12px 16px", marginBottom: "20px", color: "#e74c3c", fontSize: "13px" }}>
                ⚠️ {error}
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "18px", marginBottom: "24px" }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Jina la Chanzo *</label>
                <input name="name" value={form.name} onChange={handleChange} required placeholder="Mfano: Kisima cha Kati" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Aina ya Chanzo *</label>
                <select name="source_type" value={form.source_type} onChange={handleChange} style={inputStyle}>
                  <option value="shallow_well">Kisima cha Juu</option>
                  <option value="deep_well">Kisima cha Kina</option>
                  <option value="spring">Chemchem</option>
                  <option value="river">Mto</option>
                  <option value="dam">Bwawa</option>
                  <option value="borehole">Bomba la Kuchimba</option>
                  <option value="rainwater">Maji ya Mvua</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Hali ya Chanzo *</label>
                <select name="status" value={form.status} onChange={handleChange} style={inputStyle}>
                  <option value="safe">Salama</option>
                  <option value="caution">Tahadhari</option>
                  <option value="unsafe">Hatarini</option>
                  <option value="under_repair">Inatengenezwa</option>
                  <option value="dry">Kavu</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Kiwango cha pH</label>
                <input name="ph_level" type="number" step="0.01" value={form.ph_level} onChange={handleChange} placeholder="Hiari (K.m. 7.2)" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Bakteria (cfu/100ml)</label>
                <input name="bacteria_count" type="number" value={form.bacteria_count} onChange={handleChange} placeholder="Hiari (K.m. 0)" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Kiwango cha Chuma (mg/L)</label>
                <input name="iron_level" type="number" step="0.01" value={form.iron_level} onChange={handleChange} placeholder="Hiari (K.m. 0.1)" style={inputStyle} />
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: "0 24px", height: "42px", background: "transparent", border: "1px solid #3c3c3c", color: "#7e7e7e", fontSize: "12px", fontWeight: 700, cursor: "pointer", textTransform: "uppercase", letterSpacing: "1px" }}>
                Ghairi
              </button>
              <button type="submit" disabled={saving} style={{ padding: "0 32px", height: "42px", background: saving ? "#1a1a1a" : "#0066b1", border: "none", color: "#ffffff", fontSize: "12px", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", textTransform: "uppercase", letterSpacing: "1px" }}>
                {saving ? "Inahifadhi..." : "Ongeza Chanzo"}
              </button>
            </div>
          </form>
        )}

        {/* ─── SUMMARY STATS ─── */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-px mb-10"
          style={{ background: "#3c3c3c" }}
        >
          {[
            { label: "Jumla",     value: sources.length,                                            accent: "#0066b1" },
            { label: "Salama",    value: sources.filter((s) => s.status === "safe").length,         accent: "#0fa336" },
            { label: "Tahadhari", value: sources.filter((s) => s.status === "caution").length,      accent: "#f4b400" },
            { label: "Hatarini",  value: sources.filter((s) => s.status === "unsafe").length,       accent: "#e22718" },
          ].map(({ label, value, accent }) => (
            <div
              key={label}
              style={{ background: "#000000", borderTop: `2px solid ${accent}`, padding: "20px 24px" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#0d0d0d")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#000000")}
            >
              <p style={{ color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "10px" }}>
                {label}
              </p>
              <p style={{ color: "#ffffff", fontSize: "36px", fontWeight: 700, lineHeight: 1 }}>{value}</p>
            </div>
          ))}
        </div>

        {/* ─── EMPTY STATE ─── */}
        {sources.length === 0 && (
          <div
            style={{
              border: "1px solid #3c3c3c",
              padding: "64px 32px",
              textAlign: "center",
            }}
          >
            <p style={{ color: "#7e7e7e", fontSize: "14px", fontWeight: 300, marginBottom: "4px" }}>
              Hakuna vyanzo vya maji vilivyoorodheshwa kwa kijiji chako.
            </p>
            {!user?.village && (
              <p style={{ color: "#e22718", fontSize: "12px", fontWeight: 300 }}>
                Akaunti yako haihusiani na kijiji chochote.
              </p>
            )}
          </div>
        )}

        {/* ─── GRID VIEW ─── */}
        {view === "grid" && sources.length > 0 && (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px animate-fade-in-up"
            style={{ background: "#3c3c3c" }}
          >
            {sources.map((source) => (
              <div
                key={source.id}
                style={{ background: "#0d0d0d", padding: "28px", transition: "background 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#1a1a1a")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#0d0d0d")}
              >
                {/* Card header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                  <p style={{ color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase" }}>
                    {source.source_type_display}
                  </p>
                  <StatusBadge status={source.status} label={source.status_display} />
                </div>

                {/* Source name */}
                <h2 style={{ color: "#ffffff", fontSize: "20px", fontWeight: 700, textTransform: "uppercase", lineHeight: 1.2, marginBottom: "20px" }}>
                  {source.name}
                </h2>

                {/* Spec list */}
                <div>
                  <SpecRow label="Ph" value={source.ph_level} />
                  <SpecRow label="Bakteria (cfu/100ml)" value={source.bacteria_count} />
                  <SpecRow label="Tarehe ya Upimaji" value={source.last_tested ? new Date(source.last_tested).toLocaleDateString("sw-TZ") : null} />
                  <SpecRow label="Usafi wa Mwisho" value={source.last_cleaned ? new Date(source.last_cleaned).toLocaleDateString("sw-TZ") : null} />
                </div>

                {/* pH safety indicator */}
                {source.ph_level && (
                  <div style={{ marginTop: "16px" }}>
                    <div style={{ height: "2px", background: "#1a1a1a", width: "100%", position: "relative" }}>
                      <div
                        style={{
                          position: "absolute",
                          height: "2px",
                          width: `${Math.min(100, (parseFloat(source.ph_level) / 14) * 100)}%`,
                          background: parseFloat(source.ph_level) >= 6.5 && parseFloat(source.ph_level) <= 8.5 ? "#0fa336" : "#e22718",
                        }}
                      />
                    </div>
                    <p style={{ color: "#7e7e7e", fontSize: "10px", fontWeight: 300, marginTop: "4px" }}>
                      pH {source.ph_level} — {parseFloat(source.ph_level) >= 6.5 && parseFloat(source.ph_level) <= 8.5 ? "Kiwango cha Kawaida" : "Nje ya Kiwango"}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ─── TABLE VIEW ─── */}
        {view === "table" && sources.length > 0 && (
          <div style={{ border: "1px solid #3c3c3c", overflowX: "auto" }} className="animate-fade-in-up">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #3c3c3c", background: "#0d0d0d" }}>
                  {["Jina", "Aina", "Hali", "Ph", "Bakteria", "Upimaji wa Mwisho"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        color: "#7e7e7e",
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "1.5px",
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sources.map((source) => (
                  <tr
                    key={source.id}
                    style={{ borderBottom: "1px solid #1a1a1a", transition: "background 0.12s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#0d0d0d")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "14px 16px", color: "#ffffff", fontSize: "14px", fontWeight: 700, whiteSpace: "nowrap" }}>
                      {source.name}
                    </td>
                    <td style={{ padding: "14px 16px", color: "#bbbbbb", fontSize: "13px", fontWeight: 300 }}>
                      {source.source_type_display}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <StatusBadge status={source.status} label={source.status_display} />
                    </td>
                    <td style={{ padding: "14px 16px", color: "#bbbbbb", fontSize: "13px", fontWeight: 300 }}>
                      {source.ph_level ?? "—"}
                    </td>
                    <td style={{ padding: "14px 16px", color: "#bbbbbb", fontSize: "13px", fontWeight: 300 }}>
                      {source.bacteria_count ?? "—"}
                    </td>
                    <td style={{ padding: "14px 16px", color: "#7e7e7e", fontSize: "12px", fontWeight: 300, whiteSpace: "nowrap" }}>
                      {source.last_tested ? new Date(source.last_tested).toLocaleDateString("sw-TZ") : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
