import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
    window.location.reload();
  };

  return (
    <header className="header">
      <div className="logo-section">
        <span className="logo-text">🏦 BudgetBuddy</span>
      </div>
      <nav className="nav">
        <Link to="/" className="btn">Home</Link>
        <Link to="/dashboard" className="btn">Dashboard</Link>
        {isLoggedIn ? (
          <>
            <Link to="/profile" className="btn">Profile</Link>
            <button 
              onClick={handleLogout} 
              className="btn"
              style={{
                background: "#dc3545",
                border: "none",
                cursor: "pointer",
                transition: "background 0.3s"
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn">Login</Link>
            <Link to="/signup" className="btn">Signup</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
