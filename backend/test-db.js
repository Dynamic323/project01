require("./config/env");
const pool = require("./config/db");

async function test() {
    try {
        console.log("DATABASE_URL present:", !!process.env.DATABASE_URL);
        console.log("Testing connection...");
        const timeRes = await pool.query("SELECT NOW()");
        console.log("Connection successful:", timeRes.rows[0]);
    } catch (err) {
        console.error("Database error:", err);
    } finally {
        process.exit();
    }
}

test();
