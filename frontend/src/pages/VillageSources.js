import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

export default function VillageSources() {
  const { user } = useAuth();
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Vyanzo vya Maji</h1>
        <p className="text-gray-600 mt-2">Orodha ya vyanzo vya maji ndani ya kijiji chako.</p>
      </div>

      {loading ? (
        <div className="text-gray-600">Inapakia...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {sources.map((source) => (
            <div key={source.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">{source.name}</h2>
              <p className="mt-2 text-gray-600">Aina: {source.source_type_display}</p>
              <p className="mt-1 text-gray-600">Hali: {source.status_display}</p>
              <p className="mt-1 text-gray-600">Ph: {source.ph_level ?? 'N/A'}</p>
              <p className="mt-1 text-gray-600">Bakteria: {source.bacteria_count ?? 'N/A'}</p>
            </div>
          ))}
          {sources.length === 0 && !loading && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 text-gray-600">
              Hakuna vyanzo vya maji vilivyoorodheshwa kwa kijiji chako.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
