const express = require("express");
const router = express.Router();

const {
  userStorageInfoController,
} = require("../controllers/userStorageInfoController");

router.get("/storage-info/:userId", userStorageInfoController);

module.exports = router;
