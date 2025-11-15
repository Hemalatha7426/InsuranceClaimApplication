import React, { useEffect, useState } from 'react';
import { getAllUsers, deleteUser } from '../utils/api';
import './ManagerList.css';

export default function ManagerList({ navigate }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load users from backend
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getAllUsers();
        // Filter out customers
        const managers = data.filter(user => user.role !== 'CUSTOMER');
        setUsers(managers);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  // Delete manager function
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this manager?")) return;

    try {
      await deleteUser(id);
      // Remove deleted user from state
      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("Failed to delete manager. Try again.");
    }
  };

  if (loading) return <div className="loading">Loading users...</div>;
  if (!users.length) return <div className="empty">No managers found.</div>;

  return (
    <div className="manager-list-container">
      <h2>Manager List</h2>
      <div className="manager-grid">
        {users.map(user => (
          <div key={user.id} className="manager-card">
            <div className="manager-info">
              <p className="manager-name">{user.name}</p>
              <p className="manager-email">{user.email}</p>
            </div>
            <span className={`manager-role ${user.role === 'ADMIN' ? 'admin' : 'manager'}`}>
              {user.role}
            </span>
            <button 
              className="delete-btn" 
              onClick={() => handleDelete(user.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
