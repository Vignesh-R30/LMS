const pool = require("../config/database");

// Get all members
const getMembers = async (req, res) => {
    // Basic role check
    if (req.user.role !== 'librarian') {
        return res.status(403).json({ message: "Access denied. Librarians only." });
    }

    try {
        const result = await pool.query("SELECT * FROM members ORDER BY membership_date DESC, id DESC");
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error fetching members" });
    }
};

// Add a new member
const addMember = async (req, res) => {
    if (req.user.role !== 'librarian') {
        return res.status(403).json({ message: "Access denied. Librarians only." });
    }

    const { name, email, phone } = req.body;
    try {
        const newMember = await pool.query(
            "INSERT INTO members (name, email, phone) VALUES ($1, $2, $3) RETURNING *",
            [name, email, phone]
        );
        res.status(201).json(newMember.rows[0]);
    } catch (err) {
        console.error(err.message);
        if (err.code === '23505') { // Postgres unique violation error code
            return res.status(400).json({ message: "A member with this email already exists" });
        }
        res.status(500).json({ message: "Server error adding member" });
    }
};

// Update a member
const updateMember = async (req, res) => {
    if (req.user.role !== 'librarian') {
        return res.status(403).json({ message: "Access denied. Librarians only." });
    }

    const { id } = req.params;
    const { name, email, phone } = req.body;

    try {
        const updatedMember = await pool.query(
            "UPDATE members SET name = $1, email = $2, phone = $3 WHERE id = $4 RETURNING *",
            [name, email, phone, id]
        );

        if (updatedMember.rows.length === 0) {
            return res.status(404).json({ message: "Member not found" });
        }

        res.json(updatedMember.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error updating member" });
    }
};

// Delete a member
const deleteMember = async (req, res) => {
    if (req.user.role !== 'librarian') {
        return res.status(403).json({ message: "Access denied. Librarians only." });
    }

    const { id } = req.params;
    try {
        // Prevent deleting a member who hasn't returned their books
        const activeLoans = await pool.query("SELECT * FROM loans WHERE member_id = $1 AND status = 'issued'", [id]);
        if (activeLoans.rows.length > 0) {
            return res.status(400).json({ message: "Cannot delete member with active unreturned books." });
        }

        const result = await pool.query("DELETE FROM members WHERE id = $1 RETURNING *", [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Member not found" });
        }

        res.json({ message: "Member deleted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error deleting member" });
    }
};

module.exports = { getMembers, addMember, updateMember, deleteMember };
