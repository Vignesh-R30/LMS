const pool = require("../config/database");

// Get all loans (with book and member details)
const getLoans = async (req, res) => {
    try {
        const query = `
            SELECT l.*, b.title as book_title, m.name as member_name, m.email as member_email
            FROM loans l
            JOIN books b ON l.book_id = b.id
            JOIN members m ON l.member_id = m.id
            ORDER BY l.issue_date DESC
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error fetching loans" });
    }
};

// Issue a book
const issueBook = async (req, res) => {
    if (req.user.role !== 'librarian') {
        return res.status(403).json({ message: "Access denied. Librarians only." });
    }

    const { book_id, member_id, due_date } = req.body;

    try {
        // 1. Check if the book exists and is available
        const bookResult = await pool.query("SELECT * FROM books WHERE id = $1", [book_id]);
        if (bookResult.rows.length === 0) {
            return res.status(404).json({ message: "Book not found" });
        }

        const book = bookResult.rows[0];
        if (book.available_quantity <= 0) {
            return res.status(400).json({ message: "Book is currently out of stock" });
        }

        // 2. Check if member exists
        const memberResult = await pool.query("SELECT * FROM members WHERE id = $1", [member_id]);
        if (memberResult.rows.length === 0) {
            return res.status(404).json({ message: "Member not found" });
        }

        // Start a database transaction
        await pool.query('BEGIN');

        // 3. Create the loan record
        const loanResult = await pool.query(
            "INSERT INTO loans (book_id, member_id, due_date, status) VALUES ($1, $2, $3, 'issued') RETURNING *",
            [book_id, member_id, due_date]
        );

        // 4. Decrease the available quantity of the book
        await pool.query(
            "UPDATE books SET available_quantity = available_quantity - 1 WHERE id = $1",
            [book_id]
        );

        // Commit the transaction
        await pool.query('COMMIT');

        res.status(201).json({ message: "Book issued successfully", loan: loanResult.rows[0] });
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error(err.message);
        res.status(500).json({ message: "Server error issuing book" });
    }
};

// Return a book
const returnBook = async (req, res) => {
    if (req.user.role !== 'librarian') {
        return res.status(403).json({ message: "Access denied. Librarians only." });
    }

    const { id } = req.params; // Loan ID

    try {
        // 1. Find the active loan
        const loanResult = await pool.query("SELECT * FROM loans WHERE id = $1 AND status = 'issued'", [id]);
        if (loanResult.rows.length === 0) {
            return res.status(404).json({ message: "Active loan not found" });
        }

        const loan = loanResult.rows[0];

        // Start transaction
        await pool.query('BEGIN');

        // 2. Update the loan status to 'returned' and set return_date
        const updatedLoan = await pool.query(
            "UPDATE loans SET status = 'returned', return_date = CURRENT_DATE WHERE id = $1 RETURNING *",
            [id]
        );

        // 3. Increase the available quantity of the book
        await pool.query(
            "UPDATE books SET available_quantity = available_quantity + 1 WHERE id = $1",
            [loan.book_id]
        );

        // Commit transaction
        await pool.query('COMMIT');

        res.json({ message: "Book returned successfully", loan: updatedLoan.rows[0] });
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error(err.message);
        res.status(500).json({ message: "Server error returning book" });
    }
};

// Get overdue books
const getOverdueBooks = async (req, res) => {
    if (req.user.role !== 'librarian') {
        return res.status(403).json({ message: "Access denied. Librarians only." });
    }

    try {
        const query = `
            SELECT l.*, b.title as book_title, m.name as member_name, m.email as member_email
            FROM loans l
            JOIN books b ON l.book_id = b.id
            JOIN members m ON l.member_id = m.id
            WHERE l.status = 'issued' AND l.due_date < CURRENT_DATE
            ORDER BY l.due_date ASC
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error fetching overdue books" });
    }
};

module.exports = { getLoans, issueBook, returnBook, getOverdueBooks };
