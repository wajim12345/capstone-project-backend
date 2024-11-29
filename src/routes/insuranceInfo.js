const express = require("express");
const router = express.Router();
const {
  createInsuranceInfoController,
  getInsuranceInfoByClientIdController,
  updateInsuranceInfoByIdController,
  deleteInsuranceInfoByIdController,
  getAllInsuranceInfoController,
  getInsuranceInfoByIdController,
} = require("../controllers/insuranceInfoController");

const {
  authenticateToken,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

// Create new insurance info
router.post(
  "/",
  authenticateToken,
  authorizeAdmin,
  createInsuranceInfoController
);

// Get all insurance info
router.get(
  "/",
  authenticateToken,
  authorizeAdmin,
  getAllInsuranceInfoController
);

// Get insurance info by insuranceInfoId
router.get(
  "/:insuranceInfoId",
  authenticateToken,
  getInsuranceInfoByIdController
);

// Get insurance info by clientId
router.get(
  "/client/:clientId",
  authenticateToken,
  getInsuranceInfoByClientIdController
);

// Update insurance info by insuranceInfoId
router.put(
  "/:insuranceInfoId",
  authenticateToken,
  authorizeAdmin,
  updateInsuranceInfoByIdController
);

// Delete insurance info by insuranceInfoId
router.delete(
  "/:insuranceInfoId",
  authenticateToken,
  authorizeAdmin,
  deleteInsuranceInfoByIdController
);

module.exports = router;
