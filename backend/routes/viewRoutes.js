const express = require("express");
const router = express.Router();
const {
  viewUpload,
  getUserFiles,
  getUserTexts,
  getUserAll,
} = require("../controllers/viewController");

// Single file view
router.get("/view/:id", viewUpload);

// Added Pagination
router.get("/user/files/:userId", getUserFiles);
router.get("/user/text/:userId", getUserTexts);
router.get("/user/all/:userId", getUserAll);

module.exports = router;
