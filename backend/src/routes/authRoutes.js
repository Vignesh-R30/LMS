const express = require("express");
const router = express.Router();
const { register, login, switchRole, getUsersByRole } = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login
router.post("/login", login);

// PUT /api/auth/switch-role
router.put("/switch-role", auth, switchRole);

// GET /api/auth/users/:role
router.get("/users/:role", auth, getUsersByRole);

module.exports = router;
