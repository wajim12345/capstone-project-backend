const {
  createDiagnosis,
  getAllDiagnosis,
  getDiagnosisByClientId,
  updateDiagnosisById,
  deleteDiagnosisById,
  getDiagnosisById,
} = require("../models/diagnosisModel");
const { getTeamMembersByClientId } = require("../models/teamMemberModel");

// Controller to create a new diagnosis
const createDiagnosisController = (req, res) => {
  const { diagnosis, aType, clientId } = req.body;
  createDiagnosis(diagnosis, aType, clientId, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error creating diagnosis", error: err });
    }
    res.status(201).json({
      message: "Diagnosis created successfully",
      diagnosis: result,
    });
  });
};

// Controller to get diagnosis by clientId
const getDiagnosisByClientIdController = async (req, res) => {
  const { clientId } = req.params;
  const loggedInUserId = req.user.id;
  const isAdmin = req.user.isAdmin;

  if (!clientId) {
    return res.status(400).json({ message: "Client ID is required" });
  }

  try {
    const diagnosis = await new Promise((resolve, reject) => {
      getDiagnosisByClientId(clientId, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    if (!diagnosis || diagnosis.length === 0) {
      return res
        .status(404)
        .json({ message: "No diagnosis found for the client" });
    }

    // If the user is an admin, allow access to all diagnosis records
    if (isAdmin) {
      return res.status(200).json(diagnosis);
    }

    // If the user is an agent, check if they are assigned to the client
    const teamMembers = await getTeamMembersByClientId(clientId);
    const isAssigned = teamMembers.some(
      (member) => String(member.userId) === String(loggedInUserId)
    );

    if (!isAssigned) {
      return res
        .status(403)
        .json({ message: "You are not authorized to view this diagnosis." });
    }

    return res.status(200).json(diagnosis);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error fetching diagnosis", error: err });
  }
};

// Controller to update a diagnosis by ID
const updateDiagnosisByIdController = (req, res) => {
  const { diagnosisId } = req.params;
  const diagnosisData = req.body;

  if (!diagnosisId || !diagnosisData) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  updateDiagnosisById(diagnosisId, diagnosisData, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error updating diagnosis", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Diagnosis not found" });
    }
    res.status(200).json({ message: "Diagnosis updated successfully" });
  });
};

// Controller to delete a diagnosis by ID
const deleteDiagnosisByIdController = (req, res) => {
  const { diagnosisId } = req.params;

  if (!diagnosisId) {
    return res.status(400).json({ message: "Diagnosis ID is required" });
  }

  deleteDiagnosisById(diagnosisId, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error deleting diagnosis", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Diagnosis not found" });
    }
    res.status(200).json({ message: "Diagnosis deleted successfully" });
  });
};

// Controller to get all diagnoses
const getAllDiagnosisController = (req, res) => {
  getAllDiagnosis((err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error fetching diagnoses", error: err });
    }
    res.status(200).json(results);
  });
};

// Controller to get diagnosis by diagnosisId
const getDiagnosisByIdController = async (req, res) => {
  const { diagnosisId } = req.params;
  const loggedInUserId = req.user.id;
  const isAdmin = req.user.isAdmin;

  if (!diagnosisId) {
    return res.status(400).json({ message: "Diagnosis ID is required" });
  }

  try {
    const diagnosis = await new Promise((resolve, reject) => {
      getDiagnosisById(diagnosisId, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    if (!diagnosis) {
      return res.status(404).json({ message: "Diagnosis not found" });
    }

    // If the user is an admin, allow access to the diagnosis
    if (isAdmin) {
      return res.status(200).json(diagnosis);
    }

    // If the user is not an admin, verify if they are assigned to the client
    const { clientId } = diagnosis;

    const teamMembers = await getTeamMembersByClientId(clientId);
    const isAssigned = teamMembers.some(
      (member) => String(member.userId) === String(loggedInUserId)
    );

    if (!isAssigned) {
      return res
        .status(403)
        .json({ message: "You are not authorized to view this diagnosis." });
    }

    return res.status(200).json(diagnosis);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error fetching diagnosis", error: err });
  }
};

// Export the controller functions
module.exports = {
  createDiagnosisController,
  getDiagnosisByClientIdController,
  updateDiagnosisByIdController,
  deleteDiagnosisByIdController,
  getAllDiagnosisController,
  getDiagnosisByIdController,
};
