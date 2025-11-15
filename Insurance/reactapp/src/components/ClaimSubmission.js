import React, { useState, useEffect } from "react";
import "./ClaimSubmission.css";
import { createClaim, getAllCustomers, getAuth } from "../utils/api";

const initial = {
 customerId: "",
 claimType: "Health",
 claimAmount: "",
 incidentDate: "",
 description: "",
 fileUrl: "", // ✅ Added fileUrl field
};

export default function ClaimSubmission() {
 const [form, setForm] = useState(initial);
 const [error, setError] = useState("");
 const [customers, setCustomers] = useState([]);

 // Fetch customers on load
 useEffect(() => {
  getAllCustomers()
   .then(setCustomers)
   .catch(() => setError("Failed to load customers"));
 }, []);

 const onChange = (e) =>
  setForm({ ...form, [e.target.name]: e.target.value });

 const onSubmit = async (e) => {
  e.preventDefault();

  if (
   !form.customerId ||
   !form.claimType ||
   !form.claimAmount ||
   !form.incidentDate ||
   !form.description ||
   !form.fileUrl // ✅ validate fileUrl
  ) {
   setError("All fields are required, including file URL");
   return;
  }

  if (Number(form.claimAmount) <= 0) {
   setError("Claim amount must be positive");
   return;
  }

  try {
   const auth = getAuth();

   const created = await createClaim({
    customer: { customerId:Number(form.customerId) },
    user:{userId:auth.userId} ,
    claimType: form.claimType,
    claimAmount: Number(form.claimAmount),
    incidentDate: form.incidentDate,
    description: form.description,
    fileUrl: form.fileUrl, // ✅ send fileUrl to backend
   });

   alert(`Claim submitted (ID: ${created.id})`);
   setForm(initial);
   setError("");
  } catch (err) {
   setError(err.message || "Failed to submit claim");
  }
 };

 return (
  <div className="form-container">
   <h2>Submit a New Claim</h2>
   <form onSubmit={onSubmit}>
    <div className="form-group">
     <label>Customer</label>
     <select
      name="customerId"
      value={form.customerId}
      onChange={onChange}
     >
      <option value="">-- Select Customer --</option>
      {customers.map((c) => (
       <option key={c.customerId} value={c.customerId}>
        {c.name} (#{c.customerId})
       </option>
      ))}
     </select>
    </div>

    <div className="form-group">
     <label>Claim Type</label>
     <select name="claimType" value={form.claimType} onChange={onChange}>
      <option>Health</option>
      <option>Accident</option>
      <option>Vehicle</option>
      <option>Other</option>
     </select>
    </div>

    <div className="form-group">
     <label>Claim Amount</label>
     <input
      name="claimAmount"
      value={form.claimAmount}
      onChange={onChange}
     />
    </div>

    <div className="form-group">
     <label>Incident Date</label>
     <input
      type="date"
      name="incidentDate"
      value={form.incidentDate}
      onChange={onChange}
     />
    </div>

    <div className="form-group">
     <label>Description</label>
     <textarea
      name="description"
      value={form.description}
      onChange={onChange}
     />
    </div>

    <div className="form-group">
     <label>File URL</label> {/* ✅ New input for fileUrl */}
     <input
      type="url"
      name="fileUrl"
      placeholder="Enter file URL"
      value={form.fileUrl}
      onChange={onChange}
     />
    </div>

    <div className="form-actions">
     <button className="btn-primary" type="submit">
      Submit Claim
     </button>
    </div>

    {error && (
     <div className="error" role="alert">
      {error}
     </div>
    )}
   </form>
  </div>
 );
}

