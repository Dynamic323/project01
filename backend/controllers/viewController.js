const pool = require("../config/db");

exports.viewUpload = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM uploads WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Upload not found" });
    }

    // Optional: Increment views
    await pool.query("UPDATE uploads SET views = views + 1 WHERE id = $1", [
      id,
    ]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching upload:", err);
    res.status(500).json({ error: "Server error while fetching upload" });
  }
};
