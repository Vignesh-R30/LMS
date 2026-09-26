const express = require("express");
const router = express.Router();
const { register, login, switchRole } = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login
router.post("/login", login);

// PUT /api/auth/switch-role
router.put("/switch-role", auth, switchRole);

module.exports = router;
