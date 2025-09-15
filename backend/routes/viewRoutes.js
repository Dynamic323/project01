const express = require("express");
const router = express.Router();
const { viewUpload } = require("../controllers/viewController");

router.get("/view/:id", viewUpload);

// Route to get all uploads for a particular user
const { getUserUploads } = require("../controllers/viewController");
router.get("/user/:userId", getUserUploads);

// Export the router
module.exports = router;
