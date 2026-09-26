import React, { useContext } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Dashboard.css';

const DashboardLayout = () => {
  const { user, logout, switchRole } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSwitchRole = async () => {
    try {
      if (user?.role === 'librarian') {
        // Switch down to student
        if(window.confirm("Are you sure you want to drop your admin privileges and switch to a student view?")) {
            await switchRole('member', '');
            window.location.reload();
        }
      } else {
        // Switch up to librarian
        const secret = window.prompt("Enter Librarian Secret Key to upgrade your privileges:");
        if (secret) {
            await switchRole('librarian', secret);
            window.location.reload();
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to switch role');
    }
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>LMS Admin</h2>
        </div>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-link">Home</Link>
          <Link to="/dashboard/books" className="nav-link">Books</Link>
          <Link to="/dashboard/members" className="nav-link">Librarians</Link>
          <Link to="/dashboard/students" className="nav-link">Students</Link>
          <Link to="/dashboard/loans" className="nav-link">Loans</Link>
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className="user-role">{user?.role}</span>
          </div>
          <button onClick={handleSwitchRole} className="switch-role-button" style={{
              background: 'rgba(255, 255, 255, 0.1)', 
              color: 'white', 
              border: 'none', 
              padding: '8px', 
              borderRadius: '6px', 
              marginBottom: '10px', 
              cursor: 'pointer',
              width: '100%'
          }}>
            Switch to {user?.role === 'librarian' ? 'Student' : 'Librarian'}
          </button>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </aside>
      <main className="main-content">
        {/* Outlet renders the matched child route component */}
        <Outlet /> 
      </main>
    </div>
  );
};

export default DashboardLayout;
