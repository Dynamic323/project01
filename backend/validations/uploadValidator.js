// validations/uploadValidator.js
const validateUpload = (req, res, next) => {
  // console.log(req.body);

  const { text, type } = req.body;
  const file = req.files;

  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!text && !file) {
    return res
      .status(400)
      .json({ error: "Either text content or a file is required." });
  }

  if (type && !["text", "code", "file"].includes(type)) {
    return res.status(400).json({ error: "Invalid type specified." });
  }

  if (file && Array.isArray(file)) {
    for (const f of file) {
      if (f.size > maxSize) {
        return res
          .status(400)
          .json({ error: "File size exceeds the limit (10MB)." });
      }
    }
  } else if (file && file.size > maxSize) {
    return res
      .status(400)
      .json({ error: "File size exceeds the limit (10MB)." });
  }

  // If text is provided, ensure the type is 'text' or 'code'
  if (text && type !== "text" && type !== "code") {
    return res
      .status(400)
      .json({ error: "If providing text, the type must be 'text' or 'code'." });
  }

  next();
};

module.exports = validateUpload;
