const { v4: uuidv4 } = require("uuid");
const pool = require("../config/db");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const uploadContent = async (req, res) => {
  try {
    const { text, expiresAt, isPublic, title, type, Texttype, user_id } =
      req.body;

    // Collect files from multer
    let files = [];
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      files = req.files;
    } else if (req.file) {
      files = [req.file];
    }

    // ----- TEXT UPLOAD -----
    if (text && files.length === 0) {
      const id = uuidv4().slice(0, 8);
      const finalType = Texttype || type || "text";
      const expires_at = expiresAt
        ? new Date(expiresAt)
        : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

      await pool.query(
        `INSERT INTO text_uploads (
          id, title, type, content, expires_at, is_public, user_id, views
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,DEFAULT)`,
        [
          id,
          title || null,
          finalType,
          text,
          expires_at,
          isPublic !== undefined ? isPublic : true,
          user_id || null,
        ]
      );

      return res.status(201).json({
        success: true,
        message: "Text upload successful",
        data: { id, type: finalType, content: text },
      });
    }

    // ----- FILE UPLOAD -----
    if (files.length > 0) {
      const responses = [];
      for (const file of files) {
        const id = uuidv4().slice(0, 8);
        const expires_at = expiresAt
          ? new Date(expiresAt)
          : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(file.path, {
          folder: `user_${user_id}`,
          resource_type: "auto",
        });
        if (!result || !result.secure_url) {
          return res.status(500).json({ error: "Failed to upload file" });
        }

        await pool.query(
          `INSERT INTO file_uploads (
            id, title, file_url, file_name, file_type,
            file_size, expires_at, is_public, user_id, views
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,DEFAULT)`,
          [
            id,
            title || null,
            result.secure_url,
            file.originalname,
            file.mimetype, // <-- actual MIME type
            file.size, // <-- bytes
            expires_at,
            isPublic !== undefined ? isPublic : true,
            user_id || null,
          ]
        );

        // Delete local temp file
        fs.unlink(file.path, (err) => {
          if (err)
            console.error("Failed to delete local file:", file.path, err);
        });

        responses.push({
          id,
          file_url: result.secure_url,
          file_name: file.originalname,
          file_type: file.mimetype,
          file_size: file.size,
        });
      }

      return res.status(201).json({
        success: true,
        message: "File upload successful",
        data: responses,
      });
    }

    // Nothing provided
    return res
      .status(400)
      .json({ error: "Either text content or a file is required." });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { uploadContent };
