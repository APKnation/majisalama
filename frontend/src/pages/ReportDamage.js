import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function ReportDamage() {
  const navigate = useNavigate();
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
    fetchWaterSources();
  }, []);

  const fetchWaterSources = async () => {
    try {
      const response = await api.get("/water-sources/");
      setWaterSources(response.data.results || response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post(
        `/water-sources/${formData.water_source_id}/report_damage/`,
        {
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
        },
      );

      setSuccess(true);
      setTimeout(() => navigate("/map"), 2000);
    } catch (error) {
      console.error("Error:", error);
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
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Asante!</h2>
          <p className="text-gray-600">Ripoti yako imetumwa kikamilifu.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Ripoti Uharibifu
      </h1>
      <p className="text-gray-600 mb-8">
        Tuma taarifa za uharibifu wa vyanzo vya maji
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-2xl shadow-sm"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chanzo cha Maji <span className="text-red-500">*</span>
          </label>
          <select
            name="water_source_id"
            required
            value={formData.water_source_id}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Chagua chanzo...</option>
            {waterSources.map((source) => (
              <option key={source.id} value={source.id}>
                {source.name} - {source.village?.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kichwa <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            required
            placeholder="mf. Bomba limepasuka"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maelezo <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            required
            rows={4}
            placeholder="Eleza uharibifu kwa undani..."
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Daraja la Dharura
          </label>
          <div className="grid grid-cols-4 gap-3">
            {[
              {
                value: "low",
                label: "Ndogo",
                color: "bg-green-100 text-green-800",
              },
              {
                value: "medium",
                label: "Wastani",
                color: "bg-yellow-100 text-yellow-800",
              },
              {
                value: "high",
                label: "Kubwa",
                color: "bg-orange-100 text-orange-800",
              },
              {
                value: "critical",
                label: "Dharura",
                color: "bg-red-100 text-red-800",
              },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  setFormData({ ...formData, priority: option.value })
                }
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  formData.priority === option.value
                    ? option.color + " ring-2 ring-offset-2 ring-blue-500"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Inatuma..." : "Tuma Ripoti"}
        </button>
      </form>
    </div>
  );
}
