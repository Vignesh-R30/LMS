import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import './Books.css';

const Loans = () => {
    const [loans, setLoans] = useState([]);
    const [books, setBooks] = useState([]);
    const [members, setMembers] = useState([]);
    const { user } = useContext(AuthContext);

    // Form state
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        book_id: '', member_id: '', due_date: ''
    });

    const fetchData = async () => {
        try {
            // Fetch everything we need in parallel to load the page faster
            const [loansRes, booksRes, membersRes] = await Promise.all([
                api.get('/loans'),
                api.get('/books'),
                api.get('/auth/users/member')
            ]);
            setLoans(loansRes.data);
            setBooks(booksRes.data);
            setMembers(membersRes.data);
        } catch (err) {
            console.error("Error fetching data", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleIssueBook = async (e) => {
        e.preventDefault();
        try {
            await api.post('/loans/issue', formData);
            setShowForm(false);
            setFormData({ book_id: '', member_id: '', due_date: '' });
            fetchData(); // Refresh everything so available_quantity updates automatically
        } catch (err) {
            alert(err.response?.data?.message || 'Error issuing book');
        }
    };

    const handleReturn = async (id) => {
        if (!window.confirm("Confirm returning this book?")) return;
        try {
            await api.put(`/loans/${id}/return`);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Error returning book');
        }
    };

    return (
        <div className="books-page">
            <div className="page-header">
                <h1 className="page-title">Book Loans & Returns</h1>
                {user?.role === 'librarian' && (
                    <button className="primary-button" onClick={() => setShowForm(!showForm)}>
                        {showForm ? 'Cancel' : '+ Issue a Book'}
                    </button>
                )}
            </div>

            {showForm && user?.role === 'librarian' && (
                <div className="form-card">
                    <h3>Issue Book to Member</h3>
                    <form onSubmit={handleIssueBook} className="book-form">
                        <select required
                            value={formData.book_id} onChange={e => setFormData({...formData, book_id: e.target.value})}>
                            <option value="">-- Select Book --</option>
                            {/* Only show books that have more than 0 available quantity */}
                            {books.filter(b => b.available_quantity > 0).map(book => (
                                <option key={book.id} value={book.id}>{book.title} (Available: {book.available_quantity})</option>
                            ))}
                        </select>

                        <select required
                            value={formData.member_id} onChange={e => setFormData({...formData, member_id: e.target.value})}>
                            <option value="">-- Select Member --</option>
                            {members.map(member => (
                                <option key={member.id} value={member.id}>{member.name} ({member.email})</option>
                            ))}
                        </select>

                        <input type="date" required placeholder="Due Date"
                            value={formData.due_date} onChange={e => setFormData({...formData, due_date: e.target.value})} />
                        
                        <button type="submit" className="primary-button">Issue Book</button>
                    </form>
                </div>
            )}

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Book Title</th>
                            <th>Issued To</th>
                            <th>Issue Date</th>
                            <th>Due Date</th>
                            <th>Status</th>
                            {user?.role === 'librarian' && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {loans.length > 0 ? loans.map(loan => {
                            // Check if the book is overdue based on today's date
                            const isOverdue = loan.status === 'issued' && new Date(loan.due_date) < new Date();
                            
                            return (
                                <tr key={loan.id}>
                                    <td><strong>{loan.book_title}</strong></td>
                                    <td>{loan.member_name}</td>
                                    <td>{new Date(loan.loan_date).toLocaleDateString()}</td>
                                    <td>
                                        <span style={{ color: isOverdue ? '#EF4444' : 'inherit', fontWeight: isOverdue ? 'bold' : 'normal' }}>
                                            {new Date(loan.due_date).toLocaleDateString()}
                                        </span>
                                    </td>
                                    <td>
                                        {/* Dynamic styling depending on whether it's issued, returned, or overdue */}
                                        <span className={loan.status === 'returned' ? 'badge-success' : (isOverdue ? 'badge-danger' : 'badge-success')} 
                                              style={{ background: loan.status === 'issued' && !isOverdue ? 'rgba(234, 179, 8, 0.15)' : '', color: loan.status === 'issued' && !isOverdue ? '#EAB308' : '' }}>
                                            {loan.status === 'issued' ? (isOverdue ? 'Overdue' : 'Issued') : 'Returned'}
                                        </span>
                                    </td>
                                    {user?.role === 'librarian' && (
                                        <td>
                                            {loan.status === 'issued' ? (
                                                <button className="primary-button" style={{ padding: '6px 12px', fontSize: '13px' }} onClick={() => handleReturn(loan.id)}>Return Book</button>
                                            ) : (
                                                <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Returned on {new Date(loan.return_date).toLocaleDateString()}</span>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan={user?.role === 'librarian' ? 6 : 5} className="empty-state">
                                    No loans found. Issue a book to get started!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Loans;
