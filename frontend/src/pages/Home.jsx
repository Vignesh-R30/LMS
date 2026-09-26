import React, { useContext, useEffect, useState } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
    const { user } = useContext(AuthContext);
    const [myLoans, setMyLoans] = useState([]);

    useEffect(() => {
        if (user?.role === 'member') {
            api.get('/loans/my-loans')
                .then(res => setMyLoans(res.data))
                .catch(err => console.error("Error fetching my loans", err));
        }
    }, [user]);

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
                    As a <strong>{user?.role === 'member' ? 'Student' : 'Librarian'}</strong>, you have access to specific features tailored to your permissions.
                </p>

                {user?.role === 'member' && myLoans.length > 0 && (
                    <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                        <h3 style={{ color: '#EAB308', marginBottom: '15px' }}>Current Issued Books</h3>
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            {myLoans.map(loan => {
                                const isOverdue = new Date(loan.due_date) < new Date();
                                return (
                                    <li key={loan.id} style={{ 
                                        padding: '12px 15px', 
                                        background: 'rgba(0,0,0,0.2)', 
                                        marginBottom: '10px',
                                        borderRadius: '8px',
                                        borderLeft: isOverdue ? '4px solid #EF4444' : '4px solid #EAB308',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div>
                                            <strong>{loan.book_title}</strong>
                                            <div style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>
                                                Issued: {new Date(loan.loan_date).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right', fontSize: '14px' }}>
                                            <div style={{ color: isOverdue ? '#EF4444' : '#fff' }}>
                                                Due: {new Date(loan.due_date).toLocaleDateString()}
                                            </div>
                                            {isOverdue && <strong style={{ color: '#EF4444', fontSize: '12px' }}>OVERDUE</strong>}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
                
                {user?.role === 'member' && myLoans.length === 0 && (
                    <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                        <p style={{ color: '#94A3B8' }}>You currently have no books issued to you.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
