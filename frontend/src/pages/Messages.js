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
    } catch (error) { console.error(error); } finally { setFetching(false); }
  };

  const fetchRecipients = async () => {
    try {
      const response = await api.get("/users/");
      setRecipients((response.data.results || response.data).filter(r => r.id !== user.id));
    } catch (error) { console.error(error); }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const sendMessage = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/messages/", formData);
      setFormData({ recipient_id: "", subject: "", body: "", related_report_id: "" });
      setFolder("sent");
    } catch (error) { alert("Kuna hitilafu wakati wa kutuma ujumbe."); } finally { setLoading(false); }
  };

  const formatRole = (role) => {
    const roles = { 'admin': 'Msimamizi', 'district_officer': 'Afisa wa Wilaya', 'village_leader': 'Kiongozi wa Kijiji', 'water_officer': 'Afisa wa Maji', 'citizen': 'Mwananchi' };
    return roles[role] || role;
  };

  return (
    <div style={{ background: "#000000", minHeight: "100vh", color: "#ffffff" }}>
      <div className="m-stripe" />
      <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "40px 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px", flexWrap: "wrap", gap: "20px" }} className="animate-fade-in-up">
          <div>
            <p style={{ color: "#0066b1", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "10px" }}>Mawasiliano</p>
            <h1 style={{ color: "#ffffff", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, textTransform: "uppercase", lineHeight: 1.05 }}>Kituo cha Ujumbe</h1>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <button onClick={() => setFolder("inbox")} className={folder === "inbox" ? "btn-m-primary" : "btn-m-outline"} style={{ height: "40px", padding: "0 24px", fontSize: "12px" }}>Kikasha</button>
            <button onClick={() => setFolder("sent")} className={folder === "sent" ? "btn-m-primary" : "btn-m-outline"} style={{ height: "40px", padding: "0 24px", fontSize: "12px" }}>Uliotumwa</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 flex flex-col h-[700px] bg-[#0d0d0d] border border-[#3c3c3c] animate-fade-in-up">
            {selectedMessage ? (
              <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <div style={{ padding: "20px 24px", borderBottom: "1px solid #3c3c3c", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <button onClick={() => setSelectedMessage(null)} style={{ color: "#0066b1", fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", background: "transparent" }}>
                    ← Rudi Nyuma
                  </button>
                  <span style={{ color: "#7e7e7e", fontSize: "11px", fontWeight: 300 }}>{new Date(selectedMessage.created_at).toLocaleString("sw-TZ")}</span>
                </div>
                <div style={{ padding: "32px 24px", overflowY: "auto", flex: 1 }}>
                  <h2 style={{ color: "#ffffff", fontSize: "24px", fontWeight: 700, textTransform: "uppercase", marginBottom: "24px" }}>{selectedMessage.subject || "(Hakuna kichwa)"}</h2>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "32px", paddingBottom: "24px", borderBottom: "1px solid #1a1a1a" }}>
                    <div style={{ width: "40px", height: "40px", background: "#1a1a1a", border: "1px solid #3c3c3c", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", fontSize: "14px", fontWeight: 700 }}>
                      {(folder === "inbox" ? selectedMessage.sender?.username : selectedMessage.recipient?.username).charAt(0).toUpperCase()}
                    </div>
                    <div style={{ marginLeft: "16px" }}>
                      <p style={{ color: "#bbbbbb", fontSize: "13px", fontWeight: 300 }}>
                        {folder === "inbox" ? "Kutoka: " : "Kwenda: "}
                        <span style={{ color: "#ffffff", fontWeight: 700 }}>{folder === "inbox" ? selectedMessage.sender?.username : selectedMessage.recipient?.username}</span>
                      </p>
                    </div>
                  </div>
                  <div style={{ color: "#bbbbbb", fontSize: "15px", lineHeight: 1.6, fontWeight: 300, whiteSpace: "pre-wrap" }}>
                    {selectedMessage.body}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <div style={{ padding: "24px", borderBottom: "1px solid #3c3c3c", display: "flex", alignItems: "center" }}>
                  <div style={{ width: "8px", height: "8px", background: folder === "inbox" ? "#0066b1" : "#0fa336", marginRight: "12px" }} />
                  <h2 style={{ color: "#ffffff", fontSize: "14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>{folder === "inbox" ? "Ujumbe Ulioingia" : "Ujumbe Uliotumwa"}</h2>
                </div>
                <div style={{ flex: 1, overflowY: "auto" }}>
                  {fetching ? (
                    <div className="space-y-px" style={{ background: "#3c3c3c" }}>
                      {[1,2,3,4].map(i => <div key={i} style={{ height: "100px", background: "#0d0d0d" }} />)}
                    </div>
                  ) : messages.length === 0 ? (
                    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#7e7e7e", fontWeight: 300 }}>Kikasha kipo wazi.</div>
                  ) : (
                    <div className="space-y-px" style={{ background: "#3c3c3c" }}>
                      {messages.map((m) => (
                        <div key={m.id} onClick={() => setSelectedMessage(m)} style={{ padding: "24px", background: "#0d0d0d", cursor: "pointer", transition: "background 0.15s" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "#1a1a1a")} onMouseLeave={(e) => (e.currentTarget.style.background = "#0d0d0d")}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                            <h3 style={{ color: "#ffffff", fontSize: "16px", fontWeight: 700, textTransform: "uppercase" }}>{m.subject || "(Hakuna kichwa)"}</h3>
                            <span style={{ color: "#7e7e7e", fontSize: "11px", fontWeight: 300 }}>{new Date(m.created_at).toLocaleDateString("sw-TZ")}</span>
                          </div>
                          <p style={{ color: "#bbbbbb", fontSize: "14px", fontWeight: 300, marginBottom: "16px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{m.body}</p>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <div style={{ width: "24px", height: "24px", background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", color: "#7e7e7e", fontSize: "10px", fontWeight: 700 }}>
                              {(folder === "inbox" ? m.sender?.username : m.recipient?.username).charAt(0).toUpperCase()}
                            </div>
                            <span style={{ color: "#7e7e7e", fontSize: "12px", marginLeft: "10px" }}>{folder === "inbox" ? m.sender?.username : m.recipient?.username}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 flex flex-col">
            <div style={{ background: "#0d0d0d", border: "1px solid #3c3c3c", padding: "32px", position: "sticky", top: "32px" }}>
              <h2 style={{ color: "#ffffff", fontSize: "18px", fontWeight: 700, textTransform: "uppercase", marginBottom: "32px", display: "flex", alignItems: "center" }}>
                <div style={{ width: "8px", height: "8px", background: "#0066b1", marginRight: "12px" }} /> Tuma Ujumbe Mpya
              </h2>
              <form onSubmit={sendMessage} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div>
                  <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>Mpokeaji</label>
                  <select name="recipient_id" value={formData.recipient_id} onChange={handleChange} required className="bmw-input">
                    <option value="" disabled>Chagua mdau</option>
                    {recipients.map(r => <option key={r.id} value={r.id}>{r.username} - {formatRole(r.role)} {r.village ? `(${r.village.name})` : ''}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>Kichwa cha Habari</label>
                  <input name="subject" value={formData.subject} onChange={handleChange} placeholder="Mfano: Ripoti ya Uchafuzi..." className="bmw-input" />
                </div>
                <div>
                  <label style={{ display: "block", color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>Maelezo</label>
                  <textarea name="body" value={formData.body} onChange={handleChange} rows={6} required placeholder="Andika ujumbe wako hapa..." className="bmw-input" />
                </div>
                <button type="submit" disabled={loading} className="btn-m-primary" style={{ height: "48px", marginTop: "12px", opacity: loading ? 0.7 : 1 }}>
                  {loading ? "Inatuma..." : "Tuma Ujumbe"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
