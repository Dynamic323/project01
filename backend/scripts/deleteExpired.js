// scripts/deleteExpired.js
require('../config/env');
const pool = require("../config/db");
const cloudinary = require("cloudinary").v2;

const deleteExpiredUploads = async () => {
  try {
    console.log("🕒 Starting expired uploads cleanup...");

    // 1. Delete expired files (those with explicit expires_at or free users > 4 days)
    const expiredFilesQ = await pool.query(`
      SELECT id, cloudinary_public_id 
      FROM file_uploads 
      WHERE (expires_at IS NOT NULL AND expires_at < NOW())
         OR (user_id IN (SELECT id FROM users WHERE user_plan = 'free') AND created_at < NOW() - INTERVAL '4 days')
    `);

    let filesDeleted = 0;
    for (const file of expiredFilesQ.rows) {
      try {
        if (file.cloudinary_public_id) {
          await cloudinary.uploader.destroy(file.cloudinary_public_id);
        }
        await pool.query("DELETE FROM file_uploads WHERE id = $1", [file.id]);
        filesDeleted++;
      } catch (err) {
        console.error(`❌ Failed to delete file ${file.id}:`, err.message);
      }
    }

    // 2. Delete expired text uploads (those with explicit expires_at or free users > 10 days)
    const expiredTextsQ = await pool.query(`
      SELECT id 
      FROM text_uploads 
      WHERE (expires_at IS NOT NULL AND expires_at < NOW())
         OR (user_id IN (SELECT id FROM users WHERE user_plan = 'free') AND created_at < NOW() - INTERVAL '10 days')
    `);

    let textsDeleted = 0;
    for (const text of expiredTextsQ.rows) {
      try {
        await pool.query("DELETE FROM text_uploads WHERE id = $1", [text.id]);
        textsDeleted++;
      } catch (err) {
        console.error(`❌ Failed to delete text upload ${text.id}:`, err.message);
      }
    }

    console.log(`✅ Cleanup complete. Deleted ${filesDeleted} files and ${textsDeleted} text uploads.`);
  } catch (err) {
    console.error("❌ Error during expired uploads cleanup:", err);
  }
};

// Allow running as a standalone script
if (require.main === module) {
  deleteExpiredUploads().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = deleteExpiredUploads;
