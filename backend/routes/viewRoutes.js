const express = require("express");
const router = express.Router();
const { viewUpload } = require("../controllers/viewController");

router.get("/view/:id", viewUpload);

// Export the router
module.exports = router;



