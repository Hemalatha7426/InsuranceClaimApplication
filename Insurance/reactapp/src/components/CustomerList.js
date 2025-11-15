// src/components/CustomerList.jsx
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import * as CustomerService from "../utils/api";
import "./CustomerList.css";

export default function CustomerList({ onView }) {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await CustomerService.getAllCustomers();
      setCustomers(data.map(c => ({ ...c, id: c.customerId, phoneNumber: c.phone })));
    } catch (err) {
      setError(err.message || "Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await CustomerService.deleteCustomer(deleteTarget.id);
      setDeleteTarget(null);
      loadCustomers();
    } catch (err) {
      setError(err.message || "Failed to delete customer");
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center mt-5">
      <div className="spinner-border text-primary" role="status" />
      <span className="ms-2">Loading customers...</span>
    </div>
  );

  if (!customers.length) return (
    <div className="container mt-5">
      <div className="alert alert-info text-center shadow-sm">
        <i className="bi bi-people"></i> No customers found. Use "New Customer" to add one.
      </div>
    </div>
  );

  const filteredCustomers = customers.filter(c => c.policyNumber?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="container mt-5">
      <h3 className="mb-4 text-center text-primary fw-bold">
        <i className="bi bi-people-fill me-2"></i>Customer List
      </h3>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="customer-search-container">
        <input type="text" className="form-control w-50" placeholder="Search by policy number..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="row g-4">
        {filteredCustomers.map(customer => (
          <div key={customer.id} className="col-md-4">
            <div className="card h-100 shadow-sm border-0 customer-card">
              <div className="card-body text-center">
                <div style={{
                  width: 60, height: 60, borderRadius: "50%",
                  background: "#0d6efd", margin: "0 auto 15px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: "bold", fontSize: 22
                }}>{customer.name.charAt(0).toUpperCase()}</div>
                <h5 className="fw-bold">{customer.name}</h5>
                <p className="text-muted mb-1">{customer.email}</p>
                <p className="small text-secondary mb-0"><strong>📞</strong> {customer.phoneNumber || "-"}</p>
                {/* <p className="small text-secondary"><strong>📝</strong> {customer.policyNumber || "-"}</p> */}
              </div>
              <div className="card-footer bg-white border-0 d-flex justify-content-between">
                <button className="btn btn-outline-primary btn-sm" onClick={() => onView("customer-detail", customer.id)}><i className="bi bi-eye"></i> View</button>
                <button className="btn btn-outline-danger btn-sm" onClick={() => setDeleteTarget(customer)}><i className="bi bi-trash"></i> Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {deleteTarget && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title"><i className="bi bi-exclamation-triangle-fill me-2"></i> Confirm Delete</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setDeleteTarget(null)}></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete <b>{deleteTarget.name}</b>?
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>Cancel</button>
                <button className="btn btn-danger" onClick={confirmDelete}>Yes, Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .customer-card { transition: transform 0.2s, box-shadow 0.2s; }
        .customer-card:hover { transform: translateY(-5px); box-shadow: 0 6px 18px rgba(0,0,0,0.15); }
      `}</style>
    </div>
  );
}
