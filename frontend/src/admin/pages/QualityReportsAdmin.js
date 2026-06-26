import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { getAllQualityReports, getAllWaterSources, createQualityReport } from "../utils/adminApi";

export default function QualityReportsAdmin() {
  const [qualityReports, setQualityReports] = useState([]);
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    water_source_id: "",
    ph_level: "",
    bacteria_count: "",
    iron_level: "",
    turbidity: "",
    chlorine_level: "",
    is_safe: true,
    notes: "",
  });

  useEffect(() => {
    fetchReports();
    fetchSources();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await getAllQualityReports();
      setQualityReports(response.data.results || response.data);
    } catch (error) {
      console.error("Error fetching quality reports:", error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createQualityReport(formData);
      setShowModal(false);
      setFormData({
        water_source_id: "",
        ph_level: "",
        bacteria_count: "",
        iron_level: "",
        turbidity: "",
        chlorine_level: "",
        is_safe: true,
        notes: "",
      });
      fetchReports();
    } catch (error) {
      console.error("Error saving quality report:", error);
      alert("Kuna hitilafu. Jaribu tena.");
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Ripoti za Ubora</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <span>➕</span> Ongeza Ripoti
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chanzo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">pH</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vimelea</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Iron</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Turbidity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarehe</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salama</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {qualityReports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{report.water_source?.name}</td>
                <td className="px-6 py-4 text-gray-600">{report.ph_level}</td>
                <td className="px-6 py-4 text-gray-600">{report.bacteria_count}</td>
                <td className="px-6 py-4 text-gray-600">{report.iron_level}</td>
                <td className="px-6 py-4 text-gray-600">{report.turbidity}</td>
                <td className="px-6 py-4 text-gray-600">{new Date(report.test_date).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-gray-600">{report.is_safe ? "Ndiyo" : "Hapana"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Ongeza Ripoti ya Ubora</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chanzo cha maji</label>
                <select
                  value={formData.water_source_id}
                  onChange={(e) => setFormData({ ...formData, water_source_id: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  <option value="">Chagua chanzo</option>
                  {sources.map((source) => (
                    <option key={source.id} value={source.id}>{source.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">pH</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.ph_level}
                    onChange={(e) => setFormData({ ...formData, ph_level: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vimelea</label>
                  <input
                    type="number"
                    value={formData.bacteria_count}
                    onChange={(e) => setFormData({ ...formData, bacteria_count: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Iron</label>
                  <input
                    type="number"
                    step="0.001"
                    value={formData.iron_level}
                    onChange={(e) => setFormData({ ...formData, iron_level: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Turbidity</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.turbidity}
                    onChange={(e) => setFormData({ ...formData, turbidity: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Clorine</label>
                  <input
                    type="number"
                    step="0.001"
                    value={formData.chlorine_level}
                    onChange={(e) => setFormData({ ...formData, chlorine_level: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salama?</label>
                  <select
                    value={formData.is_safe ? "true" : "false"}
                    onChange={(e) => setFormData({ ...formData, is_safe: e.target.value === "true" })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="true">Ndiyo</option>
                    <option value="false">Hapana</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maelezo</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows="3"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Ghairi</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Hifadhi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
