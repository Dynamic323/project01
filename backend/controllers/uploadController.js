const { v4: uuidv4 } = require("uuid");
const pool = require("../config/db");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const uploadContent = async (req, res) => {
  try {
    const { text, expiresAt, isPublic, title, type, Texttype, user_id } =
      req.body;
    const previewOnly = req.query.preview === "true"; // Check for preview query parameter
    console.log(req.body);
    // Collect files from multer
    let files = [];
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      files = req.files;
    } else if (req.file) {
      files = [req.file];
    }
    // ----- TEXT UPLOAD -----
    if (text && files.length === 0) {
      if (previewOnly) {
        return res.status(200).json({
          success: true,
          message: "Preview of text content",
          data: { text, title },
        });
      }
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
      // Split the title string into an array of file names
      const fileNames = title ? title.split(", ") : [];
      // Check if the number of file names matches the number of files
      if (fileNames.length !== files.length) {
        console.warn(
          `Number of file names (${fileNames.length}) does not match number of files (${files.length})`
        );
      }
      // Preview the files with their names
      const filesWithNames = files.map((file, index) => ({
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        title: fileNames[index] || file.originalname,
      }));
      console.log("Preview of files with their names:", filesWithNames);
      if (previewOnly) {
        return res.status(200).json({
          success: true,
          message: "Preview of files with their names",
          data: filesWithNames,
        });
      }
      // Continue with the file upload process
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
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
        // Use the corresponding file name from the array, or the file's original name as fallback
        const fileTitle = fileNames[i] || file.originalname;
        await pool.query(
          `INSERT INTO file_uploads (
            id, title, file_url, file_name, file_type,
            file_size, expires_at, is_public, user_id, views
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,DEFAULT)`,
          [
            id,
            fileTitle,
            result.secure_url,
            file.originalname,
            file.mimetype,
            file.size,
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
          title: fileTitle,
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

const downloadFile = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT file_path, file_name, file_type FROM file_uploads WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("File not found");
    }

    const file = result.rows[0];
    const filePath = path.join(__dirname, "../uploads", file.file_path);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send("File not found on server");
    }

    // Set appropriate headers for download
    res.setHeader(
      "Content-disposition",
      `inline; filename="${file.file_name}"`
    );
    res.setHeader("Content-type", file.file_type);

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on("error", (err) => {
      console.error("Error streaming file:", err);
      res.status(500).end();
    });
  } catch (err) {
    console.error("Error downloading file:", err);
    res.status(500).send("Server error while downloading file");
  }
};
module.exports = { uploadContent, downloadFile };
