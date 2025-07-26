// scripts/deleteExpired.js
require("dotenv").config();
const pool = require("../config/db");

const deleteExpiredUploads = async () => {
  try {
    const result = await pool.query(
      "DELETE FROM uploads WHERE expires_at IS NOT NULL AND expires_at < NOW()"
    );
    console.log(`✅ Deleted ${result.rowCount} expired uploads`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error deleting expired uploads:", err);
    process.exit(1);
  }
};

deleteExpiredUploads();
