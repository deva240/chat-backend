import { useState, useEffect } from "react";
import api from "./api";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import useTheme from "./useTheme";
import socket from "./socket";
import Login from "./Login";
import Signup from "./Signup";

// -------------------------
// Decode JWT
// -------------------------
function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

function App() {
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [messages, setMessages] = useState([]);

  const { dark, toggleDark } = useTheme();

  // -------------------------
  // AUTO LOGIN ON REFRESH
  // -------------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = parseJwt(token);

    if (decoded?.id && decoded?.username) {
      setUser({
        id: decoded.id,
        username: decoded.username,
      });
    }
  }, []);

  // -------------------------
  // LOAD MESSAGES AFTER LOGIN
  // -------------------------
  useEffect(() => {
    if (!user) return;

    api
      .get("/messages")
      .then((res) => {
        setMessages(res.data);
      })
      .catch((err) => {
        console.error("Error loading messages:", err);
      });
  }, [user]);

  // -------------------------
  // SOCKET REAL-TIME HANDLING
  // -------------------------
  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ SOCKET CONNECTED:", socket.id);
    });

    socket.on("messageCreated", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("messageUpdated", (updatedMsg) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === updatedMsg.id ? updatedMsg : m))
      );
    });

    socket.on("messageDeleted", ({ id }) => {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    });

    socket.on("disconnect", () => {
      console.log("❌ SOCKET DISCONNECTED");
    });

    return () => {
      socket.off("connect");
      socket.off("messageCreated");
      socket.off("messageUpdated");
      socket.off("messageDeleted");
      socket.off("disconnect");
    };
  }, []);

  // -------------------------
  // NOT LOGGED IN VIEW
  // -------------------------
  if (!user) {
    return showSignup ? (
      <Signup onSignup={() => setShowSignup(false)} />
    ) : (
      <Login
        onLogin={(u) => setUser(u)}
        onSwitchToSignup={() => setShowSignup(true)}
      />
    );
  }

  // -------------------------
  // MESSAGE ACTIONS
  // -------------------------
  async function addMessage(text) {
    if (!text.trim()) return;
    await api.post("/messages", { text });
  }

  async function handleEdit(id, newText) {
    if (!newText.trim()) return;
    await api.put(`/messages/${id}`, { text: newText });
  }

  async function handleDelete(id) {
    await api.delete(`/messages/${id}`);
  }

  const currentUserId = user.id;

  // -------------------------
  // CHAT UI
  // -------------------------
  return (
    <div
      style={{
        width: "400px",
        margin: "30px auto",
        padding: "20px",
        borderRadius: "10px",
        backgroundColor: dark ? "#1e1e1e" : "white",
        color: dark ? "white" : "black",
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Chat App</h2>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          setUser(null);
        }}
        style={{
          width: "100%",
          padding: "8px",
          marginBottom: "10px",
          backgroundColor: "#e74c3c",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>

      <button
        onClick={toggleDark}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: dark ? "#444" : "#ddd",
          color: dark ? "white" : "black",
          borderRadius: "5px",
          border: "none",
          cursor: "pointer",
          marginBottom: "15px",
        }}
      >
        {dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      </button>

      <MessageInput onSend={addMessage} />

      <div
        style={{
          maxHeight: "400px",
          overflowY: "auto",
          marginTop: "20px",
          padding: "10px",
          borderRadius: "10px",
          backgroundColor: dark ? "#2b2b2b" : "#f9f9f9",
          border: dark ? "1px solid #555" : "1px solid #ddd",
        }}
      >
        <MessageList
          messages={messages}
          onDelete={handleDelete}
          onEdit={handleEdit}
          currentUserId={currentUserId}
        />
      </div>
    </div>
  );
}

export default App;
