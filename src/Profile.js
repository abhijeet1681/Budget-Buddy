import React, { useState, useEffect } from "react";
import axios from "axios";

function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "",
    company: "",
    location: "",
    bio: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(profile);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login first");
        return;
      }

      const res = await axios.get("http://localhost:5000/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData = res.data.user;
      const profileData = {
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        designation: userData.designation || "",
        company: userData.company || "",
        location: userData.location || "",
        bio: userData.bio || "",
      };
      setProfile(profileData);
      setEditData(profileData);
      setError("");
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err.response?.data?.message || "Error fetching profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login first");
        return;
      }

      await axios.put("http://localhost:5000/profile", editData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setProfile(editData);
      setIsEditing(false);
      setMessage("✅ Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error saving profile:", err);
      setError(err.response?.data?.message || "Error saving profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData(profile);
    setError("");
  };

  const getFieldIcon = (fieldName) => {
    const icons = {
      name: "👤",
      email: "📧",
      phone: "📱",
      designation: "💼",
      company: "🏢",
      location: "📍",
      bio: "✍️"
    };
    return icons[fieldName] || "📝";
  };

  const containerStyle = {
    flex: 1,
    padding: "20px",
    maxWidth: "700px",
    width: "100%",
    margin: "0 auto"
  };

  const headerStyle = {
    textAlign: "center",
    marginBottom: "40px"
  };

  const avatarStyle = {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "60px",
    margin: "0 auto",
    marginBottom: "20px",
    boxShadow: "0 8px 25px rgba(102, 126, 234, 0.4)",
    border: "5px solid white"
  };

  const titleStyle = {
    fontSize: "2.5rem",
    margin: "0 0 10px 0",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    fontWeight: "700"
  };

  const subtitleStyle = {
    color: "#666",
    margin: "0",
    fontSize: "16px"
  };

  const cardStyle = {
    background: "#fff",
    padding: "40px",
    borderRadius: "15px",
    boxShadow: "0 12px 45px rgba(0,0,0,0.1)",
    border: "1px solid rgba(0,0,0,0.05)",
    transition: "all 0.3s ease"
  };

  const messageStyle = {
    padding: "15px",
    marginBottom: "20px",
    background: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
    color: "#0e6251",
    borderRadius: "10px",
    textAlign: "center",
    fontWeight: "bold",
    border: "2px solid #0e6251",
    animation: "slideIn 0.3s ease"
  };

  const errorStyle = {
    padding: "15px",
    marginBottom: "20px",
    background: "linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)",
    color: "#c0392b",
    borderRadius: "10px",
    textAlign: "center",
    fontWeight: "bold",
    border: "2px solid #c0392b",
    animation: "slideIn 0.3s ease"
  };

  const fieldContainerStyle = {
    padding: "18px",
    background: "#f9f9f9",
    borderRadius: "10px",
    border: "1px solid #e0e0e0",
    transition: "all 0.3s"
  };

  const fieldLabelStyle = {
    margin: "0 0 8px 0",
    fontWeight: "bold",
    color: "#667eea",
    fontSize: "13px",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  };

  const fieldValueStyle = {
    margin: "0",
    fontSize: "15px",
    color: "#333",
    fontWeight: "500",
    minHeight: "24px"
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 15px",
    borderRadius: "8px",
    border: "2px solid #e0e0e0",
    fontSize: "14px",
    boxSizing: "border-box",
    fontFamily: "inherit",
    transition: "all 0.3s"
  };

  const primaryButtonStyle = {
    flex: 1,
    padding: "12px 24px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
    transition: "all 0.3s",
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)"
  };

  const secondaryButtonStyle = {
    flex: 1,
    padding: "12px 24px",
    background: "#f5f5f5",
    color: "#333",
    border: "2px solid #ddd",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
    transition: "all 0.3s"
  };

  const editButtonStyle = {
    width: "100%",
    padding: "14px 24px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
    transition: "all 0.3s",
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
    marginTop: "10px"
  };

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div style={headerStyle}>
        <div style={avatarStyle}>👤</div>
        <h1 style={titleStyle}>User Profile</h1>
        <p style={subtitleStyle}>
          {isEditing ? "Edit your information" : "Manage your personal information"}
        </p>
      </div>

      {loading ? (
        <div style={{
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          padding: "60px 30px",
          borderRadius: "15px",
          textAlign: "center",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
        }}>
          <div style={{
            display: "inline-block",
            width: "50px",
            height: "50px",
            border: "4px solid #667eea",
            borderRadius: "50%",
            borderTopColor: "transparent",
            animation: "spin 1s linear infinite",
            marginBottom: "15px"
          }} />
          <p style={{ color: "#555", fontSize: "16px", margin: "0" }}>Loading your profile...</p>
        </div>
      ) : (
        <div style={cardStyle}>
          {message && <div style={messageStyle}>{message}</div>}
          {error && <div style={errorStyle}>{error}</div>}

          {isEditing ? (
            <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {Object.keys(editData).map((key) => (
                <div key={key}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#333',
                    fontSize: '14px',
                    textTransform: 'capitalize'
                  }}>
                    {getFieldIcon(key)} {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <input
                    type={key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'}
                    name={key}
                    value={editData[key]}
                    onChange={handleChange}
                    disabled={saving}
                    placeholder={`Enter your ${key}`}
                    style={{
                      ...inputStyle,
                      backgroundColor: saving ? '#f5f5f5' : '#fff',
                      cursor: saving ? 'not-allowed' : 'text'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  />
                </div>
              ))}

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    ...primaryButtonStyle,
                    opacity: saving ? 0.7 : 1
                  }}
                  onMouseEnter={(e) => !saving && (e.target.style.transform = 'scale(1.02)')}
                  onMouseLeave={(e) => !saving && (e.target.style.transform = 'scale(1)')}
                >
                  {saving ? '💾 Saving...' : '💾 Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  style={{
                    ...secondaryButtonStyle,
                    opacity: saving ? 0.7 : 1,
                    cursor: saving ? 'not-allowed' : 'pointer'
                  }}
                  onMouseEnter={(e) => !saving && (e.target.style.background = '#efefef')}
                  onMouseLeave={(e) => !saving && (e.target.style.background = '#f5f5f5')}
                >
                  ✕ Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px',
                marginBottom: '30px'
              }}>
                {Object.keys(profile).map((key) => (
                  <div 
                    key={key} 
                    style={{
                      ...fieldContainerStyle,
                      background: key === 'bio' ? 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' : '#f9f9f9',
                      gridColumn: key === 'bio' ? '1 / -1' : 'auto'
                    }}
                  >
                    <p style={fieldLabelStyle}>
                      {getFieldIcon(key)} {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p style={fieldValueStyle}>
                      {profile[key] || <span style={{ color: '#999', fontStyle: 'italic' }}>Not set</span>}
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setIsEditing(true)}
                style={editButtonStyle}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                ✏️ Edit Profile
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;
