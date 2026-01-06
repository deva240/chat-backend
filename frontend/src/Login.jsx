import { useState } from "react";
import axios from "axios";

function Login({ onLogin, onSwitchToSignup }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/auth/login", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.token);
     onLogin({
  id: res.data.user.id,
  username: res.data.user.username
});

    } catch (err) {
      setError("Invalid username or password");
    }
  }

  return (
    <div style={{ width: "350px", margin: "50px auto" }}>
      <h2>Login</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#4caf50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </form>

      <p style={{ marginTop: "15px", textAlign: "center" }}>
        Don't have an account?{" "}
        <span
          onClick={onSwitchToSignup}
          style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
        >
          Create one
        </span>
      </p>
    </div>
  );
}

export default Login;
