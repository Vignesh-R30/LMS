import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
    const { user } = useContext(AuthContext);

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Dashboard Overview</h1>
            </div>
            
            <div style={{
                background: 'rgba(30, 41, 59, 0.5)',
                padding: '30px',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                <h2>Welcome back, {user?.name}!</h2>
                <p style={{ color: '#94A3B8', marginTop: '10px', lineHeight: '1.6' }}>
                    This is your Library Management System. Use the sidebar to navigate through your library catalog.
                    <br/><br/>
                    As a <strong>{user?.role}</strong>, you have access to specific features tailored to your permissions.
                </p>
            </div>
        </div>
    );
};

export default Home;
