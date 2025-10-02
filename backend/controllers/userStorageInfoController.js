// controllers/storage.js
const pool = require("../config/db");
const cloudinary = require("cloudinary").v2; // ensure CLOUDINARY_URL or env vars set

const PLAN_LIMIT_MB = 500; // free plan in MB

// helper: sum all Cloudinary bytes under a prefix (folder)
// assumes you upload with folder: `user_<userId>`
async function getCloudinaryBytesForUser(userId) {
  const prefix = `user_${userId}`; // change if you used a different naming
  let totalBytes = 0;
  let nextCursor = undefined;

  try {
    do {
      const res = await cloudinary.api.resources({
        type: "upload",
        prefix,
        max_results: 500,
        next_cursor: nextCursor,
      });

      const resources = res.resources || [];
      for (const r of resources) {
        totalBytes += Number(r.bytes || 0);
      }

      nextCursor = res.next_cursor;
    } while (nextCursor);
  } catch (err) {
    // If Cloudinary call fails, return 0 and let DB be the source of truth
    console.warn("Cloudinary usage lookup failed:", err.message || err);
  }

  return totalBytes; // bytes
}

exports.userStorageInfoController = async (req, res) => {
  try {
    // get user id from auth (adjust if you use req.user.uid or req.user.id)
    const userId = req.user?.uid || req.user?.id || req.params.userId;
    if (!userId) return res.status(400).json({ error: "user id missing" });

    // 1) DB: total files bytes and count
    const filesSumQ = await pool.query(
      `SELECT COALESCE(SUM(file_size),0) AS used_bytes, COUNT(*) AS files
       FROM file_uploads
       WHERE user_id = $1
         AND (expires_at IS NULL OR expires_at > NOW())`,
      [userId]
    );
    const dbFileBytes = Number(filesSumQ.rows[0].used_bytes || 0);
    const totalFiles = Number(filesSumQ.rows[0].files || 0);

    // 2) DB: breakdown by file categories (Images, Audio, Videos, Documents)
    const catQ = await pool.query(
      `SELECT 
         CASE
           WHEN file_type ILIKE 'image/%' THEN 'Images'
           WHEN file_type ILIKE 'audio/%' THEN 'Audio'
           WHEN file_type ILIKE 'video/%' THEN 'Videos'
           ELSE 'Documents'
         END AS category,
         COALESCE(SUM(file_size),0) AS size_bytes,
         COUNT(*) AS count
       FROM file_uploads
       WHERE user_id = $1
         AND (expires_at IS NULL OR expires_at > NOW())
       GROUP BY category`,
      [userId]
    );

    // normalize categories so order is predictable and missing categories show 0
    const categoryMap = { Images: 0, Documents: 0, Audio: 0, Videos: 0 };
    const fileTypes = [];
    for (const r of catQ.rows) {
      categoryMap[r.category] = 1; // mark present
      fileTypes.push({
        type: r.category,
        size: Number((Number(r.size_bytes || 0) / (1024 * 1024)).toFixed(2)), // MB
        count: Number(r.count || 0),
      });
    }
    // ensure missing ones appear with zeros (keeps UI stable)
    ["Images", "Documents", "Audio", "Videos"].forEach((c) => {
      if (!fileTypes.find((f) => f.type === c)) {
        fileTypes.push({ type: c, size: 0, count: 0 });
      }
    });

    // 3) Text uploads: per-type bytes and counts (type column is 'text' or 'code')
    const textQ = await pool.query(
      `SELECT type,
              COALESCE(SUM(octet_length(content)),0) AS bytes,
              COUNT(*) AS count
       FROM text_uploads
       WHERE user_id = $1
         AND (expires_at IS NULL OR expires_at > NOW())
       GROUP BY type`,
      [userId]
    );

    // Build text object with defaults
    const textTypes = {
      text: { count: 0, amountUsed: 0 }, 
      code: { count: 0, amountUsed: 0 },
    };

    let totalTextBytes = 0;
    for (const r of textQ.rows) {
      const t = r.type; // 'text' or 'code'
      const bytes = Number(r.bytes || 0);
      totalTextBytes += bytes;
      textTypes[t] = {
        count: Number(r.count || 0),
        amountUsed: Number((bytes / (1024 * 1024)).toFixed(3)), // MB (3 dec)
      };
    }

    const totalTextCount =
      (textTypes.text.count || 0) + (textTypes.code.count || 0);

    // 4) Cloudinary bytes (by folder prefix). If you don't set folder on upload this will be 0.
    const cloudBytes = await getCloudinaryBytesForUser(userId);

    // 5) Combine usage:
    //    - For files: to avoid double-counting we use the larger of DB-reported and Cloudinary-reported bytes
    //    - Add text bytes on top
    const dbFilesMB = dbFileBytes / (1024 * 1024);
    const cloudFilesMB = cloudBytes / (1024 * 1024);
    const fileUsedMB = Math.max(dbFilesMB, cloudFilesMB); // takes the safe (higher) value
    const textUsedMB = totalTextBytes / (1024 * 1024);

    const totalUsedMB = Number((fileUsedMB + textUsedMB).toFixed(3));
    const remainingMB = Math.max(
      0,
      Number((PLAN_LIMIT_MB - totalUsedMB).toFixed(3))
    );

    // Final response format exactly like you wanted
    return res.json({
      used: totalUsedMB, // MB used (files + text)
      total: PLAN_LIMIT_MB, // MB
      remaining: remainingMB, // MB
      files: totalFiles,
      text: totalTextCount,
      types: {
        file: fileTypes,
        text: {
          text: textTypes.text, // { count, amountUsed }
          code: textTypes.code, // { count, amountUsed }
        },
      },
    });
  } catch (err) {
    console.error("Storage info error:", err);
    return res.status(500).json({ error: "Failed to fetch storage info" });
  }
};
