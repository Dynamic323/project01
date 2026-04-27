const express = require("express");
const router = express.Router();
const { register, login, logout, getMe, updateProfile } = require("../controllers/authController");
const verifyToken = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", verifyToken, getMe);
router.put("/update-profile", verifyToken, updateProfile);

module.exports = router;
