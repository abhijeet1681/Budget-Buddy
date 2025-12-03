import React, { useState } from "react";
import axios from "axios";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    
    try {
      console.log("Attempting login with:", { email, password });
      const apiUrl = process.env.REACT_APP_API_URL || "";
      const res = await axios.post(`${apiUrl}/login`, { 
        email, 
        password 
      });
      
      console.log("Login response:", res.data);
      localStorage.setItem("token", res.data.token);
      setMessage("✅ Login successful! Redirecting...");
      
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
    } catch (err) {
      console.error("Login error:", err);
      const errorMsg = err.response?.data?.message || err.message || "Login failed. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>🔐 Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="auth-input"
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="auth-input"
          disabled={loading}
        />
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      {message && <p className="auth-message success">{message}</p>}
      {error && <p className="auth-message error">{error}</p>}
      <p className="auth-link">
        Don't have an account? <a href="/signup">Sign Up</a>
      </p>
    </div>
  );
}

export default Login;
