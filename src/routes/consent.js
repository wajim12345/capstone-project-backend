const express = require("express");
const router = express.Router();
const {
  createConsentController,
  getConsentByIdController,
  updateConsentByIdController,
  deleteConsentByIdController,
  getAllConsentController,
  getConsentByClientIdController,
} = require("../controllers/consentController");
const {
  authenticateToken,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

// Create a new consent
router.post("/", authenticateToken, authorizeAdmin, createConsentController);

// Get consent by ID
router.get("/:consentId", authenticateToken, getConsentByIdController);

// Update consent by ID
router.put(
  "/:consentId",
  authenticateToken,
  authorizeAdmin,
  updateConsentByIdController
);

router.get(
  "/client/:clientId",
  authenticateToken,
  getConsentByClientIdController
);

// Delete consent by ID
router.delete(
  "/:consentId",
  authenticateToken,
  authorizeAdmin,
  deleteConsentByIdController
);

// Get all consents
router.get("/", authenticateToken, authorizeAdmin, getAllConsentController);

module.exports = router;
