import React, { useState } from "react";
import axios from "axios";

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "";
      const res = await axios.post(`${apiUrl}/signup`, formData);
      setMessage("Signup successful! Please login now.");
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
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={{ textAlign: "center" }}>📝 Signup</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        {Object.keys(formData).map((key) => (
          <input
            key={key}
            type={key === "password" ? "password" : "text"}
            name={key}
            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
            value={formData[key]}
            onChange={handleChange}
            required={["name", "email", "password"].includes(key)}
            style={styles.input}
          />
        ))}
        <button type="submit" style={styles.button}>Sign Up</button>
      </form>
      {message && <p style={styles.msg}>{message}</p>}
      <p style={{ textAlign: "center" }}>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}

const styles = {
  container: { padding: "30px", maxWidth: "500px", margin: "50px auto", background: "#fff", borderRadius: "15px", boxShadow: "0 6px 20px rgba(0,0,0,0.1)" },
  form: { display: "flex", flexDirection: "column", gap: "10px" },
  input: { padding: "10px", borderRadius: "5px", border: "1px solid #ccc" },
  button: { padding: "10px", background: "#4CAF50", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" },
  msg: { textAlign: "center", color: "green" },
};

export default Signup;
