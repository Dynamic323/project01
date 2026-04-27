const pool = require("../config/db");
const cloudinary = require("cloudinary").v2;

exports.deleteUpload = async (req, res) => {
  const { id } = req.params;
  const { type } = req.query;

  if (!type || (type !== "file" && type !== "text")) {
    return res.status(400).json({ error: "Invalid or missing type parameter." });
  }

  try {
    let query;
    if (type === "file") {
      query = "DELETE FROM file_uploads WHERE id = $1 RETURNING *";
    } else {
      query = "DELETE FROM text_uploads WHERE id = $1 RETURNING *";
    }

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Upload not found" });
    }

    // Delete from Cloudinary if it's a file
    if (type === "file") {
      const file = result.rows[0];
      if (file.cloudinary_public_id) {
        await cloudinary.uploader.destroy(file.cloudinary_public_id);
      }
    }

    res.json({ message: `${type} upload deleted successfully` });
  } catch (err) {
    console.error(`Error deleting ${type} upload:`, err);
    res.status(500).json({ error: `Server error while deleting ${type} upload` });
  }
};