import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const [expanded, setExpanded] = useState(false);

  const items = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/profile", label: "Profile", icon: "👤" },
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
  ];

  return (
    <div
      className={`sidebar ${expanded ? "expanded" : ""}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <ul className="sidebar-list">
        {items.map((item, index) => (
          <li key={index} className="sidebar-item">
            <Link to={item.path} className="sidebar-link">
              <span className={`sidebar-icon ${!expanded ? "sidebar-icon-only" : ""}`}>
                {item.icon}
              </span>
              {expanded && <span className="sidebar-label">{item.label}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
