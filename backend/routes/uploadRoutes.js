const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadContent } = require("../controllers/uploadController");
const { viewUpload } = require("../controllers/viewController");
const { deleteUpload } = require("../controllers/deleteController");
const validateUpload = require("../validations/uploadValidator");
const verifyToken = require("../middleware/auth");

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/",
  verifyToken,
  upload.array("file", 10),
  validateUpload,
  uploadContent,
);
router.get("/:id", viewUpload);
router.delete("/:id", deleteUpload);

module.exports = router;
