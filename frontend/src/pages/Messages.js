import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Messages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [folder, setFolder] = useState("inbox");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [formData, setFormData] = useState({ recipient_id: "", subject: "", body: "", related_report_id: "" });
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchMessages();
    fetchRecipients();
  }, [folder]);

  const fetchMessages = async () => {
    setFetching(true);
    try {
      const response = await api.get(`/messages/?folder=${folder}`);
      setMessages(response.data.results || response.data);
      setSelectedMessage(null);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setFetching(false);
    }
  };

  const fetchRecipients = async () => {
    try {
      // The backend now filters this list based on the user's role visibility rules
      const response = await api.get("/users/");
      // Exclude self from recipients
      const availableRecipients = (response.data.results || response.data).filter(r => r.id !== user.id);
      setRecipients(availableRecipients);
    } catch (error) {
      console.error("Error fetching recipients:", error);
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
      setFolder("sent"); // This will trigger useEffect to fetch sent messages
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Kuna hitilafu wakati wa kutuma ujumbe.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to format role names beautifully
  const formatRole = (role) => {
    const roles = {
      'admin': 'Msimamizi',
      'district_officer': 'Afisa wa Wilaya',
      'village_leader': 'Kiongozi wa Kijiji',
      'water_officer': 'Afisa wa Maji',
      'citizen': 'Mwananchi'
    };
    return roles[role] || role;
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 animate-fade-in-up">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Kituo cha Ujumbe</h1>
            <p className="mt-2 text-lg text-gray-600">Mawasiliano na ushirikiano kati ya wadau wa sekta ya maji.</p>
          </div>
          <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 p-1">
            <button
              onClick={() => setFolder("inbox")}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                folder === "inbox" ? "bg-blue-600 text-white shadow-md transform scale-105" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Kikasha
            </button>
            <button
              onClick={() => setFolder("sent")}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                folder === "sent" ? "bg-blue-600 text-white shadow-md transform scale-105" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Uliotumwa
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Messages List & Viewer (Left Side) */}
          <div className="lg:col-span-8 flex flex-col h-[700px] bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in-up delay-100">
            {selectedMessage ? (
              // Message Viewer
              <div className="flex flex-col h-full bg-gradient-to-b from-blue-50/50 to-white">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                  <button 
                    onClick={() => setSelectedMessage(null)}
                    className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    Rudi Nyuma
                  </button>
                  <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {new Date(selectedMessage.created_at).toLocaleString("sw-TZ")}
                  </span>
                </div>
                <div className="p-8 overflow-y-auto">
                  <h2 className="text-3xl font-extrabold text-gray-900 mb-6 leading-tight">{selectedMessage.subject || "(Hakuna kichwa)"}</h2>
                  
                  <div className="flex items-center mb-8 pb-8 border-b border-gray-100">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {(folder === "inbox" ? selectedMessage.sender?.username : selectedMessage.recipient?.username).charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-semibold text-gray-900">
                        {folder === "inbox" ? "Kutoka: " : "Kwenda: "}
                        <span className="text-blue-600">{folder === "inbox" ? selectedMessage.sender?.username : selectedMessage.recipient?.username}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">Mhusika wa Mfumo</p>
                    </div>
                  </div>

                  <div className="prose max-w-none text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                    {selectedMessage.body}
                  </div>
                </div>
              </div>
            ) : (
              // Messages List
              <div className="flex flex-col h-full">
                <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <span className={`w-2 h-6 rounded-full mr-3 ${folder === 'inbox' ? 'bg-blue-500' : 'bg-green-500'}`}></span>
                    {folder === "inbox" ? "Ujumbe Ulioingia" : "Ujumbe Uliotumwa"}
                  </h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {fetching ? (
                    <div className="p-8 space-y-4">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse"></div>
                      ))}
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <span className="text-6xl mb-4">📭</span>
                      <p className="text-lg font-medium">Kikasha kipo wazi kwa sasa.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-50">
                      {messages.map((message) => (
                        <button
                          key={message.id}
                          onClick={() => setSelectedMessage(message)}
                          className="w-full text-left p-6 hover:bg-blue-50/50 transition-colors duration-200 group relative flex flex-col"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors text-lg truncate pr-4">
                              {message.subject || "(Hakuna kichwa)"}
                            </h3>
                            <span className="text-xs font-semibold text-gray-400 whitespace-nowrap">
                              {new Date(message.created_at).toLocaleDateString("sw-TZ")}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-3">
                            {message.body}
                          </p>
                          <div className="flex items-center mt-auto">
                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold mr-2">
                              {(folder === "inbox" ? message.sender?.username : message.recipient?.username).charAt(0).toUpperCase()}
                            </div>
                            <span className="text-xs font-medium text-gray-600">
                              {folder === "inbox" ? message.sender?.username : message.recipient?.username}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Compose Form (Right Side) */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 animate-fade-in-up delay-200 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-2 h-6 bg-purple-500 rounded-full mr-3"></span>
                Tuma Ujumbe Mpya
              </h2>
              
              <form className="space-y-5" onSubmit={sendMessage}>
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-purple-600">Mpokeaji</label>
                  <select
                    name="recipient_id"
                    value={formData.recipient_id}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white outline-none transition-all duration-300 shadow-sm appearance-none"
                    style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236B7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.65rem auto' }}
                  >
                    <option value="" disabled>Chagua mdau</option>
                    {recipients.map((recipient) => (
                      <option key={recipient.id} value={recipient.id}>
                        {recipient.username} - {formatRole(recipient.role)} {recipient.village ? `(${recipient.village.name})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-purple-600">Kichwa cha Habari</label>
                  <input
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Mfano: Ripoti ya Uchafuzi..."
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white outline-none transition-all duration-300 shadow-sm"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-purple-600">Maelezo</label>
                  <textarea
                    name="body"
                    value={formData.body}
                    onChange={handleChange}
                    rows={6}
                    required
                    placeholder="Andika ujumbe wako hapa kwa kina..."
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white outline-none transition-all duration-300 shadow-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full relative flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-4 rounded-xl font-bold text-[15px] shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 transform hover:-translate-y-0.5 transition-all duration-200 active:translate-y-0 mt-8 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                      Tuma Ujumbe Sasa
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
