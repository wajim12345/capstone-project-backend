const {
  createStaffContract,
  getAllStaffContracts,
  getStaffContractById,
  updateStaffContractById,
  deleteStaffContractById,
  getStaffContractsByUserId,
} = require("../models/staffContractModel");
const { getTeamMembersByUserId } = require("../models/teamMemberModel");

// Controller to create a new staff contract
const createStaffContractController = (req, res) => {
  const contract = req.body;

  // Validate required fields
  if (
    !contract.userId ||
    !contract.fileId ||
    !contract.startDate ||
    !contract.endDate
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  createStaffContract(contract, (err, result) => {
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

// Controller to get all staff contracts
const getAllStaffContractsController = (req, res) => {
  getAllStaffContracts((err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error fetching contracts", error: err });
    }
    res.status(200).json(results);
  });
};

// Controller to get a staff contract by contractId
const getStaffContractByIdController = async (req, res) => {
  const { contractId } = req.params;
  const loggedInUserId = req.user.id;
  const isAdmin = req.user.isAdmin;

  if (!contractId) {
    return res.status(400).json({ message: "Contract ID is required" });
  }

  try {
    // Fetch the contract details
    const contract = await getStaffContractById(contractId);

    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    // If not admin, check if the contract belongs to the logged-in user
    if (!isAdmin && contract.userId !== loggedInUserId) {
      return res.status(403).json({
        message: "Access denied. You can only view your own contract.",
      });
    }

    // If authorized, return the contract details
    res.status(200).json(contract);
  } catch (err) {
    console.error("Error fetching contract:", err);
    return res
      .status(500)
      .json({ message: "Error fetching contract", error: err });
  }
};

// Controller to update a staff contract by contractId
// const updateStaffContractByIdController = async (req, res) => {
//   const { contractId } = req.params;
//   const contractData = req.body;
//   const loggedInUserId = req.user.id;
//   const isAdmin = req.user.isAdmin;

//   if (!contractId) {
//     return res.status(400).json({ message: "Contract ID is required" });
//   }

//   try {
//     // If not an admin, verify that the contract belongs to the logged-in user
//     if (!isAdmin) {
//       const contract = await getStaffContractById(contractId);

//       if (!contract) {
//         return res.status(404).json({ message: "Contract not found" });
//       }

//       if (contract.userId !== loggedInUserId) {
//         return res.status(403).json({
//           message: "Access denied. You can only update your own contract.",
//         });
//       }
//     }

//     // Update the contract
//     const result = await updateStaffContractById(contractId, contractData);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: "Contract not found" });
//     }

//     res.status(200).json({ message: "Contract updated successfully" });
//   } catch (err) {
//     console.error("Error updating contract:", err);
//     return res
//       .status(500)
//       .json({ message: "Error updating contract", error: err });
//   }
// };

const updateStaffContractByIdController = async (req, res) => {
  const { contractId } = req.params;
  const contractData = req.body;

  if (!contractId) {
    return res.status(400).json({ message: "Contract ID is required" });
  }

  try {
    // Update the contract
    const result = await updateStaffContractById(contractId, contractData);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Contract not found" });
    }

    res.status(200).json({ message: "Contract updated successfully" });
  } catch (err) {
    console.error("Error updating contract:", err);
    return res
      .status(500)
      .json({ message: "Error updating contract", error: err });
  }
};

// Controller to delete a staff contract by contractId
const deleteStaffContractByIdController = (req, res) => {
  const { contractId } = req.params;

  deleteStaffContractById(contractId, (err, result) => {
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

// Controller to get contracts by userId
const getStaffContractsByUserIdController = async (req, res) => {
  const { userId } = req.params;
  const loggedInUserId = req.user.id;
  const isAdmin = req.user.isAdmin;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    // Check if the user is an admin or the logged-in user is viewing their own contracts
    if (!isAdmin && String(userId) !== String(loggedInUserId)) {
      // If not an admin and not the logged-in user's own data, check team membership
      const teamMembers = await getTeamMembersByUserId(userId);
      const isTeamMember = teamMembers.some(
        (member) => String(member.userId) === String(loggedInUserId)
      );

      if (!isTeamMember) {
        return res.status(403).json({
          message: "You are not authorized to view contracts for this user.",
        });
      }
    }

    // Fetch contracts by userId
    const contracts = await getStaffContractsByUserId(userId);

    if (!contracts || contracts.length === 0) {
      return res
        .status(404)
        .json({ message: "No contracts found for this user" });
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
  createStaffContractController,
  getAllStaffContractsController,
  getStaffContractByIdController,
  updateStaffContractByIdController,
  deleteStaffContractByIdController,
  getStaffContractsByUserIdController,
};
