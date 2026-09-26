import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('member');
    const [secretKey, setSecretKey] = useState('');
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(name, email, password, role, secretKey);
            navigate('/login'); // Go to login after successful registration
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-title">Create Account</h1>
                <p className="auth-subtitle">Join the Library Management System</p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="john@example.com"
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
                        <label>Role</label>
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

                    <button type="submit" className="auth-button">Register</button>
                </form>

                <div className="auth-footer">
                    Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
