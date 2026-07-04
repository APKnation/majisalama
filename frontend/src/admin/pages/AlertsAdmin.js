import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { getAllAlerts, getAllWaterSources, createAlert, updateAlert, deleteAlert } from "../utils/adminApi";

const ALERT_TYPES = [
  { value: "quality_drop", label: "Ubora Umeshuka" },
  { value: "source_dry", label: "Chanzo Kimekauka" },
  { value: "damage", label: "Uharibifu" },
  { value: "maintenance_due", label: "Usafishaji Umekaribia" },
  { value: "general", label: "Ujumbe Mkuu" },
];

export default function AlertsAdmin() {
  const [alerts, setAlerts] = useState([]);
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [formData, setFormData] = useState({
    alert_type: "general",
    message: "",
    water_source_id: "",
  });

  useEffect(() => {
    fetchAlerts();
    fetchSources();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await getAllAlerts();
      setAlerts(response.data.results || response.data);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSources = async () => {
    try {
      const response = await getAllWaterSources();
      setSources(response.data.results || response.data);
    } catch (error) {
      console.error("Error fetching sources:", error);
    }
  };

  const handleOpenModal = (alert = null) => {
    if (alert) {
      setSelectedAlert(alert);
      setFormData({
        alert_type: alert.alert_type,
        message: alert.message,
        water_source_id: alert.water_source ? alert.water_source.id : "",
      });
    } else {
      setSelectedAlert(null);
      setFormData({ alert_type: "general", message: "", water_source_id: "" });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        alert_type: formData.alert_type,
        message: formData.message,
        water_source_id: formData.water_source_id || null,
      };

      if (selectedAlert) {
        await updateAlert(selectedAlert.id, payload);
      } else {
        await createAlert(payload);
      }
      
      setShowModal(false);
      setFormData({ alert_type: "general", message: "", water_source_id: "" });
      setSelectedAlert(null);
      fetchAlerts();
    } catch (error) {
      console.error("Error saving alert:", error);
      alert("Kuna hitilafu. Jaribu tena.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Je, una uhakika unataka kufuta arifa hii?")) {
      try {
        await deleteAlert(id);
        fetchAlerts();
      } catch (error) {
        console.error("Error deleting alert:", error);
        alert("Kuna hitilafu wakati wa kufuta.");
      }
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Arifa</h2>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <span>➕</span> Tengeneza Arifa
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aina</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ujumbe</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chanzo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarehe</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vitendo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {alerts.map((alert) => (
              <tr key={alert.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {ALERT_TYPES.find(t => t.value === alert.alert_type)?.label || alert.alert_type}
                </td>
                <td className="px-6 py-4 text-gray-600">{alert.message}</td>
                <td className="px-6 py-4 text-gray-600">{alert.water_source?.name || "-"}</td>
                <td className="px-6 py-4 text-gray-600">{new Date(alert.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm font-medium">
                  <button
                    onClick={() => handleOpenModal(alert)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Badili
                  </button>
                  <button
                    onClick={() => handleDelete(alert.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Futa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">{selectedAlert ? "Badili Arifa" : "Tengeneza Arifa"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Aina ya arifa</label>
                <select
                  value={formData.alert_type}
                  onChange={(e) => setFormData({ ...formData, alert_type: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  {ALERT_TYPES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ujumbe</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows="4"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chanzo cha maji</label>
                <select
                  value={formData.water_source_id}
                  onChange={(e) => setFormData({ ...formData, water_source_id: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Haijawekwa</option>
                  {sources.map((source) => (
                    <option key={source.id} value={source.id}>{source.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Ghairi</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{selectedAlert ? "Hifadhi" : "Tuma"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
