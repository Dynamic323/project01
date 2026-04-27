const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/auth");
const requireAdmin = require("../middleware/adminOnly");

// Placeholder controllers 
const {
  getDashboardStats,
  getAllUsers,
  getAllUploads,
  deleteUserById,
  deleteUploadById,
} = require("../controllers/adminController");

router.use(requireAuth, requireAdmin);

router.get("/stats",            getDashboardStats);  // GET /api/admin/stats         — total users, uploads, storage used
router.get("/users",            getAllUsers);         // GET /api/admin/users          — list all users
router.delete("/users/:id",     deleteUserById);      // DELETE /api/admin/users/:id
router.get("/uploads",          getAllUploads);       // GET /api/admin/uploads        — all uploads across all users
router.delete("/uploads/:id",   deleteUploadById);   // DELETE /api/admin/uploads/:id

module.exports = router;