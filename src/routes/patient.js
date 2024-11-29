const express = require("express");
const {
  getAllPatientsController,
  createPatientController,
  getPatientController,
  updatePatientController,
  deletePatientController,
} = require("../controllers/patientController");
const {
  authenticateToken,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Only admins can view all patients
router.get("/", authenticateToken, authorizeAdmin, getAllPatientsController);

// Only admins can create patients
router.post("/", authenticateToken, authorizeAdmin, createPatientController);

// Users that are team member can view a patient by id
router.get("/:clientId", authenticateToken, getPatientController);

// Only admins can update patients
router.put(
  "/:clientId",
  authenticateToken,
  authorizeAdmin,
  updatePatientController
);

// Only admins can delete patients
router.delete(
  "/:clientId",
  authenticateToken,
  authorizeAdmin,
  deletePatientController
);

module.exports = router;
