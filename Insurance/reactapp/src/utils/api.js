import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

/* ================== AUTH ================== */

// Login user
export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || body.error || "Invalid login credentials");
  }

  const data = await res.json(); // { userId, email, role, customerId? }

  // Normalize role and save auth
  const authData = {
    userId: data.userId || data.id,
    customerId: data.customerId || null, // only for CUSTOMER
    role: data.role?.toUpperCase(), // CUSTOMER, AGENT, ADMIN
    email: data.email,
  };

  saveAuth(authData);
  return authData;
}

export async function registerUser(username, email, password, role, phone) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      email,
      password,
      role: role ? role.toUpperCase() : "CUSTOMER",
      phone,   // ✅ send phone to backend
    }),
  });

  const body = await res.json();
  if (!res.ok) throw new Error(body.message || "Registration failed");
  return body;
}


/* ================== AUTH HELPERS ================== */

// Save auth data to localStorage
export function saveAuth(data) {
  localStorage.setItem("auth", JSON.stringify(data));
}

// Get saved auth data
export function getAuth() {
  const auth = localStorage.getItem("auth");
  return auth ? JSON.parse(auth) : null;
}

// Clear auth data
export function clearAuth() {
  localStorage.removeItem("auth");
}

/* ================== CLAIMS ================== */

// Create claim
export async function createClaim(payload) {
  const res = await fetch(`${BASE_URL}/claims`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to submit claim");
  return res.json();
}

// Get all claims
export async function getAllClaims() {
  const res = await fetch(`${BASE_URL}/claims`);
  if (!res.ok) throw new Error("Failed to fetch claims");
  return res.json();
}

// Get claim by ID
export async function getClaimById(id) {
  const res = await fetch(`${BASE_URL}/claims/${id}`);
  if (!res.ok) throw new Error("Claim not found");
  return res.json();
}

// Get claims by customerId
export async function getClaimsByCustomerId(customerId) {
  const res = await fetch(`${BASE_URL}/claims/customer/${customerId}`);
  if (!res.ok) throw new Error("Failed to fetch customer claims");
  return res.json();
}

// Get claims by userId (agent/admin)
export async function getClaimsByUserId(userId) {
  const res = await fetch(`${BASE_URL}/claims/user/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch user claims");
  return res.json();
}

// Update claim status
export async function updateClaimStatus(id, status) {
  const res = await fetch(`${BASE_URL}/claims/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update claim status");
  return res.json();
}

// Approve claim
export async function approveClaim(id) {
  const res = await fetch(`${BASE_URL}/claims/${id}/approve`, { method: "PUT" });
  if (!res.ok) throw new Error("Failed to approve claim");
  return res.json();
}

// Reject claim
export async function rejectClaim(id) {
  const res = await fetch(`${BASE_URL}/claims/${id}/reject`, { method: "PUT" });
  if (!res.ok) throw new Error("Failed to reject claim");
  return res.json();
}

// Get claims for currently logged-in customer
export async function getMyClaims() {
  const auth = getAuth();
  if (!auth || auth.role !== "CUSTOMER" || !auth.customerId) {
    console.error("Not logged in as customer or customerId missing.");
    return [];
  }
  const res = await fetch(`${BASE_URL}/claims/customer/${auth.customerId}`);
  if (!res.ok) throw new Error("Failed to fetch claims for customer");
  return res.json();
}

/* ================== CUSTOMERS ================== */

// Create customer
export async function createCustomer(payload) {
  const res = await fetch(`${BASE_URL}/customers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create customer");
  return res.json();
}

// Get all customers
export async function getAllCustomers() {
  const res = await fetch(`${BASE_URL}/customers`);
  if (!res.ok) throw new Error("Failed to fetch customers");
  return res.json();
}

// Get customer by ID
export async function getCustomerById(id) {
  const res = await fetch(`${BASE_URL}/customers/${id}`);
  if (!res.ok) throw new Error("Customer not found");
  return res.json();
}

// Delete customer
export async function deleteCustomer(id) {
  const res = await fetch(`${BASE_URL}/customers/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete customer");
  return true;
}

/* ================== USERS ================== */

// Create user
export async function createUser(payload) {
  const res = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create user");
  return res.json();
}

// Get all users
export async function getAllUsers() {
  const res = await fetch(`${BASE_URL}/users`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

// Get user by ID
export async function getUserById(id) {
  const res = await fetch(`${BASE_URL}/users/${id}`);
  if (!res.ok) throw new Error("User not found");
  return res.json();
}

// Delete user
export async function deleteUser(id) {
  const res = await fetch(`${BASE_URL}/users/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete user");
  return true;
}

// ✅ Add this function
export async function updateUser(id, updatedUser) {
  try {
    const res = await fetch(`${BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUser),
    });

    if (!res.ok) {
      throw new Error("Failed to update user");
    }

    return await res.json();
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}
