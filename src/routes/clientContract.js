const express = require("express");
const router = express.Router();
const {
  createClientContractController,
  getAllClientContractsController,
  getClientContractByIdController,
  updateClientContractByIdController,
  deleteClientContractByIdController,
  getClientContractsByClientIdController,
} = require("../controllers/clientContractController");
const {
  authenticateToken,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

// Create a new client contract
router.post(
  "/",
  authenticateToken,
  authorizeAdmin,
  createClientContractController
);

// Get all client contracts
router.get(
  "/",
  authenticateToken,
  authorizeAdmin,
  getAllClientContractsController
);

// Get a client contract by ID
router.get(
  "/:contractId",
  authenticateToken,
  getClientContractByIdController
);

// Update a client contract by ID
router.put(
  "/:contractId",
  authenticateToken,
  authorizeAdmin,
  updateClientContractByIdController
);

// Delete a client contract by ID
router.delete(
  "/:contractId",
  authenticateToken,
  authorizeAdmin,
  deleteClientContractByIdController
);

// Get client contracts by clientId
router.get(
  "/client/:clientId",
  authenticateToken,
  getClientContractsByClientIdController
);

module.exports = router;
