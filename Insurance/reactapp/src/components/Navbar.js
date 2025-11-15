import React from 'react';
import "./Navbar.css";

export default function Navbar({ navigate, role, onLogout }) {
 const normalizedRole = role?.toLowerCase();

 return (
  <nav className="main-nav">
   {normalizedRole !== 'guest' && (
    <button className="nav-link" onClick={() => navigate('home')}>Home</button>
   )}

   {normalizedRole === 'agent' && (
    <>
     <button className="nav-link" onClick={() => navigate('customers')}>Customers</button>
     <button className="nav-link" onClick={() => navigate('claims')}>Claims</button>
     <button className="nav-link" onClick={() => navigate('visit-claims')}>Profile</button>
     <button className="btn-logout" onClick={onLogout}>Logout</button>
    </>
   )}

   {normalizedRole === 'customer' && (
    <>
    {/* <button className="nav-link" onClick={() => navigate('new-customer')}>New Customer</button> */}
     <button className="nav-link" onClick={() => navigate('new-claim')}>Submit Claim</button>
     <button className="nav-link" onClick={() => navigate('visit-claims')}>Profile</button>
    <button className="nav-link" onClick={() => navigate("customer-status")}>My Status</button>
     <button className="btn-logout" onClick={onLogout}>Logout</button>
    </>
   )}

   {normalizedRole === 'admin' && (
    <>
     <button className="nav-link" onClick={() => navigate('customers')}>Customers</button>
     <button className="nav-link" onClick={() => navigate('claims')}>Claims</button>
     <button className="nav-link" onClick={() => navigate('manager-list')}>Manager List</button>
     <button className="nav-link" onClick={() => navigate('visit-claims')}>Profile</button>
     <button className="btn-logout" onClick={onLogout}>Logout</button>
    </>
   )}
  </nav>
 );
}

