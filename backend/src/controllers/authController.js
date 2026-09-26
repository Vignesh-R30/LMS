const pool = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register a new user
const register = async (req, res) => {
    const { name, email, password, role, secretKey } = req.body;
    
    // Security check for librarian registration
    if (role === 'librarian') {
        if (secretKey !== process.env.LIBRARIAN_SECRET) {
            return res.status(403).json({ message: "Invalid Librarian Secret Key" });
        }
    }
    try {
        // Check if user already exists
        const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: "User already exists with that email" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert into database
        const newUser = await pool.query(
            "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
            [name, email, hashedPassword, role || 'member']
        );

        res.status(201).json({ message: "User registered successfully", user: newUser.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error during registration" });
    }
};

// Login user
const login = async (req, res) => {
    const { email, password, role, secretKey } = req.body;
    try {
        // Check if user exists
        const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const user = userResult.rows[0];

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Validate selected role matches database role
        if (user.role !== role) {
            return res.status(403).json({ message: `You are registered as a ${user.role}, please select the correct login option.` });
        }

        // Security check if trying to log in as a librarian
        if (role === 'librarian') {
            if (secretKey !== process.env.LIBRARIAN_SECRET) {
                return res.status(403).json({ message: "Invalid Librarian Secret Key" });
            }
        }

        // Generate JWT Token
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1d' },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    user: { id: user.id, name: user.name, email: user.email, role: user.role }
                });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error during login" });
    }
};

module.exports = { register, login };
