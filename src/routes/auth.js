const express = require("express");
const router = express.Router();
const {
  registerUserController,
  loginUserController,
  requestPasswordReset,
  resetPassword,
} = require("../controllers/authController");

// Reset password
router.post("/reset/:resetToken", resetPassword);

// Request password reset
router.post("/forgot", requestPasswordReset);

// Registration endpoint
router.post("/register", registerUserController);

// Login endpoint
router.post("/login", loginUserController);

module.exports = router;
