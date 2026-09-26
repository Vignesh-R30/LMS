const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Initialize database connection
require("./config/database");

app.use(cors());
app.use(express.json());

// Import Routes
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const loanRoutes = require("./routes/loanRoutes");

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/loans", loanRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Library Management System Backend is running!"
    });
});

// TEMPORARY SETUP ROUTE TO CREATE TABLES
app.get("/api/setup-database", async (req, res) => {
    try {
        const pool = require("./config/database");
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'member',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS books (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                author VARCHAR(255) NOT NULL,
                isbn VARCHAR(100) UNIQUE,
                category VARCHAR(100),
                quantity INT DEFAULT 1,
                available_quantity INT DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS loans (
                id SERIAL PRIMARY KEY,
                book_id INT REFERENCES books(id) ON DELETE CASCADE,
                member_id INT REFERENCES users(id) ON DELETE CASCADE,
                loan_date DATE DEFAULT CURRENT_DATE,
                due_date DATE,
                return_date DATE,
                status VARCHAR(50) DEFAULT 'issued'
            );
        `);
        res.send("<h1>Database Tables Created Successfully! 🎉</h1><p>You can now close this tab and go back to Vercel to register as a librarian.</p>");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating tables: " + err.message);
    }
});

// TEMPORARY UPGRADE ROUTE TO ADD CREATED_AT TO USERS TABLE AND FIX BOOKS TABLE
app.get("/api/upgrade-database", async (req, res) => {
    try {
        const pool = require("./config/database");
        await pool.query(`
            ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
            ALTER TABLE books ADD COLUMN IF NOT EXISTS category VARCHAR(100);
            ALTER TABLE books ADD COLUMN IF NOT EXISTS quantity INT DEFAULT 1;
            
            ALTER TABLE loans DROP CONSTRAINT IF EXISTS loans_member_id_fkey;
            ALTER TABLE loans ADD CONSTRAINT loans_member_id_fkey FOREIGN KEY (member_id) REFERENCES users(id) ON DELETE CASCADE;
            
            ALTER TABLE loans ADD COLUMN IF NOT EXISTS due_date DATE;
            
            DROP TABLE IF EXISTS members CASCADE;
        `);
        res.send("<h1>Database Upgraded Successfully! 🎉</h1><p>The Date Joined column has been added to users, Books table fixed, and Loans now reference Users.</p>");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error upgrading tables: " + err.message);
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
    
    // Automatic Background Job: Return overdue books automatically
    // Runs every 1 hour (3600000 ms)
    setInterval(async () => {
        try {
            const pool = require("./config/database");
            console.log("[Auto-Return Job] Checking for overdue books...");
            
            await pool.query('BEGIN');
            
            // 1. Mark overdue loans as returned and collect their book IDs
            const returnedLoans = await pool.query(`
                UPDATE loans
                SET status = 'returned', return_date = CURRENT_DATE
                WHERE status = 'issued' AND due_date <= CURRENT_DATE
                RETURNING book_id
            `);
            
            if (returnedLoans.rows.length > 0) {
                // 2. Increment the available quantity for the returned books
                for (const row of returnedLoans.rows) {
                    await pool.query(
                        "UPDATE books SET available_quantity = available_quantity + 1 WHERE id = $1",
                        [row.book_id]
                    );
                }
                console.log(`[Auto-Return Job] Automatically returned ${returnedLoans.rows.length} overdue books.`);
            } else {
                console.log("[Auto-Return Job] No overdue books found right now.");
            }
            
            await pool.query('COMMIT');
        } catch (err) {
            console.error("[Auto-Return Job] Error:", err.message);
            const pool = require("./config/database");
            await pool.query('ROLLBACK');
        }
    }, 1000 * 60 * 60); // 1 hour
});