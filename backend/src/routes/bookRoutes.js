const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getBooks, getBookById, addBook, updateBook, deleteBook } = require("../controllers/bookController");

// Protect all book routes with authentication middleware
router.use(authMiddleware);

// GET /api/books (Allows search with ?search=keyword)
router.get("/", getBooks);

// GET /api/books/:id
router.get("/:id", getBookById);

// POST /api/books (Librarian only)
router.post("/", addBook);

// PUT /api/books/:id (Librarian only)
router.put("/:id", updateBook);

// DELETE /api/books/:id (Librarian only)
router.delete("/:id", deleteBook);

module.exports = router;
