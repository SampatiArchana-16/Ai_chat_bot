import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Sidebar() {
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email"); // ✅ keep this also

  // 🧠 Load sessions
  const fetchSessions = async () => {
    try {
      if (!email) return;

      const res = await API.get(`/sessions/${email}`);
      setSessions(res.data || []);
    } catch (err) {
      console.log("Session error:", err);
    }
  };

  useEffect(() => {
  if (email) {
    fetchSessions();
  }
}, [email]);

  // ➕ New Chat (NO reload)
  const newChat = () => {
  localStorage.removeItem("session_id");

  // ✅ send signal to Chat.jsx
  navigate("/chat", { state: { newChat: true } });
};

  // 📂 Open chat (NO reload)
  const openChat = (id) => {
    localStorage.setItem("session_id", id);
    navigate("/chat");
  };

  // 🔴 Logout
  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={styles.sidebar}>
      <h2>ChatGPT</h2>

      {/* ➕ NEW CHAT */}
      <button onClick={newChat} style={styles.newChat}>
        + New Chat
      </button>

      {/* 🧠 HISTORY */}
      <div style={styles.history}>
        {sessions.length === 0 ? (
          <p style={styles.empty}>No chats yet</p>
        ) : (
          sessions.map((session, index) => (
        <div
          key={index}
          onClick={() => openChat(session.id)}
          style={styles.chatItem}
        >
          {session.title}
        </div>
        ))
        )}
      </div>

      {/* 👤 USER */}
      <div style={styles.user}>
        👤 {username || email || "Guest"}
      </div>

      {/* 🔴 LOGOUT */}
      <button onClick={logout} style={styles.logout}>
        Logout
      </button>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "250px",
    height: "100vh",
    background: "#111827",
    color: "white",
    display: "flex",
    flexDirection: "column",
    padding: "15px",
  },

  newChat: {
    padding: "10px",
    marginBottom: "10px",
    background: "#10b981",
    border: "none",
    color: "white",
    cursor: "pointer",
    borderRadius: "5px",
  },

  history: {
    flex: 1,
    overflowY: "auto",
    marginTop: "10px",
  },

  chatItem: {
    padding: "10px",
    marginBottom: "8px",
    background: "#1f2937",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "0.2s",
  },

  user: {
    marginTop: "10px",
    padding: "10px",
    background: "#1f2937",
    borderRadius: "5px",
  },

  empty: {
  textAlign: "center",
  opacity: 0.6,
  marginTop: "20px",
  },

  logout: {
    marginTop: "10px",
    padding: "10px",
    background: "#ef4444",
    border: "none",
    color: "white",
    cursor: "pointer",
    borderRadius: "5px",
  },
};