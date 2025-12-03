import React, { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "";
      const res = await axios.post(`${apiUrl}/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      setMessage("Login successful! Redirecting...");
      setTimeout(() => {
        window.location.href = "/dashboard/home";
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={{ textAlign: "center" }}>🔐 Login</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Login</button>
      </form>
      {message && <p style={styles.msg}>{message}</p>}
      <p style={{ textAlign: "center" }}>
        Don’t have an account? <a href="/signup">Sign Up</a>
      </p>
    </div>
  );
}

const styles = {
  container: { padding: "30px", maxWidth: "400px", margin: "50px auto", background: "#fff", borderRadius: "15px", boxShadow: "0 6px 20px rgba(0,0,0,0.1)" },
  form: { display: "flex", flexDirection: "column", gap: "10px" },
  input: { padding: "10px", borderRadius: "5px", border: "1px solid #ccc" },
  button: { padding: "10px", background: "#2196F3", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" },
  msg: { textAlign: "center", color: "green" },
};

export default Login;
