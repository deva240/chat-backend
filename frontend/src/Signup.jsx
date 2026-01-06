import { useState } from "react";
import axios from "axios";

function Signup({ onSignup }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSignup(e) {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/auth/signup", {
        username,
        password,
      });

      setMessage("Signup successful! You can now log in.");
      onSignup(); // Switch to login page
    } catch (err) {
      setMessage("Username already exists.");
    }
  }

  return (
    <div style={{ width: "350px", margin: "50px auto" }}>
      <h2>Signup</h2>

      {message && <p style={{ color: "green" }}>{message}</p>}

      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Choose a username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <input
          type="password"
          placeholder="Choose a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#2196f3",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Create Account
        </button>
      </form>
    </div>
  );
}

export default Signup;
