const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  allowExitOnIdle: true,
  family: 4, // 👈 force IPv4 only
});

pool.on("error", (err) => {
console.error("Unexpected error on idle pg client", err);
});

module.exports = pool;