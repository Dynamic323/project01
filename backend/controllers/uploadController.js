// controllers/uploadController.js
const { v4: uuidv4 } = require("uuid");
const pool = require("../config/db");
const cloudinary = require("../config/cloudinary");

const uploadContent = async (req, res) => {
  const request = req.body;
  const file = req.file;

  try {
    const {
      text,
      expiresAt,
      isPublic,
      title,
      type: inputType,
      userId,
    } = req.body;

    if (!text && !req.file) {
      return res.status(400).json({ error: "Either text or file is required" });
    }

    const file = req.file;

    const id = uuidv4().slice(0, 8); // Shorten UUID for easier URLs
    if (!id) {
      return res.status(500).json({ error: "Failed to generate unique ID" });
    }
    const finalType = text ? inputType || "text" : "file";
    const content = text || null;

    const expires_at = expiresAt
      ? new Date(expiresAt)
      : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // +3 days

    let file_url = null;
    let file_type = null;
    let file_name = null;

    if (file) {
      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: "auto",
      });

      if (!result || !result.secure_url) {
        return res.status(500).json({ error: "Failed to upload file" });
      }

      file_url = result.secure_url;
      file_type = result.resource_type;
      file_name = result.original_filename;
    }

    await pool.query(
      `INSERT INTO uploads (
          id, title, type, content, file_url, file_name, file_type,
          created_at, expires_at, is_public, user_id, views
        ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,DEFAULT,$8,$9,$10,DEFAULT
        )`,
      [
        id,
        title || null,
        finalType,
        content,
        file_url,
        file_name,
        file_type,
        expires_at,
        isPublic !== undefined ? isPublic : true,
        userId || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Upload successful",
      data: {
        id,
        type: finalType,
        content,
        file_url,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { uploadContent };
