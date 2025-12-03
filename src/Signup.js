import React, { useState } from "react";
import axios from "axios";
import "./Signup.css";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    designation: "",
    company: "",
    location: "",
    bio: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    
    try {
      console.log("Attempting signup with:", formData);
      const apiUrl = process.env.REACT_APP_API_URL || "";
      const response = await axios.post(`${apiUrl}/signup`, formData);
      
      console.log("Signup response:", response.data);
      setMessage("✅ Signup successful! Please login now.");
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        designation: "",
        company: "",
        location: "",
        bio: "",
      });
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      console.error("Signup error:", err);
      const errorMsg = err.response?.data?.message || err.message || "Signup failed. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h2>📝 Signup</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        {Object.keys(formData).map((key) => (
          <input
            key={key}
            type={key === "password" ? "password" : "text"}
            name={key}
            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
            value={formData[key]}
            onChange={handleChange}
            required={["name", "email", "password"].includes(key)}
            className="signup-input"
            disabled={loading}
          />
        ))}
        <button type="submit" className="signup-button" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
      {message && <p className="signup-message success">{message}</p>}
      {error && <p className="signup-message error">{error}</p>}
      <p className="signup-link">
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}

export default Signup;
