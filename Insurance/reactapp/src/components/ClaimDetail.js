import React, { useState, useEffect } from 'react';
import './ClaimDetail.css';
import ClaimService from '../utils/ClaimService';

export default function ClaimDetail({ claimId, role = 'agent' }) {
  const [claim, setClaim] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {

    async function fetchClaim() {
      const allClaims = await ClaimService.getAll();
      const found = allClaims.find(c => c.id === claimId) || {
        id: claimId,
        customerName: 'John Doe',
        description: 'Accident damage to car',
        status: 'PENDING',
      };
      setClaim(found);
      setStatus(found.status);
    }
    fetchClaim();
  }, [claimId]);

  const handleUpdate = async () => {
    const updated = await ClaimService.updateStatus(claim.id, status);
    setClaim(prev => ({ ...prev, status: updated.status }));
    alert('Claim status updated successfully.');
  };

  if (!claim) {
    return <div className="claim-detail loading">Loading claim details...</div>;
  }

  return (
    <div className="claim-detail">
      <h2>Claim Details</h2>
      <p><strong>ID:</strong> {claim.id}</p>
      <p><strong>Customer:</strong> {claim.customerName}</p>
      <p><strong>Description:</strong> {claim.description}</p>

      {role === 'agent' && (
        <div className="status-edit">
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <button onClick={handleUpdate} className="btn-primary">
            Update Status
          </button>
        </div>
      )}

      {role === 'customer' && (
        <p><strong>Status:</strong> {claim.status}</p>
      )}
    </div>
  );
}
                                                                                                             
