const pool = require("../config/db");

exports.deleteUpload = async (req, res) => {
  const { id } = req.params;
  const { type } = req.query;

  // Validate type parameter
  if (!type || (type !== "file" && type !== "text")) {
    return res.status(400).json({ error: "Invalid or missing type parameter. Use 'file' or 'text'." });
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

    res.json({ message: `${type} upload deleted successfully` });
  } catch (err) {
    console.error(`Error deleting ${type} upload:`, err);
    res.status(500).json({ error: `Server error while deleting ${type} upload` });
  }
};
