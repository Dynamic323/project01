require("./config/env");
const pool = require("./config/db");

async function inspectSchema() {
    try {
        console.log("Inspecting file_uploads table...");
        const columns = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'file_uploads'
        `);
        console.log("file_uploads columns:", columns.rows);

        console.log("\nInspecting users table...");
        const userColumns = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'users'
        `);
        console.log("users columns:", userColumns.rows);

        console.log("\nChecking text_uploads table...");
        const textColumns = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'text_uploads'
        `);
        console.log("text_uploads columns:", textColumns.rows);
    } catch (err) {
        console.error("Error inspecting schema:", err);
    } finally {
        process.exit();
    }
}

inspectSchema();
