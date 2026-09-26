import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import './Books.css';

const Books = () => {
    const [books, setBooks] = useState([]);
    const [search, setSearch] = useState('');
    const [categorySearch, setCategorySearch] = useState('');
    const { user } = useContext(AuthContext);

    // Form state for adding new books
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '', author: '', isbn: '', category: '', quantity: 1, read_link: ''
    });

    // Fetch books from the backend API
    const fetchBooks = async (searchQuery = '', categoryQuery = '') => {
        try {
            const res = await api.get(`/books?search=${searchQuery}&category=${categoryQuery}`);
            setBooks(res.data);
        } catch (err) {
            console.error("Error fetching books", err);
        }
    };

    // Run when the page loads
    useEffect(() => {
        fetchBooks();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchBooks(search, categorySearch);
    };

    const handleAddBook = async (e) => {
        e.preventDefault();
        try {
            await api.post('/books', formData);
            setShowForm(false);
            setFormData({ title: '', author: '', isbn: '', category: '', quantity: 1, read_link: '' });
            fetchBooks(search, categorySearch); // Refresh the list after adding
        } catch (err) {
            alert(err.response?.data?.message || 'Error adding book');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this book?")) return;
        try {
            await api.delete(`/books/${id}`);
            fetchBooks(search, categorySearch); // Refresh the list after deleting
        } catch (err) {
            alert(err.response?.data?.message || 'Error deleting book');
        }
    };

    return (
        <div className="books-page">
            <div className="page-header">
                <h1 className="page-title">Book Catalog</h1>
                {/* Only show the Add Book button if the user is a librarian */}
                {user?.role === 'librarian' && (
                    <button className="primary-button" onClick={() => setShowForm(!showForm)}>
                        {showForm ? 'Cancel' : '+ Add New Book'}
                    </button>
                )}
            </div>

            {showForm && (
                <div className="form-card">
                    <h3>Add a New Book</h3>
                    <form onSubmit={handleAddBook} className="book-form">
                        <input type="text" placeholder="Title" required
                            value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                        <input type="text" placeholder="Author" required
                            value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} />
                        <input type="text" placeholder="ISBN" required
                            value={formData.isbn} onChange={e => setFormData({...formData, isbn: e.target.value})} />
                        <input type="text" placeholder="Category"
                            value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                        <input type="url" placeholder="Website / Read Link (Optional)"
                            value={formData.read_link} onChange={e => setFormData({...formData, read_link: e.target.value})} />
                        <input type="number" placeholder="Quantity" min="1" required
                            value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
                        <button type="submit" className="primary-button">Save Book</button>
                    </form>
                </div>
            )}

            <div className="search-bar">
                <form onSubmit={handleSearch}>
                    <input 
                        type="text" 
                        placeholder="Search books by title, author, category or ISBN..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <input 
                        type="text" 
                        placeholder="Search by category..." 
                        value={categorySearch}
                        onChange={(e) => setCategorySearch(e.target.value)}
                    />
                    <button type="submit" className="secondary-button">Search</button>
                </form>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Category</th>
                            <th>ISBN</th>
                            <th>Available / Total</th>
                            {user?.role === 'librarian' && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {books.length > 0 ? books.map(book => (
                            <tr key={book.id}>
                                <td><strong>{book.title}</strong></td>
                                <td>{book.author}</td>
                                <td>{book.category}</td>
                                <td>{book.isbn}</td>
                                <td>
                                    <span className={book.available_quantity > 0 ? 'badge-success' : 'badge-danger'}>
                                        {book.available_quantity} / {book.quantity}
                                    </span>
                                </td>
                                {user?.role === 'librarian' && (
                                    <td>
                                        <button className="delete-button" onClick={() => handleDelete(book.id)}>Delete</button>
                                    </td>
                                )}
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={user?.role === 'librarian' ? 6 : 5} className="empty-state">
                                    No books found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Books;
