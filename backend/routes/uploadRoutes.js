const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { uploadContent } = require("../controllers/uploadController");
const { viewUpload } = require("../controllers/viewController");
const { deleteUpload } = require("../controllers/deleteController");
const validateUpload = require("../validations/uploadValidator");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const verifyToken = require("../middleware/auth");
const upload = multer({ storage });

router.post("/", verifyToken, upload.array("file", 10), validateUpload, uploadContent); // POST /api/uploads
router.get("/:id", viewUpload);                                               // GET  /api/uploads/:id
router.delete("/:id", deleteUpload);                                             // DELETE /api/uploads/:id

module.exports = router;