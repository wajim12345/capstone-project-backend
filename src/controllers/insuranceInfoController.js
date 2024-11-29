const {
  createInsuranceInfo,
  getAllInsuranceInfo,
  getInsuranceInfoByClientId,
  updateInsuranceInfoById,
  deleteInsuranceInfoById,
  getInsuranceInfoById,
} = require("../models/insuranceInfoModel");
const { isUserTeamMemberForSameClient } = require("../models/teamMemberModel");

// Controller to create a new insurance info
const createInsuranceInfoController = (req, res) => {
  const {
    clientId,
    insuranceProvider,
    primaryPlanName,
    certificateId,
    coverateDetail,
    startDate,
    endDate,
  } = req.body;

  if (
    !clientId ||
    !insuranceProvider ||
    !primaryPlanName ||
    !certificateId ||
    !startDate ||
    !endDate
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const insuranceData = {
    clientId,
    insuranceProvider,
    primaryPlanName,
    certificateId,
    coverateDetail,
    startDate,
    endDate,
  };

  createInsuranceInfo(insuranceData, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error creating insurance info", error: err });
    }
    res.status(201).json({
      message: "Insurance info created successfully",
      insuranceInfo: result,
    });
  });
};

// Controller to get insurance info by clientId
const getInsuranceInfoByClientIdController = async (req, res) => {
  const { clientId } = req.params;
  const loggedInUserId = req.user.id;
  const isAdmin = req.user.isAdmin;

  if (!clientId) {
    return res.status(400).json({ message: "Client ID is required" });
  }

  try {
    // If the user is not an admin, check if they are a team member of the client
    if (!isAdmin) {
      const isTeamMember = await isUserTeamMemberForSameClient(
        loggedInUserId,
        clientId
      );
      if (!isTeamMember) {
        return res.status(403).json({
          message:
            "Access denied. You are not authorized to view this client's insurance information.",
        });
      }
    }

    // Fetch insurance information for the client if authorized
    getInsuranceInfoByClientId(clientId, (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error fetching insurance info", error: err });
      }
      if (!results || results.length === 0) {
        return res
          .status(404)
          .json({ message: "No insurance info found for the client" });
      }
      res.status(200).json(results);
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Controller to update insurance info by ID
const updateInsuranceInfoByIdController = async (req, res) => {
  const { insuranceInfoId } = req.params;
  const insuranceData = req.body;

  if (!insuranceInfoId || !insuranceData) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const result = await updateInsuranceInfoById(
      insuranceInfoId,
      insuranceData
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Insurance info not found" });
    }
    res.status(200).json({ message: "Insurance info updated successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating insurance info", error: err });
  }
};

// Controller to delete insurance info by ID
const deleteInsuranceInfoByIdController = (req, res) => {
  const { insuranceInfoId } = req.params;

  if (!insuranceInfoId) {
    return res.status(400).json({ message: "Insurance Info ID is required" });
  }

  deleteInsuranceInfoById(insuranceInfoId, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error deleting insurance info", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Insurance info not found" });
    }
    res.status(200).json({ message: "Insurance info deleted successfully" });
  });
};

// Controller to get all insurance info
const getAllInsuranceInfoController = (req, res) => {
  getAllInsuranceInfo((err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error fetching insurance info", error: err });
    }
    res.status(200).json(results);
  });
};

// Controller to get insurance info by insuranceInfoId
const getInsuranceInfoByIdController = (req, res) => {
  const { insuranceInfoId } = req.params;

  if (!insuranceInfoId) {
    return res.status(400).json({ message: "Insurance Info ID is required" });
  }

  getInsuranceInfoById(insuranceInfoId, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error fetching insurance info", error: err });
    }
    if (!result) {
      return res.status(404).json({ message: "Insurance info not found" });
    }
    res.status(200).json(result);
  });
};

module.exports = {
  createInsuranceInfoController,
  getInsuranceInfoByClientIdController,
  updateInsuranceInfoByIdController,
  deleteInsuranceInfoByIdController,
  getAllInsuranceInfoController,
  getInsuranceInfoByIdController,
};
