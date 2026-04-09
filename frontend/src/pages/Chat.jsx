import { useState, useEffect } from "react";
import API from "../api";
import { useLocation } from "react-router-dom";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const location = useLocation();

  const email = localStorage.getItem("email");

  // 🔄 Load chat when session exists
 useEffect(() => {
  if (location.state?.newChat) {
    // ✅ clear chat when clicking new chat
    setChat([]);
    return;
  }

  const sessionId = localStorage.getItem("session_id");

  if (sessionId) {
    loadChat(sessionId);
  } else {
    setChat([]);
  }
}, [location.state]);

  // 📂 Load chat history
  const loadChat = async (id) => {
    try {
      const res = await API.get(`/chat/${id}`);
      setChat(res.data || []);
    } catch (err) {
      console.log("Load chat error:", err);
    }
  };

  // 📤 Send message
  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = message;

    // show instantly
    setChat((prev) => [...prev, { role: "user", content: userMsg }]);
    setMessage("");

    try {
      const res = await API.post("/chat", {
        message: userMsg,
        email,
        session_id: localStorage.getItem("session_id"),
      });

      // save session
      localStorage.setItem("session_id", res.data.session_id);

      // bot reply
      setChat((prev) => [
        ...prev,
        { role: "assistant", content: res.data.response },
      ]);
    } catch (err) {
      console.log("Send error:", err);
    }
  };

  const safeChat = chat || [];

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* ✅ ONLY ONE SIDEBAR
      <Sidebar /> */}

      {/* 💬 CHAT AREA */}
      <div style={styles.chatContainer}>
        <h2>Chat Bot 🤖</h2>

        <div style={styles.chatBox}>
          {safeChat.map((msg, i) => (
            <div
              key={i}
              style={{
                textAlign: msg.role === "user" ? "right" : "left",
              }}
            >
              <span
                style={{
                  background:
                    msg.role === "user" ? "#3b82f6" : "#e5e7eb",
                  color: msg.role === "user" ? "white" : "black",
                  padding: "10px",
                  borderRadius: "10px",
                  display: "inline-block",
                  margin: "5px",
                }}
              >
                {msg.content}
              </span>
            </div>
          ))}
        </div>

        <div style={styles.inputBox}>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type message..."
            style={styles.input}
          />
          <button onClick={sendMessage} style={styles.sendBtn}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

/* ✅ STYLES */
const styles = {
  chatContainer: {
    flex: 1,
    padding: "20px",
    display: "flex",
    flexDirection: "column",
  },

  chatBox: {
    flex: 1,
    overflowY: "auto",
    border: "1px solid #ccc",
    padding: "10px",
    borderRadius: "10px",
  },

  inputBox: {
    display: "flex",
    marginTop: "10px",
  },

  input: {
    flex: 1,
    padding: "10px",
    marginRight: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },

  sendBtn: {
    padding: "10px",
    cursor: "pointer",
  },
};