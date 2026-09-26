import React, { useContext } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Dashboard.css';

const DashboardLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
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
          <Link to="/dashboard/members" className="nav-link">Members</Link>
          <Link to="/dashboard/loans" className="nav-link">Loans</Link>
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className="user-role">{user?.role}</span>
          </div>
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
