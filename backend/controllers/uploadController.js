// controllers/uploadController.js
const pool = require("../config/db");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const PLAN_LIMIT_MB = 500; // free plan in MB

exports.uploadContent = async (req, res) => {
  const userId = req.user.id;
  const { title, expiresAt, isPublic, type, text, type: textType } = req.body;
  const files = req.files;

  try {
    // Check user plan
    const userRes = await pool.query("SELECT user_plan FROM users WHERE id = $1", [userId]);
    const userPlan = userRes.rows[0]?.user_plan || "free";

    let expirationDate = expiresAt ? new Date(expiresAt) : null;

    // Enforce limits for free users
    if (userPlan === "free") {
      const maxDays = (type === "file") ? 4 : 10;
      const enforcedExpiry = new Date();
      enforcedExpiry.setDate(enforcedExpiry.getDate() + maxDays);

      if (!expirationDate || expirationDate > enforcedExpiry) {
        expirationDate = enforcedExpiry;
      }
    }

    if (type === "file" && files && files.length > 0) {
      const results = [];
      for (const file of files) {
        // Upload to Cloudinary
        const cloudRes = await cloudinary.uploader.upload(file.path, {
          folder: `user_${userId}`,
          resource_type: "auto",
        });

        // Insert into DB
        const dbRes = await pool.query(
          `INSERT INTO file_uploads (id, user_id, file_name, file_url, file_size, file_type, cloudinary_public_id, title, expires_at, is_public)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
          [
            uuidv4(),
            userId,
            file.originalname,
            cloudRes.secure_url,
            file.size,
            file.mimetype,
            cloudRes.public_id,
            title || file.originalname,
            expirationDate,
            isPublic === "true" || isPublic === true,
          ]
        );

        // Delete local file
        fs.unlinkSync(file.path);
        results.push(dbRes.rows[0]);
      }
      return res.status(201).json({ message: "Files uploaded successfully", data: results });
    } else if (type === "text" || type === "code") {
      const dbRes = await pool.query(
        `INSERT INTO text_uploads (id, user_id, title, content, type, expires_at, is_public)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
          uuidv4(),
          userId,
          title || "Untitled",
          text,
          textType || type,
          expirationDate,
          isPublic === "true" || isPublic === true,
        ]
      );
      return res.status(201).json({ message: "Text uploaded successfully", data: dbRes.rows[0] });
    } else {
      return res.status(400).json({ error: "Invalid upload type or missing content" });
    }
  } catch (err) {
    console.error("Upload error:", err);
    // Cleanup local files if any on error
    if (files) {
      files.forEach(f => { if (fs.existsSync(f.path)) fs.unlinkSync(f.path); });
    }
    return res.status(500).json({ error: "Failed to upload content" });
  }
};
