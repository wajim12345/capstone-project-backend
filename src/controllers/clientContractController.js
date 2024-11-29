const {
  createClientContract,
  getAllClientContracts,
  getClientContractById,
  updateClientContractById,
  deleteClientContractById,
  getClientContractsByClientId,
} = require("../models/clientContractModel");
const {
  getTeamMembersByClientId,
  isUserTeamMemberForSameClient,
} = require("../models/teamMemberModel");

// Controller to create a new client contract
const createClientContractController = (req, res) => {
  const contract = req.body;

  // Validate required fields
  if (
    !contract.clientId ||
    !contract.fileId ||
    !contract.startDate ||
    !contract.endDate
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  createClientContract(contract, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error creating contract", error: err });
    }
    res.status(201).json({
      message: "Contract created successfully",
      contractId: result.insertId,
    });
  });
};

// Controller to get all client contracts
const getAllClientContractsController = (req, res) => {
  getAllClientContracts((err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error fetching contracts", error: err });
    }
    res.status(200).json(results);
  });
};

// Controller to get a client contract by contractId
const getClientContractByIdController = async (req, res) => {
  const { contractId } = req.params;
  const loggedInUserId = req.user.id;
  const isAdmin = req.user.isAdmin;

  if (!contractId) {
    return res.status(400).json({ message: "Contract ID is required" });
  }

  try {
    // Fetch the contract details to get the associated clientId
    const contract = await getClientContractById(contractId);

    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    const clientId = contract.clientId;

    // Check if the user is an admin
    if (!isAdmin) {
      // If not an admin, check if the user is part of the team for this client
      const teamMembers = await getTeamMembersByClientId(clientId);

      const isTeamMember = teamMembers.some(
        (member) => String(member.userId) === String(loggedInUserId)
      );

      if (!isTeamMember) {
        return res.status(403).json({
          message: "Access denied. You are not authorized to view this contract.",
        });
      }
    }

    // If authorized, return the contract details
    res.status(200).json(contract);
  } catch (err) {
    console.error("Error fetching contract:", err);
    return res.status(500).json({ message: "Error fetching contract", error: err });
  }
};


// Controller to update a client contract by contractId
const updateClientContractByIdController = (req, res) => {
  const { contractId } = req.params;
  const contractData = req.body;

  updateClientContractById(contractId, contractData, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error updating contract", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Contract not found" });
    }
    res.status(200).json({ message: "Contract updated successfully" });
  });
};

// Controller to delete a client contract by contractId
const deleteClientContractByIdController = (req, res) => {
  const { contractId } = req.params;

  deleteClientContractById(contractId, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error deleting contract", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Contract not found" });
    }
    res.status(200).json({ message: "Contract deleted successfully" });
  });
};

// Controller to get contracts by clientId
const getClientContractsByClientIdController = async (req, res) => {
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
          message: "You are not authorized to view contracts for this client.",
        });
      }
    }

    // Fetch contracts by clientId using await
    const contracts = await getClientContractsByClientId(clientId);

    if (!contracts || contracts.length === 0) {
      return res
        .status(404)
        .json({ message: "No contracts found for this client" });
    }
    res.status(200).json(contracts);
  } catch (err) {
    console.error("Error fetching contracts:", err);
    return res
      .status(500)
      .json({ message: "Error fetching contracts", error: err });
  }
};

module.exports = {
  createClientContractController,
  getAllClientContractsController,
  getClientContractByIdController,
  updateClientContractByIdController,
  deleteClientContractByIdController,
  getClientContractsByClientIdController,
};
