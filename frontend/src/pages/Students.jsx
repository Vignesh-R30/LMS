import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import './Books.css'; 

const Students = () => {
    const [students, setStudents] = useState([]);
    const { user } = useContext(AuthContext);

    const fetchStudents = async () => {
        try {
            const res = await api.get('/auth/users/member');
            setStudents(res.data);
        } catch (err) {
            console.error("Error fetching students", err);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    // Only librarians should access this page
    if (user?.role !== 'librarian') {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px', color: '#EF4444' }}>
                <h2>Access Denied</h2>
                <p>Only librarians can view registered students.</p>
            </div>
        );
    }

    return (
        <div className="books-page">
            <div className="page-header">
                <h1 className="page-title">Registered Students</h1>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email Address</th>
                            <th>Date Joined</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.length > 0 ? students.map(student => (
                            <tr key={student.id}>
                                <td><strong>{student.name}</strong></td>
                                <td>{student.email}</td>
                                <td>{student.created_at ? String(student.created_at).substring(0, 10) : 'N/A'}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="3" className="empty-state">
                                    No registered students found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Students;
