import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import {
  getAllUsers,
  getAllVillages,
  createUser,
  updateUser,
  deleteUser,
} from "../utils/adminApi";

const ROLE_OPTIONS = [
  { value: "citizen", label: "Mwananchi" },
  { value: "village_leader", label: "Kiongozi wa Kijiji" },
  { value: "water_officer", label: "Wafanyakazi wa Maji" },
  { value: "district_officer", label: "Mfanyikazi wa Wilaya" },
  { value: "admin", label: "Msimamizi" },
];

export default function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    role: "citizen",
    village_id: "",
    password: "",
  });

  useEffect(() => {
    fetchUsers();
    fetchVillages();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data.results || response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVillages = async () => {
    try {
      const response = await getAllVillages();
      setVillages(response.data.results || response.data);
    } catch (error) {
      console.error("Error fetching villages:", error);
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email || "",
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      phone: user.phone || "",
      role: user.role || "citizen",
      village_id: user.village?.id || "",
      password: "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await updateUser(editingUser.id, formData);
      } else {
        await createUser(formData);
      }
      setShowModal(false);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Kuna hitilafu. Jaribu tena.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Una uhakika unataka kufuta mtumiaji huyu?")) return;
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Watumiaji</h2>
        <button
          onClick={() => {
            setEditingUser(null);
            setFormData({
              username: "",
              email: "",
              first_name: "",
              last_name: "",
              phone: "",
              role: "citizen",
              village_id: "",
              password: "",
            });
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <span>➕</span> Ongeza Mtumiaji
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jina la mtumiaji</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Barua pepe</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jina</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kijiji</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sehemu</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kitendo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{user.username}</td>
                <td className="px-6 py-4 text-gray-600">{user.email || "-"}</td>
                <td className="px-6 py-4 text-gray-600">{user.first_name} {user.last_name}</td>
                <td className="px-6 py-4 text-gray-600">{user.village?.name || "-"}</td>
                <td className="px-6 py-4 capitalize text-gray-600">{user.role}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(user)} className="text-blue-600 hover:text-blue-800">✏️</button>
                    <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-800">🗑️</button>
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
            <h3 className="text-xl font-bold mb-4">
              {editingUser ? "Hariri Mtumiaji" : "Ongeza Mtumiaji"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jina la mtumiaji</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Barua pepe</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jina</label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jina la mwisho</label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Simu</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sehemu</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {ROLE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kijiji</label>
                  <select
                    value={formData.village_id}
                    onChange={(e) => setFormData({ ...formData, village_id: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">Chagua kijiji</option>
                    {villages.map((village) => (
                      <option key={village.id} value={village.id}>
                        {village.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nenosiri</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                  {editingUser ? "Hifadhi Mabadiliko" : "Ongeza"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
