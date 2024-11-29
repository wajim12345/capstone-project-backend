const express = require("express");
const router = express.Router();
const {
  createPrimaryGuardianController,
  getPrimaryGuardianController,
  updatePrimaryGuardianController,
  deletePrimaryGuardianController,
} = require("../controllers/guardianController");
const {
  authenticateToken,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

// Primary Guardian Routes
router.post("/primary", authenticateToken, authorizeAdmin, createPrimaryGuardianController);
router.get("/primary/:clientId", authenticateToken, getPrimaryGuardianController);
router.put("/primary/:guardianId", authenticateToken, authorizeAdmin, updatePrimaryGuardianController);
router.delete("/primary/:guardianId", authenticateToken, authorizeAdmin, deletePrimaryGuardianController);

module.exports = router;
