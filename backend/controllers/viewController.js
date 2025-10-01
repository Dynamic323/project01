const pool = require("../config/db");
const path = require("path");
const fs = require("fs");
// ---------- Single File View ----------
exports.viewUpload = async (req, res) => {
  const { id } = req.params;
  const { type } = req.query;

  try {
    // First check if it's a file
    if (type === "file" || type === "auto") {
      const fileResult = await pool.query(
        "SELECT * FROM file_uploads WHERE id = $1",
        [id]
      );

      if (fileResult.rows.length > 0) {
        const file = fileResult.rows[0];

        // Update views count
        await pool.query(
          "UPDATE file_uploads SET views = views + 1 WHERE id = $1",
          [id]
        );

        // Determine file type for proper display
        let fileType = "other";

        if (file.file_type) {
          const mime = file.file_type.toLowerCase();

          if (mime.startsWith("image/")) fileType = "image";
          else if (mime.startsWith("audio/")) fileType = "audio";
          else if (mime.startsWith("video/")) fileType = "video";
          else if (mime === "application/pdf") fileType = "pdf";
          else if (
            mime.startsWith("text/") ||
            ["application/json", "text/csv", "text/markdown"].includes(mime)
          ) {
            fileType = "text";
          }
        } else {
          // fallback: extension check
          const ext = path.extname(file.file_name).toLowerCase().substring(1);
          if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext)) {
            fileType = "image";
          } else if (["mp3", "wav", "ogg", "aac", "flac"].includes(ext)) {
            fileType = "audio";
          } else if (
            ["mp4", "avi", "mov", "wmv", "flv", "webm"].includes(ext)
          ) {
            fileType = "video";
          } else if (ext === "pdf") {
            fileType = "pdf";
          } else if (["txt", "md", "csv", "json"].includes(ext)) {
            fileType = "text";
          }
        }

        return res.json({
          id: file.id,
          name: file.file_name,
          title: file.title,
          type: fileType,
          originalType: "file",
          dwn_url: `/download/${file.id}`,
          file_url: file.file_url,
          size: file.file_size,
          createdAt: file.created_at,
          views: file.views,
          isPublic: file.is_public,
        });
      }
    }

    // If not a file or type is 'text', check if it's text
    // if (type === "text" || type === "auto") {
    //   const textResult = await pool.query(
    //     "SELECT * FROM text_uploads WHERE id = $1",
    //     [id]
    //   );

    //   if (textResult.rows.length > 0) {
    //     const text = textResult.rows[0];

    //     // Update views count
    //     await pool.query(
    //       "UPDATE text_uploads SET views = views + 1 WHERE id = $1",
    //       [id]
    //     );

    //     return res.json({
    //       id: text.id,
    //       title: text.title,
    //       type: text.type || "text",
    //       originalType: "text",
    //       content: text.text_content,
    //       createdAt: text.created_at,
    //       views: text.views,
    //       isPublic: text.is_public,
    //     });
    //   }
    // }

    // If we get here, nothing was found
    return res.status(404).json({ error: "Upload not found" });
  } catch (err) {
    console.error("Error fetching upload:", err);
    res.status(500).json({ error: "Server error while fetching upload" });
  }
};

// ---------- Helpers ----------
const parsePagination = (req) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 15, 1), 100); // cap at 100
  const offset = (page - 1) * limit;
  const search = (req.query.search || "").trim();
  return { page, limit, offset, search };
};

// ---------- Files ----------
exports.getUserFiles = async (req, res) => {
  const { userId } = req.params;
  const { limit, offset, search } = parsePagination(req);

  try {
    const where =
      search.length > 0
        ? `AND (LOWER(title) LIKE $2 OR LOWER(file_name) LIKE $2)`
        : "";
    const params =
      search.length > 0
        ? [userId, `%${search.toLowerCase()}%`, limit, offset]
        : [userId, limit, offset];

    const dataQuery = `
      SELECT *
      FROM file_uploads
      WHERE user_id = $1 ${where}
      ORDER BY created_at DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}
    `;

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM file_uploads
      WHERE user_id = $1 ${where}
    `;

    const [dataRes, countRes] = await Promise.all([
      pool.query(dataQuery, params),
      pool.query(
        countQuery,
        search.length > 0 ? [userId, `%${search.toLowerCase()}%`] : [userId]
      ),
    ]);

    res.json({
      total: parseInt(countRes.rows[0].total, 10),
      files: dataRes.rows,
    });
  } catch (err) {
    console.error("Error fetching user files:", err);
    res.status(500).json({ error: "Server error while fetching user files" });
  }
};

// ---------- Texts ----------
exports.getUserTexts = async (req, res) => {
  const { userId } = req.params;
  const { limit, offset, search } = parsePagination(req);

  try {
    const where = search.length > 0 ? `AND LOWER(title) LIKE $2` : "";
    const params =
      search.length > 0
        ? [userId, `%${search.toLowerCase()}%`, limit, offset]
        : [userId, limit, offset];

    const dataQuery = `
      SELECT *
      FROM text_uploads
      WHERE user_id = $1 ${where}
      ORDER BY created_at DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}
    `;
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM text_uploads
      WHERE user_id = $1 ${where}
    `;

    const [dataRes, countRes] = await Promise.all([
      pool.query(dataQuery, params),
      pool.query(
        countQuery,
        search.length > 0 ? [userId, `%${search.toLowerCase()}%`] : [userId]
      ),
    ]);

    res.json({
      total: parseInt(countRes.rows[0].total, 10),
      texts: dataRes.rows,
    });
  } catch (err) {
    console.error("Error fetching user texts:", err);
    res.status(500).json({ error: "Server error while fetching user texts" });
  }
};

// ---------- All (files + texts) ----------
exports.getUserAll = async (req, res) => {
  const { userId } = req.params;
  const { limit, offset, search } = parsePagination(req);

  try {
    const searchSql =
      search.length > 0
        ? `AND (LOWER(title) LIKE $2 OR LOWER(file_name) LIKE $2)`
        : "";
    const params =
      search.length > 0
        ? [userId, `%${search.toLowerCase()}%`, limit, offset]
        : [userId, limit, offset];

    // Combine with UNION for one result set
    const dataQuery = `
      SELECT id, title, created_at, 'file' AS type, file_name, file_url, file_size, file_type, views
      FROM file_uploads
      WHERE user_id = $1 ${searchSql}
      UNION ALL
      SELECT id, title, created_at, 'text' AS type, NULL AS file_name, NULL AS file_url, NULL AS file_size, NULL AS file_type, views
      FROM text_uploads
      WHERE user_id = $1 ${searchSql}
      ORDER BY created_at DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}
    `;

    const countQuery = `
      SELECT (
        SELECT COUNT(*) FROM file_uploads WHERE user_id = $1 ${searchSql}
      ) +
      (
        SELECT COUNT(*) FROM text_uploads WHERE user_id = $1 ${searchSql}
      ) AS total
    `;

    const [dataRes, countRes] = await Promise.all([
      pool.query(dataQuery, params),
      pool.query(
        countQuery,
        search.length > 0 ? [userId, `%${search.toLowerCase()}%`] : [userId]
      ),
    ]);

    res.json({
      total: parseInt(countRes.rows[0].total, 10),
      uploads: dataRes.rows,
    });
  } catch (err) {
    console.error("Error fetching user all uploads:", err);
    res.status(500).json({ error: "Server error while fetching user uploads" });
  }
};
