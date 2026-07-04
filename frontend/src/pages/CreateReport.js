import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

export default function CreateReport() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [waterSources, setWaterSources] = useState([]);
  const [formData, setFormData] = useState({ water_source_id: "", title: "", description: "", priority: "medium" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user?.village?.id) fetchWaterSources();
  }, [user]);

  const fetchWaterSources = async () => {
    try {
      const response = await api.get(`/water-sources/?village=${user.village.id}`);
      setWaterSources(response.data.results || response.data);
    } catch (error) { console.error(error); }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/damage-reports/", formData);
      setSuccess(true);
      setTimeout(() => navigate("/village-reports"), 1800);
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
          <h2 style={{ fontSize: "28px", fontWeight: 700, textTransform: "uppercase", marginBottom: "16px" }}>Ripoti Imetumwa!</h2>
          <p style={{ color: "#7e7e7e", fontSize: "16px", fontWeight: 300 }}>Tutafuatilia tatizo lako na kutuma kwa watendaji.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#000000", minHeight: "100vh", color: "#ffffff" }}>
      <div className="m-stripe" />
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "64px 32px" }}>
        <div style={{ marginBottom: "48px" }} className="animate-fade-in-up">
          <p style={{ color: "#0066b1", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "10px" }}>Ripoti Mpya</p>
          <h1 style={{ color: "#ffffff", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, textTransform: "uppercase", lineHeight: 1.05 }}>Anzisha Ripoti</h1>
          <p style={{ color: "#bbbbbb", fontSize: "14px", fontWeight: 300, marginTop: "12px" }}>Tuma ripoti ya tatizo la maji kwa niaba ya raia wa kijiji chako.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ background: "#0d0d0d", border: "1px solid #3c3c3c", padding: "48px" }} className="animate-fade-in-up flex flex-col gap-6">
          <div>
            <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>Chanzo cha maji</label>
            <select name="water_source_id" value={formData.water_source_id} onChange={handleChange} required className="m-select">
              <option value="">Chagua chanzo</option>
              {waterSources.map((source) => (
                <option key={source.id} value={source.id}>
                  {source.name} ({source.status_display})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>Kichwa cha ripoti</label>
            <input name="title" value={formData.title} onChange={handleChange} required placeholder="Mfano: bomba limevunjika" className="m-input" />
          </div>

          <div>
            <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>Maelezo</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required rows={5} placeholder="Eleza tatizo kwa undani..." className="m-textarea" />
          </div>

          <div>
            <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>Kipaumbele</label>
            <select name="priority" value={formData.priority} onChange={handleChange} className="m-select">
              <option value="low">Ndogo</option>
              <option value="medium">Wastani</option>
              <option value="high">Kubwa</option>
              <option value="critical">Dharura</option>
            </select>
          </div>

          <button type="submit" disabled={loading} className="btn-m-primary mt-4" style={{ height: "48px", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Inatuma..." : "Tuma Ripoti"}
          </button>
        </form>
      </div>
    </div>
  );
}
