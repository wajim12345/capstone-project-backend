const { getOutsideProviderById } = require("../models/outsideProviderModel");
const {
  assignTeamMember,
  getTeamMembersByClientId,
  getClientsForTeamMember,
  unassignTeamMember,
  updateTeamMemberDates,
  checkTeamMemberByClient,
} = require("../models/teamMemberModel");
const { getUserById } = require("../models/userModel");

// Controller to assign a team member (user or outside provider) to a client
const assignTeamMemberController = async (req, res) => {
  const {
    clientId,
    userId,
    outsideProviderId,
    startServiceDate,
    endServiceDate,
  } = req.body;

  // Validate required fields
  if (!clientId || (!userId && !outsideProviderId)) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  if (userId && outsideProviderId) {
    return res.status(400).json({
      message: "Specify either userId or outsideProviderId, not both",
    });
  }

  try {
    if (userId) {
      const userExists = await getUserById(userId);
      if (!userExists) {
        return res.status(404).json({ message: "User not found" });
      }
    } else if (outsideProviderId) {
      const providerExists = await getOutsideProviderById(outsideProviderId);
      if (!providerExists) {
        return res.status(404).json({ message: "Outside provider not found" });
      }
    }

    // Check if the team member is already assigned to the client
    const existingAssignment = await checkTeamMemberByClient(
      clientId,
      userId,
      outsideProviderId
    );

    if (existingAssignment.length > 0) {
      return res
        .status(400)
        .json({ message: "Team member is already assigned to this client." });
    }

    // If no existing assignment, proceed with the assignment
    const result = await assignTeamMember(
      clientId,
      userId,
      outsideProviderId,
      startServiceDate,
      endServiceDate
    );

    res.status(201).json({
      message: "Team member assigned successfully",
      teamMemberId: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ message: "Error processing request", error: err });
  }
};

// Controller to get all team members for a specific client
const getTeamMembersByClientIdController = async (req, res) => {
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
          message: "You are not authorized to view team members for this client.",
        });
      }

      // Return only the team member details if the user is a team member
      return res.status(200).json(teamMembers);
    }

    // If the user is an admin, fetch and return all team members for the client
    const results = await getTeamMembersByClientId(clientId);
    return res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching team members:", err);
    return res
      .status(500)
      .json({ message: "Error fetching team members", error: err });
  }
};


// Controller to get all clients for a specific team member (user or outside provider)
// const getClientsForTeamMemberController = async (req, res) => {
//   const { teamMemberId } = req.params;

//   try {
//     const clients = await getClientsForTeamMember(teamMemberId);
//     return res.status(200).json({ data: clients });
//   } catch (err) {
//     console.error("Error fetching clients for team member:", err);
//     return res
//       .status(500)
//       .json({ message: "Error fetching clients", error: err });
//   }
// };

const getClientsForTeamMemberController = async (req, res) => {
  const { userId } = req.params;

  try {
    const clients = await getClientsForTeamMember(userId);
    return res.status(200).json({ data: clients });
  } catch (err) {
    console.error("Error fetching clients for team member:", err);
    return res
      .status(500)
      .json({ message: "Error fetching clients", error: err });
  }
};

// Controller to unassign a team member (user or outside provider) from a client
const unassignTeamMemberController = async (req, res) => {
  const { clientId, teamMemberId } = req.params;
  const isOutsideProvider = req.query.type === "provider";

  if (!clientId || !teamMemberId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Call unassignTeamMember with the correct provider flag
    const results = await unassignTeamMember(clientId, teamMemberId, isOutsideProvider);
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Team member assignment not found" });
    }

    return res.status(200).json({ message: "Team member unassigned successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Error unassigning team member", error: err });
  }
};


// Controller to update team member dates
const updateTeamMemberController = async (req, res) => {
  const teamMemberId = req.params.teamMemberId;
  const { startServiceDate, endServiceDate } = req.body;

  try {
    const results = await updateTeamMemberDates(teamMemberId, startServiceDate, endServiceDate);
    
    // Check if any rows were affected, meaning the update was successful
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Team member not found" });
    }

    res.status(200).json({ message: "Team member dates updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update team member dates", details: err });
  }
};


// Export the controller functions
module.exports = {
  assignTeamMemberController,
  getTeamMembersByClientIdController,
  getClientsForTeamMemberController,
  unassignTeamMemberController,
  updateTeamMemberController,
};
