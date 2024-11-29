const express = require("express");
const {
  assignTeamMemberController,
  getTeamMembersByClientIdController,
  getClientsForTeamMemberController,
  unassignTeamMemberController,
  updateTeamMemberController,
} = require("../controllers/teamMemberController");
const {
  authenticateToken,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Route to assign a team member to a client
router.post(
  "/assign",
  authenticateToken,
  authorizeAdmin,
  assignTeamMemberController
);

// Route to get all team members assigned to a client
router.get(
  "/client/:clientId",
  authenticateToken,
  getTeamMembersByClientIdController
);

router.put(
  '/:teamMemberId',
  authenticateToken,
  authorizeAdmin,
  updateTeamMemberController
);

// Route to get the assigned clients of the team member
router.get(
  "/user/:userId",
  authenticateToken,
  getClientsForTeamMemberController
);

router.delete(
  "/client/:clientId/team-member/:teamMemberId",
  authenticateToken,
  authorizeAdmin,
  unassignTeamMemberController
);

module.exports = router;
