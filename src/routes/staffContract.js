const express = require("express");
const router = express.Router();
const {
  createStaffContractController,
  getAllStaffContractsController,
  getStaffContractByIdController,
  updateStaffContractByIdController,
  deleteStaffContractByIdController,
  getStaffContractsByUserIdController,
} = require("../controllers/staffContractController");
const {
  authenticateToken,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

// Create a new staff contract
router.post(
  "/",
  authenticateToken,
  authorizeAdmin,
  createStaffContractController
);

// Get all staff contracts
router.get(
  "/",
  authenticateToken,
  authorizeAdmin,
  getAllStaffContractsController
);

// Get a staff contract by ID
router.get(
  "/:contractId",
  authenticateToken,
  getStaffContractByIdController
);

// Update a staff contract by ID
router.put(
  "/:contractId",
  authenticateToken,
  authorizeAdmin,
  updateStaffContractByIdController
);

// Delete a staff contract by ID
router.delete(
  "/:contractId",
  authenticateToken,
  authorizeAdmin,
  deleteStaffContractByIdController
);

// Get staff contracts by userId
router.get(
  "/user/:userId",
  authenticateToken,
  getStaffContractsByUserIdController
);

module.exports = router;
