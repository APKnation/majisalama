import React, { useState, useEffect } from "react";
import api from "../utils/api";

export default function Notifications() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const response = await api.get("/alerts/");
      setAlerts(response.data.results || response.data);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Arifa</h1>
        <p className="text-gray-600 mt-2">Angalia arifa za maji ambazo zimekuja kwa kijiji chako.</p>
      </div>

      {loading ? (
        <div className="text-gray-600">Inapakia arifa...</div>
      ) : alerts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-gray-600">
          Hakuna arifa mpya.
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex flex-col md:flex-row md:justify-between gap-2">
                <p className="font-semibold text-gray-900">{alert.alert_type_display}</p>
                <span className="text-sm text-gray-500">{new Date(alert.created_at).toLocaleString()}</span>
              </div>
              <p className="mt-3 text-gray-700">{alert.message}</p>
              {alert.water_source?.name && (
                <p className="mt-3 text-sm text-gray-500">Chanzo: {alert.water_source.name}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
