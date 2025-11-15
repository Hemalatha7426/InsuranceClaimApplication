import React, { useEffect, useState } from "react";
import { getAuth, getUserById, updateUser } from "../utils/api";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", role: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    if (!auth) {
      setError("❌ You must be logged in to view profile.");
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const data = await getUserById(auth.userId);
        setUser(data);
        setFormData({
          name: data.name || "",
          email: data.email || "",
          role: data.role || "",
        });
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("❌ Failed to fetch user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateUser(user.id, formData);
      setUser(updated);
      setEditMode(false);
    } catch (err) {
      console.error("Error updating user:", err);
      setError("❌ Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <p
        style={{
          textAlign: "center",
          marginTop: 50,
          fontSize: 20,
          color: "#4a90e2",
          fontWeight: "bold",
        }}
      >
        ⏳ Loading your profile...
      </p>
    );

  if (error)
    return (
      <p
        style={{
          textAlign: "center",
          marginTop: 50,
          color: "red",
          fontSize: 18,
          fontWeight: "bold",
        }}
      >
        {error}
      </p>
    );

  if (!user) return null;

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "40px auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          padding: 30,
          borderRadius: 20,
          boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
          background: "linear-gradient(135deg, #f9f9f9, #e0f7fa)",
          textAlign: "center",
          transition: "transform 0.3s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            backgroundColor: "#4a90e2",
            margin: "0 auto 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 48,
            color: "#fff",
            fontWeight: "bold",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
          }}
        >
          {user.name.charAt(0).toUpperCase()}
        </div>

        {!editMode ? (
          <>
            <h2 style={{ marginBottom: 10, color: "#333", fontSize: 28 }}>
              {user.name} 🎉
            </h2>
            <p style={{ margin: 5, color: "#555", fontSize: 18 }}>
              📧 <strong>Email:</strong> {user.email}
            </p>
            <p style={{ margin: 5, color: "#555", fontSize: 18 }}>
              🛡️ <strong>Role:</strong> {user.role}
            </p>
            <button
              onClick={() => setEditMode(true)}
              style={{
                marginTop: 20,
                padding: "10px 20px",
                background: "#4a90e2",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 16,
              }}
            >
              ✏️ Edit Profile
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter name"
              style={{
                margin: "8px 0",
                padding: 10,
                width: "100%",
                borderRadius: 8,
                border: "1px solid #ccc",
              }}
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              style={{
                margin: "8px 0",
                padding: 10,
                width: "100%",
                borderRadius: 8,
                border: "1px solid #ccc",
              }}
            />
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="Enter role"
              style={{
                margin: "8px 0",
                padding: 10,
                width: "100%",
                borderRadius: 8,
                border: "1px solid #ccc",
              }}
            />
            <div style={{ marginTop: 15 }}>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  marginRight: 10,
                  padding: "10px 20px",
                  background: "#28a745",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 16,
                }}
              >
                {saving ? "💾 Saving..." : "✅ Save"}
              </button>
              <button
                onClick={() => setEditMode(false)}
                style={{
                  padding: "10px 20px",
                  background: "#dc3545",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 16,
                }}
              >
                ❌ Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
