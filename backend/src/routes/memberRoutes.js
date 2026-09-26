const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getMembers, addMember, updateMember, deleteMember } = require("../controllers/memberController");

// Protect all member routes with authentication middleware
router.use(authMiddleware);

// GET /api/members (Librarian only)
router.get("/", getMembers);

// POST /api/members (Librarian only)
router.post("/", addMember);

// PUT /api/members/:id (Librarian only)
router.put("/:id", updateMember);

// DELETE /api/members/:id (Librarian only)
router.delete("/:id", deleteMember);

module.exports = router;
