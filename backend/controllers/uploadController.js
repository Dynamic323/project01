// controllers/uploadController.js
const pool = require("../config/db");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const { v4: uuidv4 } = require("uuid");

const PLAN_LIMIT_MB = 500;

// Stream buffer to Cloudinary instead of uploading from disk
const streamUpload = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (result) resolve(result);
      else reject(error);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

exports.uploadContent = async (req, res) => {
  const userId = req.user.id;
  const { title, expiresAt, isPublic, type, text } = req.body;
  const files = req.files;

  try {
    const userRes = await pool.query("SELECT user_plan FROM users WHERE id = $1", [userId]);
    const userPlan = userRes.rows[0]?.user_plan || "free";

    let expirationDate = expiresAt ? new Date(expiresAt) : null;

    if (userPlan === "free") {
      const maxDays = type === "file" ? 4 : 10;
      const enforcedExpiry = new Date();
      enforcedExpiry.setDate(enforcedExpiry.getDate() + maxDays);
      if (!expirationDate || expirationDate > enforcedExpiry) {
        expirationDate = enforcedExpiry;
      }
    }

    if (type === "file" && files && files.length > 0) {
      const results = [];

      for (const file of files) {
        // Use buffer instead of file.path
        const cloudRes = await streamUpload(file.buffer, {
          folder: `user_${userId}`,
          resource_type: "auto",
        });

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
          type,
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
    return res.status(500).json({ error: "Failed to upload content" });
  }
};