import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('member');
    const [secretKey, setSecretKey] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password, role, secretKey);
            navigate('/dashboard'); // Go to dashboard after login
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-title">Welcome Back</h1>
                <p className="auth-subtitle">Log in to Library Management System</p>
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Email Address</label>
                        <input 
                            type="email" 
                            placeholder="librarian@example.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>
                    
                    <div className="input-group">
                        <label>Login As</label>
                        <select value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="member">Student / Member</option>
                            <option value="librarian">Librarian</option>
                        </select>
                    </div>
                    
                    {/* Conditionally show the Secret Key field if Librarian is selected */}
                    {role === 'librarian' && (
                        <div className="input-group" style={{ animation: 'fadeIn 0.3s' }}>
                            <label>Librarian Secret Key</label>
                            <input 
                                type="password" 
                                placeholder="Enter admin key" 
                                value={secretKey}
                                onChange={(e) => setSecretKey(e.target.value)}
                                required 
                            />
                        </div>
                    )}
                    
                    <button type="submit" className="auth-button">Sign In</button>
                </form>

                <div className="auth-footer">
                    Don't have an account? <Link to="/register" className="auth-link">Register</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
