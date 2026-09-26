const pool = require("../config/database");

// Get all books (with optional search query)
const getBooks = async (req, res) => {
    try {
        const { search } = req.query;
        let query = "SELECT * FROM books";
        let queryParams = [];

        if (search) {
            query += " WHERE title ILIKE $1 OR author ILIKE $1 OR isbn ILIKE $1 OR category ILIKE $1";
            queryParams.push(`%${search}%`);
        }

        query += " ORDER BY created_at DESC";

        const result = await pool.query(query, queryParams);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error fetching books" });
    }
};

// Get a single book by ID
const getBookById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM books WHERE id = $1", [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Book not found" });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error fetching book" });
    }
};

// Add a new book (Librarian only)
const addBook = async (req, res) => {
    // Basic role check
    if (req.user.role !== 'librarian') {
        return res.status(403).json({ message: "Access denied. Librarians only." });
    }

    const { title, author, isbn, category, quantity, read_link } = req.body;
    try {
        const newBook = await pool.query(
            "INSERT INTO books (title, author, isbn, category, quantity, available_quantity, read_link) VALUES ($1, $2, $3, $4, $5, $5, $6) RETURNING *",
            [title, author, isbn, category, quantity, read_link]
        );
        res.status(201).json(newBook.rows[0]);
    } catch (err) {
        console.error(err.message);
        if (err.code === '23505') { // Postgres unique violation error code
            return res.status(400).json({ message: "A book with this ISBN already exists" });
        }
        res.status(500).json({ message: "Server error adding book" });
    }
};

// Update a book (Librarian only)
const updateBook = async (req, res) => {
    if (req.user.role !== 'librarian') {
        return res.status(403).json({ message: "Access denied. Librarians only." });
    }

    const { id } = req.params;
    const { title, author, isbn, category, quantity, read_link } = req.body;

    try {
        // Find existing book to calculate available_quantity difference
        const existingBook = await pool.query("SELECT * FROM books WHERE id = $1", [id]);
        if (existingBook.rows.length === 0) {
            return res.status(404).json({ message: "Book not found" });
        }
        
        const oldQuantity = existingBook.rows[0].quantity;
        const oldAvailable = existingBook.rows[0].available_quantity;
        
        // Calculate new available quantity
        const quantityDifference = quantity - oldQuantity;
        const newAvailable = oldAvailable + quantityDifference;

        if (newAvailable < 0) {
            return res.status(400).json({ message: "Cannot reduce quantity below currently issued books." });
        }

        const updatedBook = await pool.query(
            "UPDATE books SET title = $1, author = $2, isbn = $3, category = $4, quantity = $5, available_quantity = $6, read_link = $7 WHERE id = $8 RETURNING *",
            [title, author, isbn, category, quantity, newAvailable, read_link, id]
        );

        res.json(updatedBook.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error updating book" });
    }
};

// Delete a book (Librarian only)
const deleteBook = async (req, res) => {
    if (req.user.role !== 'librarian') {
        return res.status(403).json({ message: "Access denied. Librarians only." });
    }

    const { id } = req.params;
    try {
        const result = await pool.query("DELETE FROM books WHERE id = $1 RETURNING *", [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.json({ message: "Book deleted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error deleting book" });
    }
};

module.exports = { getBooks, getBookById, addBook, updateBook, deleteBook };
