import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

export default function CreateReport() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [waterSources, setWaterSources] = useState([]);
  const [formData, setFormData] = useState({
    water_source_id: "",
    title: "",
    description: "",
    priority: "medium",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user?.village?.id) {
      fetchWaterSources();
    }
  }, [user]);

  const fetchWaterSources = async () => {
    try {
      const response = await api.get(`/water-sources/?village=${user.village.id}`);
      setWaterSources(response.data.results || response.data);
    } catch (error) {
      console.error("Error fetching water sources:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/damage-reports/", {
        water_source_id: formData.water_source_id,
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
      });
      setSuccess(true);
      setTimeout(() => navigate("/village-reports"), 1800);
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Kuna hitilafu. Tafadhali jaribu tena.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Ripoti imetumwa!</h2>
          <p className="text-gray-600">Tutafuatilia tatizo lako na kutuma kwa watendaji.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Anzisha Ripoti</h1>
      <p className="text-gray-600 mb-6">Tuma ripoti ya tatizo la maji kwa niaba ya raia wa kijiji chako.</p>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Chanzo cha maji</label>
          <select
            name="water_source_id"
            value={formData.water_source_id}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Chagua chanzo</option>
            {waterSources.map((source) => (
              <option key={source.id} value={source.id}>
                {source.name} ({source.status_display})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Kichwa cha ripoti</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Mfano: bomba limevunjika"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Maelezo</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={5}
            placeholder="Eleza tatizo kwa undani..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Kipaumbele</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Ndogo</option>
            <option value="medium">Wastani</option>
            <option value="high">Kubwa</option>
            <option value="critical">Dharura</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-medium px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Inatuma..." : "Tuma Ripoti"}
        </button>
      </form>
    </div>
  );
}
