import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/api";

const getStatusColor = (status) => {
  switch (status) {
    case "safe":
      return "bg-green-100 text-green-800";
    case "caution":
      return "bg-yellow-100 text-yellow-800";
    case "unsafe":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function WaterSourceDetail() {
  const { id } = useParams();
  const [source, setSource] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSource();
  }, [id]);

  const fetchSource = async () => {
    try {
      const response = await api.get(`/water-sources/${id}/`);
      setSource(response.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Inapakia...</div>;
  if (!source)
    return <div className="p-8 text-center">Chanzo hakipatikani</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-4">
        <Link to="/map" className="text-blue-600 hover:text-blue-800">
          ← Rudi kwenye Ramani
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {source.image && (
          <img
            src={source.image}
            alt={source.name}
            className="w-full h-64 object-cover"
          />
        )}

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{source.name}</h1>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(source.status)}`}
            >
              {source.status_display}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Aina</h3>
              <p className="text-gray-900">{source.source_type_display}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Kijiji</h3>
              <p className="text-gray-900">{source.village?.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">pH</h3>
              <p className="text-gray-900">{source.ph_level || "Haijapimwa"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Vimelea
              </h3>
              <p className="text-gray-900">
                {source.bacteria_count || "Haijapimwa"} CFU/100ml
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Usafishaji Mwisho
              </h3>
              <p className="text-gray-900">
                {source.last_cleaned || "Haijarekodiwa"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Upimaji Mwisho
              </h3>
              <p className="text-gray-900">
                {source.last_tested || "Haijapimwa"}
              </p>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <Link
              to="/report"
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
            >
              Ripoti Uharibifu
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
