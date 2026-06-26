import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Messages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [folder, setFolder] = useState("inbox");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [formData, setFormData] = useState({ recipient_id: "", subject: "", body: "", related_report_id: "" });
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMessages();
    fetchWorkers();
  }, [folder]);

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/messages/?folder=${folder}`);
      setMessages(response.data.results || response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const fetchWorkers = async () => {
    try {
      const response = await api.get("/users/?role=water_officer");
      setWorkers(response.data.results || response.data);
    } catch (error) {
      console.error("Error fetching workers:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/messages/", formData);
      setFormData({ recipient_id: "", subject: "", body: "", related_report_id: "" });
      setFolder("sent");
      fetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Kuna hitilafu wakati wa kutuma ujumbe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ujumbe</h1>
          <p className="text-gray-600">Tuma ujumbe kwa watendaji au waangalizi wa maji.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFolder("inbox")}
            className={`px-4 py-2 rounded-lg ${folder === "inbox" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
          >
            Sanduku la Kuingia
          </button>
          <button
            onClick={() => setFolder("sent")}
            className={`px-4 py-2 rounded-lg ${folder === "sent" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
          >
            Zamani
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">{folder === "inbox" ? "Ujumbe ulioingia" : "Ujumbe uliotumwa"}</h2>
          {messages.length === 0 ? (
            <p className="text-gray-600">Hakuna ujumbe katika tena hayo.</p>
          ) : (
            <div className="space-y-3">
              {messages.map((message) => (
                <button
                  key={message.id}
                  onClick={() => setSelectedMessage(message)}
                  className="w-full text-left p-4 bg-gray-50 rounded-2xl border border-gray-200 hover:bg-gray-100"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-gray-900">{message.subject || "(Hakuna kichwa)"}</span>
                    <span className="text-xs text-gray-500">{new Date(message.created_at).toLocaleString()}</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {folder === "inbox" ? message.sender?.username : message.recipient?.username}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Tuma Ujumbe</h2>
          <form className="space-y-4" onSubmit={sendMessage}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mpokeaji</label>
              <select
                name="recipient_id"
                value={formData.recipient_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="">Chagua mpokeaji</option>
                {workers.map((worker) => (
                  <option key={worker.id} value={worker.id}>
                    {worker.username} ({worker.village?.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kichwa</label>
              <input
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Mfano: Ripoti ya uchunguzi"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ujumbe</label>
              <textarea
                name="body"
                value={formData.body}
                onChange={handleChange}
                rows={5}
                required
                placeholder="Andika ujumbe hapa..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Inatuma..." : "Tuma Ujumbe"}
            </button>
          </form>
        </div>
      </div>

      {selectedMessage && (
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold mb-4">Ujumbe Kamili</h3>
          <p className="text-sm text-gray-500 mb-2">{selectedMessage.subject || "(Hakuna kichwa)"}</p>
          <p className="text-gray-600 mb-4">{selectedMessage.body}</p>
          <div className="text-xs text-gray-500">Kutumwa: {new Date(selectedMessage.created_at).toLocaleString()}</div>
        </div>
      )}
    </div>
  );
}
