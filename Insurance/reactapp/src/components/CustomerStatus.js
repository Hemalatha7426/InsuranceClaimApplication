import React, { useState, useEffect } from "react";
import { getMyClaims, getAuth } from "../utils/api";
import "./ClaimList.css";

export default function CustomerStatus() {
  const [claims, setClaims] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const pageSize = 5;

  // ================== Fetch Claims ==================
  const fetchClaims = async () => {
    setLoading(true);
    setError("");

    try {
      const auth = getAuth();
      if (!auth || !auth.customerId) {
        setError("Not logged in or customerId missing. Please log in again.");
        setClaims([]);
        return;
      }

      const data = await getMyClaims(); // uses auth.customerId internally
      setClaims(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load claims. Please try again.");
      setClaims([]);
    } finally {
      setLoading(false);
    }
  };

  // ================== Auto-fetch + refresh ==================
  useEffect(() => {
    fetchClaims();
    const interval = setInterval(fetchClaims, 5000); // auto-refresh every 5s
    return () => clearInterval(interval);
  }, []);

  // ================== Sorting ==================
  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
  };

  // ================== Filter + Sort + Pagination ==================
  const filteredClaims = claims.filter(
    (c) => filter === "ALL" || c.status === filter
  );

  const sortedClaims = [...filteredClaims].sort((a, b) => {
    if (!sortField) return 0;
    const valA = a[sortField];
    const valB = b[sortField];
    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const paginatedClaims = sortedClaims.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // ================== Render ==================
  return (
    <div className="claim-list">
      <h2>My Claims</h2>

      <div className="filter-bar">
        <label>Status: </label>
        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="ALL">All</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="UNDER_REVIEW">Under Review</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th onClick={() => handleSort("id")}>ID</th>
            <th>Type</th>
            <th onClick={() => handleSort("claimAmount")}>Amount</th>
            <th onClick={() => handleSort("status")}>Status</th>
            <th onClick={() => handleSort("submissionDate")}>Submitted</th>
            <th>File</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>Loading claims...</td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan="6" style={{ color: "red", textAlign: "center" }}>{error}</td>
            </tr>
          ) : paginatedClaims.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>No claims found for selected status.</td>
            </tr>
          ) : (
            paginatedClaims.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.claimType}</td>
                <td>{c.claimAmount?.toFixed(2)}</td>
                <td>{c.status}</td>
                <td>{new Date(c.submissionDate).toLocaleString()}</td>
                <td>
                  {c.fileUrl ? (
                    <a href={c.fileUrl} target="_blank" rel="noopener noreferrer">View File</a>
                  ) : (
                    <span className="text-muted">No file</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
        <span>Page {page} of {Math.ceil(sortedClaims.length / pageSize)}</span>
        <button
          onClick={() => setPage((p) => (p * pageSize < sortedClaims.length ? p + 1 : p))}
          disabled={page * pageSize >= sortedClaims.length}
        >
          Next
        </button>
      </div>
    </div>
  );
}
