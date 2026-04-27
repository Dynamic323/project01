const express = require("express");
const router = express.Router();
const {
  viewUpload,
  getUserFiles,
  getUserTexts,
  getUserAll,
} = require("../controllers/viewController");

// Single file view
router.get("/:id", viewUpload);

module.exports = router;
