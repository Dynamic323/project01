const express = require("express");
const router = express.Router();
const {
  getUserFiles,
  getUserTexts,
  getUserAll,
} = require("../controllers/viewController");
const { getUserUploadHistory } = require("../controllers/historyController");
const {
  userStorageInfoController,
} = require("../controllers/userStorageInfoController");

const verifyToken = require("../middleware/auth");

router.get("/:userId/uploads", verifyToken, getUserAll);
router.get("/:userId/uploads/files", verifyToken, getUserFiles);
router.get("/:userId/uploads/texts", verifyToken, getUserTexts);
router.get("/:userId/history", verifyToken, getUserUploadHistory);
router.get("/:userId/storage", verifyToken, userStorageInfoController);

module.exports = router;
