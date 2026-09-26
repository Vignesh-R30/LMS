const { Pool } = require("pg");
require("dotenv").config();

// Render provides a DATABASE_URL when you connect a database to a web service
// If DATABASE_URL exists, we use it (Production). Otherwise, we use local vars (Development).
const pool = process.env.DATABASE_URL 
    ? new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false } // Required by Render and most cloud DBs
    })
    : new Pool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    });

pool.connect()
    .then(() => console.log("Successfully connected to PostgreSQL database!"))
    .catch((err) => console.error("Database connection error:", err.stack));

module.exports = pool;
