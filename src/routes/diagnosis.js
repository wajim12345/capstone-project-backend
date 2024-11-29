const express = require("express");
const router = express.Router();
const {
  createDiagnosisController,
  getDiagnosisByClientIdController,
  updateDiagnosisByIdController,
  deleteDiagnosisByIdController,
  getAllDiagnosisController,
  getDiagnosisByIdController,
} = require("../controllers/diagnosisController");
const {
  authenticateToken,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

// Route to create a new diagnosis
router.post("/", authenticateToken, authorizeAdmin, createDiagnosisController);

// Route to get all diagnoses
router.get("/", authenticateToken, authorizeAdmin, getAllDiagnosisController);

// Route to get diagnosis by clientId
router.get(
  "/clients/:clientId",
  authenticateToken,
  getDiagnosisByClientIdController
);

router.get("/:diagnosisId", authenticateToken, getDiagnosisByIdController);

// Route to update a diagnosis by diagnosisId
router.put(
  "/:diagnosisId",
  authenticateToken,
  authorizeAdmin,
  updateDiagnosisByIdController
);

// Route to delete a diagnosis by diagnosisId
router.delete(
  "/:diagnosisId",
  authenticateToken,
  authorizeAdmin,
  deleteDiagnosisByIdController
);

module.exports = router;
