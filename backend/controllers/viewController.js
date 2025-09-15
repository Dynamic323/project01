const pool = require("../config/db");

exports.viewUpload = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM file_uploads WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Upload not found" });
    }

    // Optional: Increment views
    await pool.query(
      "UPDATE file_uploads SET views = views + 1 WHERE id = $1",
      [id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching upload:", err);
    res.status(500).json({ error: "Server error while fetching upload" });
  }
};

exports.getUserUploads = async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    // Get files
    const fileResult = await pool.query(
      "SELECT *, 'file' as type FROM file_uploads WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );

    // Get texts
    const textResult = await pool.query(
      "SELECT *, 'text' as type FROM text_uploads WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );

    // Merge into one array
    let uploads = [...fileResult.rows, ...textResult.rows];

    // Sort all by created_at (so both tables are ordered together)
    uploads.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    if (uploads.length === 0) {
      return res.status(404).json({ error: "No uploads found for this user" });
    }

    res.json(uploads);
  } catch (err) {
    console.error("Error fetching user uploads:", err);
    res.status(500).json({ error: "Server error while fetching user uploads" });
  }
};
