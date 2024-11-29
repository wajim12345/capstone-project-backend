const express = require("express");
const {
  authenticateToken,
  authorizeAdmin,
} = require("../middleware/authMiddleware");
const {
  getAllOutsideProvidersController,
  createOutsideProviderController,
  getOutsideProviderByIdController,
  updateOutsideProviderByIdController,
  deleteOutsideProviderController,
} = require("../controllers/outsideProviderController");

const router = express.Router();

// Only admins can view all OutsideProvider
router.get(
  "/",
  authenticateToken,
  authorizeAdmin,
  getAllOutsideProvidersController
);

// Only admins can create OutsideProvider
router.post(
  "/",
  authenticateToken,
  authorizeAdmin,
  createOutsideProviderController
);

// All users can view OutsideProvider
router.get("/:outsideProviderId", authenticateToken, getOutsideProviderByIdController);

// Only admins can update OutsideProvider
router.put(
  "/:outsideProviderId",
  authenticateToken,
  authorizeAdmin,
  updateOutsideProviderByIdController
);

// Only admins can delete OutsideProvider
router.delete(
  "/:outsideProviderId",
  authenticateToken,
  authorizeAdmin,
  deleteOutsideProviderController
);

module.exports = router;
