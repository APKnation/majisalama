import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

export default function WaterOfficerSources() {
  const { user } = useAuth();
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSources();
  }, []);

  const fetchSources = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/water-sources/?managed_by=${user?.id}`);
      setSources(response.data.results || response.data);
    } catch (error) {
      console.error("Error fetching sources:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Vyanzo Vilivyopewa</h1>
        <p className="text-gray-600">Tazama vyanzo vya maji unavyosimamia na tathmini hali zao.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        {loading ? (
          <p className="text-gray-600">Inapakia vyanzo...</p>
        ) : sources.length === 0 ? (
          <p className="text-gray-600">Hakuna vyanzo vilivyopewa kwako.</p>
        ) : (
          <div className="grid gap-4">
            {sources.map((source) => (
              <div key={source.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{source.name}</h2>
                    <p className="text-sm text-gray-600">Aina: {source.source_type_display}</p>
                    <p className="text-sm text-gray-500">Hali: {source.status_display}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Ukaguzi wa mwisho: {source.last_tested ? new Date(source.last_tested).toLocaleDateString() : "Hakuna"}</p>
                    <p className="text-sm text-gray-500">Maji safi: {source.latest_quality ? (source.latest_quality.is_safe ? "Ndiyo" : "Hapana") : "Hakuna taarifa"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
