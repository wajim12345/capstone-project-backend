const {
  createConsent,
  getAllConsent,
  getConsentById,
  updateByConsentId,
  deleteConsentById,
  getConsentByClientId,
} = require("../models/consentModel");
const { getTeamMembersByClientId } = require("../models/teamMemberModel");

// Controller to create a new consent record
const createConsentController = (req, res) => {
  const { clientId, permissionNote, receivedDate, withdrawDate } = req.body;

  // Validate required fields
  if (!clientId || !permissionNote || !receivedDate) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Simply pass the entire consent data, including withdrawDate (if present or null)
  createConsent(
    { clientId, permissionNote, receivedDate, withdrawDate },
    (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error creating consent", error: err });
      }
      res.status(201).json({
        message: "Consent created successfully",
        consentId: result.insertId,
      });
    }
  );
};

// Controller to get a consent by ID
const getConsentByIdController = async (req, res) => {
  const { consentId } = req.params;
  const loggedInUserId = req.user.id;
  const isAdmin = req.user.isAdmin;

  if (!consentId) {
    return res.status(400).json({ message: "Consent ID is required" });
  }

  try {
    // Fetch the consent by ID
    const consent = await getConsentById(consentId);

    if (!consent) {
      return res.status(404).json({ message: "Consent not found" });
    }

    // If the user is an admin, allow access to any consent
    if (isAdmin) {
      return res.status(200).json(consent);
    }

    // If the user is an agent, check if they are assigned to the client
    const { clientId } = consent;

    // Check if the agent is assigned to this client
    const teamMembers = await getTeamMembersByClientId(clientId);

    // Check if the logged-in agent is assigned to the client
    const isAssigned = teamMembers.some(
      (member) => String(member.userId) === String(loggedInUserId)
    );

    if (!isAssigned) {
      return res
        .status(403)
        .json({ message: "You are not authorized to view this consent." });
    }

    // If the agent is assigned to the client, allow access
    return res.status(200).json(consent);
  } catch (err) {
    console.error("Error fetching consent:", err);
    return res
      .status(500)
      .json({ message: "Error fetching consent", error: err });
  }
};

// Controller to update a consent by ID
const updateConsentByIdController = (req, res) => {
  const { consentId } = req.params;
  const consentData = req.body;

  if (!consentId || !consentData) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  updateByConsentId(consentId, consentData, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error updating consent", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Consent not found" });
    }
    res.status(200).json({ message: "Consent updated successfully" });
  });
};

// Controller to delete a consent by ID
const deleteConsentByIdController = (req, res) => {
  const { consentId } = req.params;

  if (!consentId) {
    return res.status(400).json({ message: "Consent ID is required" });
  }

  deleteConsentById(consentId, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error deleting consent", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Consent not found" });
    }
    res.status(200).json({ message: "Consent deleted successfully" });
  });
};

// Controller to get all consents
const getAllConsentController = (req, res) => {
  getAllConsent((err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error fetching consents", error: err });
    }
    res.status(200).json(results);
  });
};

// Controller to get consents by clientId
const getConsentByClientIdController = async (req, res) => {
  const { clientId } = req.params;
  const loggedInUserId = req.user.id;
  const isAdmin = req.user.isAdmin;

  if (!clientId) {
    return res.status(400).json({ message: "Client ID is required" });
  }

  try {
    // Check if the user is an admin
    if (!isAdmin) {
      // If not an admin, check if the user is part of the team for this client
      const teamMembers = await getTeamMembersByClientId(clientId);

      const isTeamMember = teamMembers.some(
        (member) => String(member.userId) === String(loggedInUserId)
      );

      if (!isTeamMember) {
        return res.status(403).json({
          message: "You are not authorized to view consents for this client.",
        });
      }
    }

    // Fetch consents by clientId
    const consents = await getConsentByClientId(clientId);

    if (!consents || consents.length === 0) {
      return res
        .status(404)
        .json({ message: "No consents found for this client" });
    }

    return res.status(200).json(consents);
  } catch (err) {
    console.error("Error fetching consents by clientId:", err);
    return res
      .status(500)
      .json({ message: "Error fetching consents", error: err });
  }
};

// Export the controller functions
module.exports = {
  createConsentController,
  getConsentByIdController,
  updateConsentByIdController,
  deleteConsentByIdController,
  getAllConsentController,
  getConsentByClientIdController,
};
