import React, { useState } from "react";
import { login } from "../utils/api";
import "./Login.css";

export default function Login({ navigate, setRole }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await login(email, password);

      // ================= Save authData in localStorage =================
      const authData = {
        userId: data.userId,
        email: data.email,
        role: data.role,
        customerId: data.customerId || null, // important for customers
      };
      localStorage.setItem("authData", JSON.stringify(authData));

      // Update parent state
      setRole(data.role);

      // Navigate based on role
      switch (data.role) {
        case "CUSTOMER":
          navigate("home", null, "customer");
          break;
        case "AGENT":
          navigate("home", null, "agent");
          break;
        case "ADMIN":
          navigate("home", null, "admin");
          break;
        default:
          navigate("home");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Welcome Back 👋</h2>
        <p className="login-subtitle">Login to continue to InsuraCare</p>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-login">
            Login
          </button>
        </form>

        <p className="redirect-text">
          Don’t have an account?{" "}
          <span className="link" onClick={() => navigate("register")}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
