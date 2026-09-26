const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getLoans, issueBook, returnBook, getOverdueBooks } = require("../controllers/loanController");

// Protect all loan routes
router.use(authMiddleware);

// GET /api/loans
router.get("/", getLoans);

// GET /api/loans/overdue
router.get("/overdue", getOverdueBooks);

// POST /api/loans/issue
router.post("/issue", issueBook);

// PUT /api/loans/:id/return
router.put("/:id/return", returnBook);

module.exports = router;
