const express = require("express");
const router = express.Router();
const {
  getAllUsersController,
  getUserByIdController,
  updateUserByIdByAdminController,
  deleteUserByIdController,
  updateUserByIdBySelfController,
  changePasswordController,
} = require("../controllers/userController");
const {
  authenticateToken,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

// Protect routes
router.get("/", authenticateToken, authorizeAdmin, getAllUsersController);
router.get("/:id", authenticateToken, getUserByIdController);
router.patch(
  "/:id",
  authenticateToken,
  authorizeAdmin,
  updateUserByIdByAdminController
);
router.delete(
  "/:id",
  authenticateToken,
  authorizeAdmin,
  deleteUserByIdController
);
router.patch("/:id/profile", authenticateToken, updateUserByIdBySelfController);
router.patch('/:id/change-password', authenticateToken, changePasswordController);


module.exports = router;
