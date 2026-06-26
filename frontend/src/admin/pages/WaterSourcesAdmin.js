// src/admin/pages/WaterSourcesAdmin.jsx

import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import {
  getAllWaterSources,
  createWaterSource,
  updateWaterSource,
  deleteWaterSource,
} from "../utils/adminApi";

export default function WaterSourcesAdmin() {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSource, setEditingSource] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    source_type: "shallow_well",
    village_id: "",
    latitude: "",
    longitude: "",
    status: "safe",
    ph_level: "",
    bacteria_count: "",
  });

  useEffect(() => {
    fetchSources();
  }, []);

  const fetchSources = async () => {
    try {
      const response = await getAllWaterSources();
      setSources(response.data.results || response.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSource) {
        await updateWaterSource(editingSource.id, formData);
      } else {
        await createWaterSource(formData);
      }
      setShowModal(false);
      setEditingSource(null);
      fetchSources();
    } catch (error) {
      console.error("Error:", error);
      alert("Kuna hitilafu. Jaribu tena.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Una uhakika unataka kufuta chanzo hiki?")) return;
    try {
      await deleteWaterSource(id);
      fetchSources();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const openEditModal = (source) => {
    setEditingSource(source);
    setFormData({
      name: source.name,
      source_type: source.source_type,
      village_id: source.village?.id || "",
      latitude: source.latitude || "",
      longitude: source.longitude || "",
      status: source.status,
      ph_level: source.ph_level || "",
      bacteria_count: source.bacteria_count || "",
    });
    setShowModal(true);
  };

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

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Vyanzo vya Maji</h2>
        <button
          onClick={() => {
            setEditingSource(null);
            setFormData({
              name: "",
              source_type: "shallow_well",
              village_id: "",
              latitude: "",
              longitude: "",
              status: "safe",
              ph_level: "",
              bacteria_count: "",
            });
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <span>➕</span> Ongeza Chanzo
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Jina
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Aina
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Kijiji
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Hali
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                pH
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Vimelea
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Vitendo
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sources.map((source) => (
              <tr key={source.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {source.name}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {source.source_type_display}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {source.village?.name}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(source.status)}`}
                  >
                    {source.status_display}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {source.ph_level || "-"}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {source.bacteria_count || "-"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(source)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(source.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {editingSource ? "Hariri Chanzo" : "Ongeza Chanzo Kipya"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jina
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aina
                </label>
                <select
                  value={formData.source_type}
                  onChange={(e) =>
                    setFormData({ ...formData, source_type: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="shallow_well">Kisima cha Juu</option>
                  <option value="deep_well">Kisima cha Kina</option>
                  <option value="spring">Chemchem</option>
                  <option value="river">Mto</option>
                  <option value="dam">Bwawa</option>
                  <option value="borehole">Bomba la Kuchimba</option>
                  <option value="rainwater">Maji ya Mvua</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Latitudo
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) =>
                      setFormData({ ...formData, latitude: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Longitudo
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) =>
                      setFormData({ ...formData, longitude: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hali
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="safe">Salama</option>
                  <option value="caution">Tahadhari</option>
                  <option value="unsafe">Hatarini</option>
                  <option value="under_repair">Inatengenezwa</option>
                  <option value="dry">Kavu</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    pH
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.ph_level}
                    onChange={(e) =>
                      setFormData({ ...formData, ph_level: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vimelea (CFU/100ml)
                  </label>
                  <input
                    type="number"
                    value={formData.bacteria_count}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bacteria_count: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingSource ? "Hifadhi Mabadiliko" : "Ongeza"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
