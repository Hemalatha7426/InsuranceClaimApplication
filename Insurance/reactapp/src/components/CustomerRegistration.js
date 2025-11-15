// src/components/CustomerRegistration.jsx
import React, { useState } from "react";
import "./CustomerRegistration.css";
import { createCustomer } from "../utils/api";

const initialState = { name: "", email: "", phone: "", policyNumber: "" };

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function CustomerRegistration() {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.policyNumber) {
      setError("All fields are required");
      return;
    }
    if (!isValidEmail(form.email)) {
      setError("Invalid email format");
      return;
    }
    try {
      const created = await createCustomer(form);
      setSuccess(`Customer registered (ID: ${created.customerId})`);
      setForm(initialState);
    } catch (err) {
      setError(err.message || "Failed to register customer");
    }
  };

  return (
    <div className="form-container">
      <h2>Register New Customer</h2>
      <p className="small-muted">Create a new customer profile to submit claims.</p>
      <form onSubmit={onSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input id="name" aria-label="Name" name="name" value={form.name} onChange={onChange} />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" aria-label="Email" name="email" value={form.email} onChange={onChange} />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input id="phone" aria-label="Phone Number" name="phone" value={form.phone} onChange={onChange} />
        </div>
        <div className="form-group">
          <label htmlFor="policyNumber">Policy Number</label>
          <input id="policyNumber" aria-label="Policy Number" name="policyNumber" value={form.policyNumber} onChange={onChange} />
        </div>
        <div className="form-actions">
          <button className="btn-primary" type="submit">Register</button>
        </div>
        {error && <div data-testid="error-message" className="error" role="alert">{error}</div>}
        {success && <div data-testid="success-message" className="success" role="alert">{success}</div>}
      </form>
    </div>
  );
}
