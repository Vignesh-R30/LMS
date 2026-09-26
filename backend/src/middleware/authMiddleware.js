const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    // Get token from header (usually sent as 'Bearer <token>')
    const tokenHeader = req.header("Authorization");

    // Check if no token is provided
    if (!tokenHeader) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        // Extract the actual token string from "Bearer <token>"
        const token = tokenHeader.split(" ")[1] || tokenHeader;
        
        // Verify token against our secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add the user data from the token to the request object
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid or expired token." });
    }
};
