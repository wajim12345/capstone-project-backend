const {
  createPrimaryGuardian,
  getPrimaryGuardianByClientId,
  updatePrimaryGuardian,
  deletePrimaryGuardian,
} = require("../models/guardianModel");
const { isUserTeamMemberForSameClient } = require("../models/teamMemberModel");

// Create primary guardian
const createPrimaryGuardianController = async (req, res) => {
  const guardian = req.body;
  try {
    const results = await createPrimaryGuardian(guardian);
    res.status(201).send({ message: "Primary guardian created successfully" });
  } catch (err) {
    res.status(500).send(err);
  }
};

// Get primary guardian by client ID
const getPrimaryGuardianController = async (req, res) => {
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
            "Access denied. You are not authorized to view this client's primary guardian information.",
        });
      }
    }

    // Fetch primary guardian information if authorized
    const results = await getPrimaryGuardianByClientId(clientId);
    if (!results || results.length === 0) {
      return res
        .status(404)
        .json({ message: "No primary guardian found for the client" });
    }
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Update primary guardian
const updatePrimaryGuardianController = (req, res) => {
  const guardianId = req.params.guardianId;
  const guardian = req.body;
  updatePrimaryGuardian(guardianId, guardian, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send({ message: "Primary guardian updated successfully" });
  });
};

// Delete primary guardian
const deletePrimaryGuardianController = (req, res) => {
  const guardianId = req.params.guardianId;
  deletePrimaryGuardian(guardianId, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send({ message: "Primary guardian deleted successfully" });
  });
};

module.exports = {
  createPrimaryGuardianController,
  getPrimaryGuardianController,
  updatePrimaryGuardianController,
  deletePrimaryGuardianController,
};
