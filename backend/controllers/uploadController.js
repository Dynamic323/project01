const { v4: uuidv4 } = require("uuid");
const pool = require("../config/db");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const uploadContent = async (req, res) => {
  try {
    const { text, expiresAt, isPublic, title, type, Texttype, user_id } =
      req.body;
      // console.log(user_id);
      
    let files = [];
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      files = req.files;
    } else if (req.file) {
      files = [req.file];
    }

    // If text upload
    if (text && (!files || files.length === 0)) {
      const id = uuidv4().slice(0, 8);
      const finalType = type;
      const content = text;
      const expires_at = expiresAt
        ? new Date(expiresAt)
        : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

      await pool.query(
        `INSERT INTO text_uploads (
          id, title, type, content, expires_at, is_public, user_id, views
        ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,DEFAULT
        )`,
        [
          id,
          title || null,
          finalType,
          content,
          expires_at,
          isPublic !== undefined ? isPublic : true,
          user_id || null,
        ]
      );

      return res.status(201).json({
        success: true,
        message: "Text upload successful",
        data: {
          id,
          type: finalType,
          content,
        },
      });
    }

    // If file upload
    if (files && files.length > 0) {
      const responses = [];
      for (const file of files) {
        const id = uuidv4().slice(0, 8);
        const expires_at = expiresAt
          ? new Date(expiresAt)
          : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

        const result = await cloudinary.uploader.upload(file.path, {
          resource_type: "auto",
        });
        if (!result || !result.secure_url) {
          return res.status(500).json({ error: "Failed to upload file" });
        }

        // Define finalType for file uploads
        const finalType = "file";

        await pool.query(
          `INSERT INTO file_uploads (
            id, title, file_url, file_name, file_type, expires_at, is_public, user_id, views
          ) VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,DEFAULT
          )`,
          [
            id,
            title || null,
            result.secure_url,
            file.originalname,
            finalType, // always 'file' for file uploads
            expires_at,
            isPublic !== undefined ? isPublic : true,
            user_id || null,
          ]
        );

        fs.unlink(file.path, (err) => {
          if (err)
            console.error("Failed to delete local file:", file.path, err);
        });

        responses.push({
          id,
          file_url: result.secure_url,
          file_name: file.originalname,
          file_type: result.resource_type,
        });
      }

      return res.status(201).json({
        success: true,
        message: "File upload successful",
        data: responses,
      });
    }

    // If neither, error
    return res
      .status(400)
      .json({ error: "Either text content or a file is required." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { uploadContent };
