// Load environment variables
require("dotenv").config();

// Core dependencies
const express = require("express");
const app = express();
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const cors = require("cors");

// Firebase Admin SDK to verify user tokens (optional auth)
const admin = require("firebase-admin");
const serviceAccount = require("./firebase-admin.json"); // ⚠️ You must download this from Firebase console

// PostgreSQL connection (Neon.tech)
const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Cloudinary config for file upload
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Init Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Middlewares
app.use(cors());
app.use(express.json());

// Multer setup for file upload (memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 🔐 Middleware to decode optional Firebase token
const optionalAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (token) {
    try {
      const decoded = await admin.auth().verifyIdToken(token);
      req.user = decoded; // Add user to request
    } catch (err) {
      console.log("Invalid token, proceeding as anonymous");
    }
  }
  next();
};

// 🚀 Upload Route (Handles both text and file)
app.post(
  "/api/upload",
  optionalAuth,
  upload.single("file"),
  async (req, res) => {
    try {
      const { text, isPublic, expiresAt } = req.body;
      const file = req.file;

      const id = uuidv4(); // unique ID for shareable link
      const user_id = req.user?.uid || null;

      let content = null;
      let file_url = null;
      let file_name = null;
      let file_type = null;
      let type = "text"; // default

      // Case 1: Text Upload
      if (text) {
        content = text;
        type = "text";
      }

      // Case 2: File Upload
      if (file) {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload_stream(
          { resource_type: "auto" },
          async (error, result) => {
            if (error)
              return res.status(500).json({ error: "Cloudinary error" });

            file_url = result.secure_url;
            file_name = file.originalname;
            file_type = file.mimetype;
            type = "file";

            // Save metadata in DB
            await pool.query(
              `INSERT INTO uploads (id, type, content, file_url, file_name, file_type, is_public, user_id, expires_at)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
              [
                id,
                type,
                null,
                file_url,
                file_name,
                file_type,
                isPublic === "true",
                user_id,
                expiresAt || null,
              ]
            );

            return res.json({ link: `${process.env.FRONTEND_URL}/v/${id}` });
          }
        );
        // Write file buffer to cloudinary stream
        result.end(file.buffer);
        return;
      }

      // Save text upload to DB
      await pool.query(
        `INSERT INTO uploads (id, type, content, is_public, user_id, expires_at)
       VALUES ($1,$2,$3,$4,$5,$6)`,
        [id, type, content, isPublic === "true", user_id, expiresAt || null]
      );

      return res.json({ link: `${process.env.FRONTEND_URL}/v/${id}` });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Upload failed" });
    }
  }
);

// 📄 Get a single upload by ID
app.get("/api/view/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM uploads WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Not found" });

    // Optional: increment views
    await pool.query("UPDATE uploads SET views = views + 1 WHERE id = $1", [
      id,
    ]);

    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch upload" });
  }
});

// 🟢 Root
app.get("/", (req, res) => {
  res.send("DyShareX Backend is Running ✅");
});

// 🔥 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
