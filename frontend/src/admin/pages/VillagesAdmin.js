import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { getAllVillages, createVillage, updateVillage, deleteVillage } from "../utils/adminApi";

export default function VillagesAdmin() {
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVillage, setEditingVillage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    district: "",
    region: "",
    population: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    fetchVillages();
  }, []);

  const fetchVillages = async () => {
    try {
      const response = await getAllVillages();
      setVillages(response.data.results || response.data);
    } catch (error) {
      console.error("Error fetching villages:", error);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (village) => {
    setEditingVillage(village);
    setFormData({
      name: village.name,
      district: village.district,
      region: village.region,
      population: village.population || "",
      latitude: village.latitude || "",
      longitude: village.longitude || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingVillage) {
        await updateVillage(editingVillage.id, formData);
      } else {
        await createVillage(formData);
      }
      setShowModal(false);
      setEditingVillage(null);
      fetchVillages();
    } catch (error) {
      console.error("Error saving village:", error);
      alert("Kuna hitilafu. Jaribu tena.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Una uhakika unataka kufuta kijiji hiki?")) return;
    try {
      await deleteVillage(id);
      fetchVillages();
    } catch (error) {
      console.error("Error deleting village:", error);
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Vijiji</h2>
        <button
          onClick={() => {
            setEditingVillage(null);
            setFormData({
              name: "",
              district: "",
              region: "",
              population: "",
              latitude: "",
              longitude: "",
            });
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <span>➕</span> Ongeza Kijiji
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jina</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Wilaya</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mkoa</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Idadi ya watu</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vitendo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {villages.map((village) => (
              <tr key={village.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{village.name}</td>
                <td className="px-6 py-4 text-gray-600">{village.district}</td>
                <td className="px-6 py-4 text-gray-600">{village.region}</td>
                <td className="px-6 py-4 text-gray-600">{village.population}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(village)} className="text-blue-600 hover:text-blue-800">✏️</button>
                    <button onClick={() => handleDelete(village.id)} className="text-red-600 hover:text-red-800">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">{editingVillage ? "Hariri Kijiji" : "Ongeza Kijiji"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jina</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Wilaya</label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mkoa</label>
                  <input
                    type="text"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Idadi ya watu</label>
                  <input
                    type="number"
                    value={formData.population}
                    onChange={(e) => setFormData({ ...formData, population: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Latitudo</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Longitudo</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Ghairi</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{editingVillage ? "Hifadhi Mabadiliko" : "Ongeza"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
