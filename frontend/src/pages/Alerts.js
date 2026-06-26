import React, { useState, useEffect } from "react";
import api from "../utils/api";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await api.get("/alerts/");
      setAlerts(response.data.results || response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case "quality_drop":
        return "bg-red-100 text-red-800";
      case "damage":
        return "bg-orange-100 text-orange-800";
      case "maintenance_due":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Arifa</h1>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-lg ${getAlertColor(alert.alert_type)}`}
          >
            <p className="font-medium">{alert.alert_type_display}</p>
            <p className="text-sm mt-1">{alert.message}</p>
            <p className="text-xs mt-2 opacity-75">
              {new Date(alert.created_at).toLocaleDateString("sw-TZ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
