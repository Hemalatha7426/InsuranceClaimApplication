import React, { useEffect, useState } from 'react';
import './CustomerDetail.css';
import * as CustomerService from '../utils/api';   // ✅ FIXED import

export default function CustomerDetail({ customerId }) {
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    if (customerId) {
      CustomerService.getCustomerById(customerId)   // ✅ use correct API function
        .then((c) => {
          // Map same fields you used in CustomerList
          setCustomer({
            ...c,
            id: c.customerId,
            phoneNumber: c.phone,
          });
        })
        .catch(console.error);
    }
  }, [customerId]);

  if (!customer) return <div className="card-grid">No customer selected</div>;

  return (
    <div className="card-grid">
      <h3>Customer Details</h3>
      <div className="detail-card">
        <div><strong>ID:</strong> {customer.id}</div>
        <div><strong>Name:</strong> {customer.name}</div>
        <div><strong>Email:</strong> {customer.email}</div>
        <div><strong>Phone:</strong> {customer.phoneNumber}</div>
        <div><strong>Policy:</strong> {customer.policyNumber}</div>
      </div>
    </div>
  );
}
