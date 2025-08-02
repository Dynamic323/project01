// controllers/uploadController.js
const { v4: uuidv4 } = require("uuid");
const pool = require("../config/db");
const cloudinary = require("../config/cloudinary");

const uploadContent = async (req, res) => {
  const request = req.body;

  try {
    const {
      text,
      expiresAt,
      isPublic,
      title,
      type: inputType,
      userId,
    } = req.body;
    let files = [];
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      files = req.files;
    } else if (req.file) {
      files = [req.file];
    }
    if (!text && (!files || files.length === 0)) {
      return res.status(400).json({ error: "Either text or file is required" });
    }

    const id = uuidv4().slice(0, 8); // Shorten UUID for easier URLs
    if (!id) {
      return res.status(500).json({ error: "Failed to generate unique ID" });
    }
    const finalType = text ? inputType || "text" : "file";
    const content = text || null;

    const expires_at = expiresAt
      ? new Date(expiresAt)
      : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // +3 days

    let file_urls = [];
    let file_names = [];
    let file_types = [];

    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: "auto",
      });
      if (!result || !result.secure_url) {
        return res.status(500).json({ error: "Failed to upload file" });
      }
      file_urls.push(result.secure_url);
      file_names.push(result.original_filename);
      file_types.push(result.resource_type);
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
        file_urls.join(","),
        file_names.join(","),
        file_types.join(","),
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
        file_urls: file_urls.join(",").split(",").filter(Boolean),
        file_names: file_names.join(",").split(",").filter(Boolean),
        file_types: file_types.join(",").split(",").filter(Boolean),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { uploadContent };
