import React, { useEffect, useState } from 'react';
import { getAllClaims, getAllCustomers } from '../utils/api';

export default function Details({ claimId, onBack }) {
 const [claim, setClaim] = useState(null);
 const [customers, setCustomers] = useState([]);

 useEffect(() => {
  const fetchData = async () => {
   try {
    const claims = await getAllClaims();
    const customersData = await getAllCustomers();
    setCustomers(customersData);

    const found = claims.find((c) => c.id === parseInt(claimId));
    setClaim(found || null);
   } catch (err) {
    console.error(err);
   }
  };

  if (claimId) {
   fetchData();
  }
 }, [claimId]);

 const getCustomerName = (customerId) =>
  customers.find((c) => c.id === customerId)?.name || `#${customerId}`;

 if (!claim) return <div>Loading...</div>;

 return (
  <div className="container mt-4" style={{ maxWidth: '600px', margin: '0 auto' }}>
   

   <div style={{ 
    padding: '20px', 
    borderRadius: '10px', 
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
    backgroundColor: '#f9f9f9' 
   }}>
    <h2 style={{ marginBottom: '15px' }}>Claim Details (ID: {claim.id})</h2>
    <p><strong>Customer:</strong> {getCustomerName(claim.customerId)}</p>
    <p><strong>Type:</strong> {claim.claimType}</p>
    <p><strong>Amount:</strong> ${claim.claimAmount?.toFixed(2)}</p>
    <p><strong>Status:</strong> {claim.status}</p>
    <p><strong>Submitted:</strong> {claim.submissionDate}</p>
    <p><strong>Description:</strong></p>
    <p style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}>
     {claim.description}
    </p>
   </div>
  </div>
 );
}

