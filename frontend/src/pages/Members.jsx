import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
// Reusing styles from Books for consistency
import './Books.css'; 

const Members = () => {
    const [members, setMembers] = useState([]);
    const { user } = useContext(AuthContext);

    // Form state
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '', email: '', phone: ''
    });

    const fetchMembers = async () => {
        try {
            const res = await api.get('/members');
            setMembers(res.data);
        } catch (err) {
            console.error("Error fetching members", err);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const handleAddMember = async (e) => {
        e.preventDefault();
        try {
            await api.post('/members', formData);
            setShowForm(false);
            setFormData({ name: '', email: '', phone: '' });
            fetchMembers(); // refresh list
        } catch (err) {
            alert(err.response?.data?.message || 'Error adding member');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this member?")) return;
        try {
            await api.delete(`/members/${id}`);
            fetchMembers();
        } catch (err) {
            // This will show our backend error if they have active loans!
            alert(err.response?.data?.message || 'Error deleting member'); 
        }
    };

    // Only librarians should access this page
    if (user?.role !== 'librarian') {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px', color: '#EF4444' }}>
                <h2>Access Denied</h2>
                <p>Only librarians can manage library members.</p>
            </div>
        );
    }

    return (
        <div className="books-page">
            <div className="page-header">
                <h1 className="page-title">Library Members</h1>
                <button className="primary-button" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : '+ Add New Member'}
                </button>
            </div>

            {showForm && (
                <div className="form-card">
                    <h3>Register a New Member</h3>
                    <form onSubmit={handleAddMember} className="book-form">
                        <input type="text" placeholder="Full Name" required
                            value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                        <input type="email" placeholder="Email Address" required
                            value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                        <input type="text" placeholder="Phone Number" required
                            value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                        <button type="submit" className="primary-button">Save Member</button>
                    </form>
                </div>
            )}

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email Address</th>
                            <th>Phone Number</th>
                            <th>Date Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.length > 0 ? members.map(member => (
                            <tr key={member.id}>
                                <td><strong>{member.name}</strong></td>
                                <td>{member.email}</td>
                                <td>{member.phone}</td>
                                <td>{new Date(member.membership_date || member.created_at || new Date()).toLocaleDateString()}</td>
                                <td>
                                    <button className="delete-button" onClick={() => handleDelete(member.id)}>Remove</button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="empty-state">
                                    No members found.
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
