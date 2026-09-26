import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import './Books.css'; 

const Members = () => {
    const [librarians, setLibrarians] = useState([]);
    const { user } = useContext(AuthContext);

    const fetchLibrarians = async () => {
        try {
            const res = await api.get('/auth/users/librarian');
            setLibrarians(res.data);
        } catch (err) {
            console.error("Error fetching librarians", err);
        }
    };

    useEffect(() => {
        fetchLibrarians();
    }, []);

    if (user?.role !== 'librarian') {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px', color: '#EF4444' }}>
                <h2>Access Denied</h2>
                <p>Only librarians can view the librarian access list.</p>
            </div>
        );
    }

    return (
        <div className="books-page">
            <div className="page-header">
                <h1 className="page-title">Registered Librarians</h1>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {librarians.length > 0 ? librarians.map(lib => (
                            <tr key={lib.id}>
                                <td><strong>{lib.name}</strong></td>
                                <td>{lib.email}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="3" className="empty-state">
                                    No registered librarians found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Members;
