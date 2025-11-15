import React, { useState, useEffect } from "react";
import "./App.css";
import CustomerRegistration from "./components/CustomerRegistration";
import CustomerList from "./components/CustomerList";
import CustomerStatus from "./components/CustomerStatus";
import ClaimList from "./components/ClaimList";
import ClaimSubmission from "./components/ClaimSubmission";
import CustomerDetail from "./components/CustomerDetail";
import ClaimDetail from "./components/ClaimDetail";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Home from "./components/Home";
import Login from "./components/Login";
import UserProfile from "./components/UserProfile"; 
import Details from "./components/Details"; 
import ManagerList from "./components/ManagerList"; 
import { getAuth, clearAuth } from "./utils/util";

function App() {
  const [route, setRoute] = useState("login");
  const [role, setRole] = useState("guest");
  const [selectedClaimId, setSelectedClaimId] = useState(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  // ✅ Check if user is already logged in
  useEffect(() => {
    const auth = getAuth();
    if (auth && auth.role) {
      setRole(auth.role.toLowerCase());
      setRoute("home");
    } else {
      setRole("guest");
      setRoute("login");
    }
  }, []);

  // ✅ Navigation helper
  const navigate = (r, id = null, overrideRole = null) => {
    const effectiveRole = overrideRole || role;

    if (effectiveRole === "guest" && r !== "login" && r !== "register") {
      setRoute("login");
    } else {
      setRoute(r);

      if (r === "claim-detail" || r === "details") {
        setSelectedClaimId(id);
      }

      if (r === "customer-detail") {
        setSelectedCustomerId(id);
      }
    }
    window.scrollTo(0, 0);
  };

  // ✅ Logout
  const handleLogout = () => {
    clearAuth();
    setRole("guest");
    setRoute("login");
  };

  // ✅ Render page content
  const renderContent = () => {
    switch (route) {
      case "login":
        return <Login navigate={navigate} setRole={setRole} />;
      case "register":
        return <Register navigate={navigate} />;
      case "home":
        return <Home />;
      case "customers":
        return <CustomerList onView={navigate} />;
      case "new-customer":
        return <CustomerRegistration />;
      case "customer-status":
  return <CustomerStatus />;

      case "claims":
              // ✅ Pass `forAgent` prop to show Approve/Reject buttons
        return <ClaimList onView={navigate} forAgent={role === "admin" || role === "agent"} />;
      case "new-claim":
        return <ClaimSubmission />;
      case "customer-detail":
        return <CustomerDetail customerId={selectedCustomerId} />;
      case "claim-detail":
        return <ClaimDetail />;
      case "visit-claims":
        return <UserProfile />;
      case "details":
        return <Details claimId={selectedClaimId} />;
      case "manager-list":
        return <ManagerList />;
      default:
        return <h2>Page not found</h2>;
    }
  };

  return (
    <div className="app-root">
      <header className="topbar">
        <div className="brand">
          <h1 className="brand-title">Hemspire Insurance</h1>
          <p className="brand-sub">Claims & Customer Management</p>
        </div>
        {role !== "guest" && (
          <Navbar navigate={navigate} role={role} onLogout={handleLogout} />
        )}
      </header>

      <main className="app-content">{renderContent()}</main>

      <footer className="app-footer">
        <div>© {new Date().getFullYear()} Hemspire Insurance. Built with ♥</div>
      </footer>
    </div>
  );
}

export default App;
