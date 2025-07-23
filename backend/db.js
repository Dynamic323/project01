// db.js
const { Pool } = require("pg");
require("dotenv").config();

// Setup PostgreSQL pool using Neon DB
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Important for Neon.tech
  },
});

module.exports = pool;
