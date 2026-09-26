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
                                const today = new Date();
                                today.setHours(0, 0, 0, 0); // Reset time for accurate day comparison
                                
                                const dueDate = new Date(loan.due_date);
                                dueDate.setHours(0, 0, 0, 0);
                                
                                const diffTime = dueDate - today;
                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                
                                const isOverdue = diffDays < 0;
                                const isDueSoon = diffDays >= 0 && diffDays <= 3;

                                let borderColor = '#10B981'; // Green (Safe)
                                if (isOverdue) borderColor = '#EF4444'; // Red (Overdue)
                                else if (isDueSoon) borderColor = '#F97316'; // Orange (Due Soon)

                                return (
                                    <li key={loan.id} style={{ 
                                        padding: '12px 15px', 
                                        background: 'rgba(0,0,0,0.2)', 
                                        marginBottom: '10px',
                                        borderRadius: '8px',
                                        borderLeft: `4px solid ${borderColor}`,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div>
                                            <strong>{loan.book_title}</strong>
                                            <div style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>
                                                Issued: {new Date(loan.loan_date).toLocaleDateString()}
                                            </div>
                                            {loan.read_link && (
                                                <a href={loan.read_link} target="_blank" rel="noopener noreferrer" style={{
                                                    display: 'inline-block',
                                                    marginTop: '8px',
                                                    padding: '4px 10px',
                                                    background: '#3B82F6',
                                                    color: '#fff',
                                                    textDecoration: 'none',
                                                    borderRadius: '4px',
                                                    fontSize: '12px',
                                                    fontWeight: 'bold'
                                                }}>
                                                    📖 Read Book
                                                </a>
                                            )}
                                        </div>
                                        <div style={{ textAlign: 'right', fontSize: '14px' }}>
                                            <div style={{ color: isOverdue ? '#EF4444' : (isDueSoon ? '#F97316' : '#fff') }}>
                                                Due: {new Date(loan.due_date).toLocaleDateString()}
                                            </div>
                                            {isOverdue && <strong style={{ color: '#EF4444', fontSize: '12px' }}>OVERDUE</strong>}
                                            {isDueSoon && !isOverdue && <strong style={{ color: '#F97316', fontSize: '12px' }}>DUE IN {diffDays} {diffDays === 1 ? 'DAY' : 'DAYS'}</strong>}
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
