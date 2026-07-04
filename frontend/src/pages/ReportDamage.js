import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function ReportDamage() {
  const navigate = useNavigate();
  const [waterSources, setWaterSources] = useState([]);
  const [formData, setFormData] = useState({ water_source_id: "", title: "", description: "", priority: "medium" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchWaterSources();
  }, []);

  const fetchWaterSources = async () => {
    try {
      const response = await api.get("/water-sources/");
      setWaterSources(response.data.results || response.data);
    } catch (error) { console.error(error); }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post(`/water-sources/${formData.water_source_id}/report_damage/`, {
        title: formData.title, description: formData.description, priority: formData.priority,
      });
      setSuccess(true);
      setTimeout(() => navigate("/map"), 2000);
    } catch (error) {
      console.error(error);
      alert("Kuna hitilafu. Tafadhali jaribu tena.");
    } finally { setLoading(false); }
  };

  if (success) {
    return (
      <div style={{ background: "#000000", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff" }}>
        <div style={{ background: "#0d0d0d", border: "1px solid #3c3c3c", padding: "64px 48px", textAlign: "center", maxWidth: "600px", width: "100%" }} className="animate-fade-in-up">
          <div style={{ width: "80px", height: "80px", background: "#0fa336", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 32px" }}>
            <svg style={{ width: "40px", height: "40px", color: "#000000" }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 style={{ fontSize: "28px", fontWeight: 700, textTransform: "uppercase", marginBottom: "16px" }}>Asante!</h2>
          <p style={{ color: "#7e7e7e", fontSize: "16px", fontWeight: 300 }}>Ripoti yako imetumwa kikamilifu.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#000000", minHeight: "100vh", color: "#ffffff" }}>
      <div className="m-stripe" />
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "64px 32px" }}>
        <div style={{ marginBottom: "48px" }} className="animate-fade-in-up">
          <p style={{ color: "#0066b1", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "10px" }}>Tuma Ripoti</p>
          <h1 style={{ color: "#ffffff", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, textTransform: "uppercase", lineHeight: 1.05 }}>Ripoti Uharibifu</h1>
          <p style={{ color: "#bbbbbb", fontSize: "14px", fontWeight: 300, marginTop: "12px" }}>Tuma taarifa za uharibifu wa vyanzo vya maji.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ background: "#0d0d0d", border: "1px solid #3c3c3c", padding: "48px" }} className="animate-fade-in-up flex flex-col gap-6">
          <div>
            <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>Chanzo cha Maji <span style={{ color: "#e22718" }}>*</span></label>
            <select name="water_source_id" required value={formData.water_source_id} onChange={handleChange} className="m-select">
              <option value="">Chagua chanzo...</option>
              {waterSources.map((source) => (
                <option key={source.id} value={source.id}>{source.name} - {source.village?.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>Kichwa <span style={{ color: "#e22718" }}>*</span></label>
            <input type="text" name="title" required placeholder="mf. Bomba limepasuka" value={formData.title} onChange={handleChange} className="m-input" />
          </div>

          <div>
            <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>Maelezo <span style={{ color: "#e22718" }}>*</span></label>
            <textarea name="description" required rows={4} placeholder="Eleza uharibifu kwa undani..." value={formData.description} onChange={handleChange} className="m-textarea" />
          </div>

          <div>
            <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "12px" }}>Daraja la Dharura</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { value: "low", label: "Ndogo" },
                { value: "medium", label: "Wastani" },
                { value: "high", label: "Kubwa" },
                { value: "critical", label: "Dharura" },
              ].map((option) => (
                <button
                  key={option.value} type="button"
                  onClick={() => setFormData({ ...formData, priority: option.value })}
                  style={{
                    padding: "12px", border: "1px solid #3c3c3c", borderRadius: "0", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", transition: "all 0.2s",
                    background: formData.priority === option.value ? "#1a1a1a" : "transparent",
                    color: formData.priority === option.value ? "#0066b1" : "#7e7e7e"
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-m-primary mt-4" style={{ height: "48px", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Inatuma..." : "Tuma Ripoti"}
          </button>
        </form>
      </div>
    </div>
  );
}
