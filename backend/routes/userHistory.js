const express = require("express");
const router = express.Router();

const { getUserUploadHistory } = require("../controllers/historyController");

router.get("/user-history/:userId", getUserUploadHistory);

module.exports = router;
