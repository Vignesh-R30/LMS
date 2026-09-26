import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './pages/DashboardLayout';
import Home from './pages/Home';
import Books from './pages/Books';
import Librarians from './pages/Librarians';
import Loans from './pages/Loans';
import Students from './pages/Students';

// A simple protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return <div style={{color: 'white', textAlign: 'center', marginTop: '50px'}}>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes (Dashboard) */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Home />} />
        <Route path="books" element={<Books />} />
        <Route path="librarians" element={<Librarians />} />
        <Route path="loans" element={<Loans />} />
        <Route path="students" element={<Students />} />
      </Route>

      {/* Redirect all unknown URLs to Dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default App;
