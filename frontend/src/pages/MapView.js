import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import api from "../utils/api";

const getStatusColor = (status) => {
  switch (status) {
    case "safe":
      return "bg-green-500";
    case "caution":
      return "bg-yellow-500";
    case "unsafe":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const getStatusText = (status) => {
  switch (status) {
    case "safe":
      return "Salama";
    case "caution":
      return "Tahadhari";
    case "unsafe":
      return "Hatarini";
    default:
      return "Haijulikani";
  }
};

export default function MapView() {
  const [waterSources, setWaterSources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWaterSources();
  }, []);

  const fetchWaterSources = async () => {
    try {
      const response = await api.get("/water-sources/");
      setWaterSources(response.data.results || response.data);
    } catch (error) {
      console.error("Error fetching water sources:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-lg overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Vyanzo vya Maji</h2>
          <p className="text-sm text-gray-600 mt-1">
            Angalia vyanzo vilivyo karibu
          </p>
        </div>

        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Inapakia...</div>
          ) : waterSources.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Hakuna vyanzo vilivyopatikana
            </div>
          ) : (
            waterSources.map((source) => (
              <div key={source.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {source.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {source.village?.name}
                    </p>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white mt-2 ${getStatusColor(source.status)}`}
                    >
                      {getStatusText(source.status)}
                    </span>
                  </div>
                </div>
                <div className="mt-2">
                  <Link
                    to={`/source/${source.id}`}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Angalia Zaidi →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={[-6.8, 39.28]}
          zoom={12}
          className="h-full w-full"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {waterSources.map(
            (source) =>
              source.location && (
                <Marker
                  key={source.id}
                  position={[
                    source.location.coordinates[1],
                    source.location.coordinates[0],
                  ]}
                >
                  <Popup>
                    <div className="p-2 min-w-[200px]">
                      <h3 className="font-bold text-lg mb-1">{source.name}</h3>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white mb-2 ${getStatusColor(source.status)}`}
                      >
                        {getStatusText(source.status)}
                      </span>
                      <Link
                        to={`/source/${source.id}`}
                        className="block w-full text-center bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
                      >
                        Angalia Maelezo
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              ),
          )}
        </MapContainer>
      </div>
    </div>
  );
}
