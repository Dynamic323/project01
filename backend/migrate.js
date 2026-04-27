require("./config/env");
const pool = require("./config/db");

async function migrate() {
    try {
        console.log("Adding cloudinary_public_id to file_uploads...");
        await pool.query(`
            ALTER TABLE file_uploads 
            ADD COLUMN IF NOT EXISTS cloudinary_public_id TEXT
        `);
        console.log("✅ Column added successfully.");
    } catch (err) {
        console.error("❌ Migration error:", err);
    } finally {
        process.exit();
    }
}

migrate();
