const pool = require("../config/db");

exports.getUserUploadHistory = async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const files = await pool.query(
      "SELECT *, 'file' AS type FROM file_uploads WHERE user_id = $1",
      [userId]
    );

    const texts = await pool.query(
      "SELECT *, 'text' AS type FROM text_uploads WHERE user_id = $1",
      [userId]
    );

    // combine everything
    const history = [...files.rows, ...texts.rows];

    // sort so newest upload is first
    history.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.json(history); // return all rows
  } catch (err) {
    console.error("Error fetching upload history:", err);
    res
      .status(500)
      .json({ error: "Server error while fetching upload history" });
  }
};
