const express = require("express");
const { deleteUpload } = require("../controllers/deleteController");
const router = express.Router();

router.delete("/delete/:id", deleteUpload);

module.exports = router;
