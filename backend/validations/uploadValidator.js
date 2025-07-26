// validations/uploadValidator.js
const validateUpload = (req, res, next) => {
  const { text, type } = req.body;
  const file = req.file;

  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!text && !file) {
    return res.status(400).json({ error: "Either text or file is required" });
  }

  if (file && file.size > maxSize) {
    return res.status(400).json({ error: "File too large (max 10MB)" });
  }

  if (type && !["text", "code", "file"].includes(type)) {
    return res.status(400).json({ error: "Invalid type" });
  }

  next();
};

module.exports = validateUpload;
