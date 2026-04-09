import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/login", {
        email,
        password,
      });

      console.log("LOGIN SUCCESS:", res.data);

      // ✅ Store email
      localStorage.setItem("email", email);

      // ✅ Store username (from email)
      const name = email.split("@")[0];
      localStorage.setItem("username", name);

      alert("Login successful");

      navigate("/chat");

    } catch (err) {
      console.log("LOGIN ERROR:", err.response?.data);
      alert("Login failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleLogin} style={styles.button}>
          Login
        </button>

        <p style={styles.text}>
          Don’t have an account?{" "}
          <span onClick={() => navigate("/")} style={styles.link}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

/* ✅ STYLES */
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f3f4f6",
  },

  card: {
    width: "300px",
    padding: "30px",
    background: "white",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  title: {
    textAlign: "center",
  },

  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },

  button: {
    padding: "10px",
    background: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  text: {
    textAlign: "center",
  },

  link: {
    color: "blue",
    cursor: "pointer",
  },
};