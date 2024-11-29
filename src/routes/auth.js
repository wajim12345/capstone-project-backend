const express = require("express");
const router = express.Router();
const {
  registerUserController,
  loginUserController,
  requestPasswordReset,
  resetPassword,
} = require("../controllers/authController");
const { authenticateToken, authorizeAdmin } = require("../middleware/authMiddleware");

// Reset password
router.post("/reset", resetPassword);

// Request password reset
router.post("/forgot", requestPasswordReset);

// Registration endpoint
// router.post("/register", authenticateToken, authorizeAdmin, registerUserController);
router.post("/register", registerUserController);

// Login endpoint
router.post("/login", loginUserController);

module.exports = router;
