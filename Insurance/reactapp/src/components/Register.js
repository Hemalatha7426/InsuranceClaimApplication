import React, { useState } from "react";
import { registerUser } from "../utils/api";

export default function Register({ navigate }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); // ✅ added phone
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CUSTOMER");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await registerUser(username, email, password, role, phone); // ✅ send phone
      setSuccess(response.message || "Registered successfully ✅");
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  };

  const styles = {
    formContainer: {
      maxWidth: "420px",
      margin: "60px auto",
      padding: "2.5rem",
      background: "#ffffff",
      borderRadius: "16px",
      boxShadow: "0 6px 18px rgba(0, 0, 0, 0.1)",
      textAlign: "center",
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    },
    title: { marginBottom: "1.5rem", color: "#2d3e50", fontSize: "1.8rem", fontWeight: "700" },
    input: {
      width: "100%",
      padding: "12px 14px",
      margin: "0.5rem 0",
      border: "1px solid #d1d5db",
      borderRadius: "10px",
      fontSize: "1rem",
    },
    button: {
      width: "100%",
      padding: "12px",
      marginTop: "1rem",
      background: "linear-gradient(90deg, #2563eb, #1d4ed8)",
      color: "white",
      fontSize: "1rem",
      fontWeight: "600",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
    },
    redirect: { marginTop: "1.5rem", fontSize: "0.95rem", color: "#374151" },
    link: { fontWeight: "600", color: "blue", cursor: "pointer", textDecoration: "underline" },
    error: { color: "#dc2626", background: "#fee2e2", padding: "0.7rem", borderRadius: "8px" },
    success: { color: "#065f46", background: "#d1fae5", padding: "0.7rem", borderRadius: "8px" },
  };

  return (
    <div style={styles.formContainer}>
      <h2 style={styles.title}>Register</h2>
      {error && <p style={styles.error}>{error}</p>} {/* ✅ show actual error */}
      {success && <p style={styles.success}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <input
          style={styles.input}
          type="text"
          placeholder="Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          style={styles.input}
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <select
          style={styles.input}
          value={role}
          onChange={(e) => setRole(e.target.value.toUpperCase())}
          required
        >
          <option value="CUSTOMER">Customer</option>
          <option value="AGENT">Agent</option>
          <option value="ADMIN">Admin</option>
        </select>

        <button type="submit" style={styles.button}>Register</button>
      </form>

      <p style={styles.redirect}>
        Already have an account?{" "}
        <span style={styles.link} onClick={() => navigate("login")}>
          Login
        </span>
      </p>
    </div>
  );
}
