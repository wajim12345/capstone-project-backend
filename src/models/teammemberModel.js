const connection = require("../configs/db");

// Function to assign a team member (user or outside provider) to a client
const assignTeamMember = (clientId, userId, outsideProviderId, startServiceDate, endServiceDate) => {
  return new Promise((resolve, reject) => {
    // Set up the query and parameters based on whether userId or outsideProviderId is provided
    const query = `
      INSERT INTO TeamMember (clientId, userId, outsideProviderId, startServiceDate, endServiceDate)
      VALUES (?, ?, ?, ?, ?)
    `;
    const params = [
      clientId,
      userId || null,
      outsideProviderId || null,
      startServiceDate,
      endServiceDate || null,
    ];

    connection.query(query, params, (err, results) => {
      if (err) {
        console.error("Error assigning team member:", err);
        return reject(err);
      }
      resolve(results);
    });
  });
};


// Function to get all team members (users and outside providers) for a specific client
const getTeamMembersByClientId = (clientId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        tm.teamMemberId,
        ec.clientId, ec.psNote, ec.firstName, ec.lastName, ec.gender, ec.birthDate, ec.address, ec.city, ec.postalCode, 
        ec.phoneNumber, ec.email, ec.school, ec.age, ec.currentStatus, ec.fscdIdNum, tm.startServiceDate, tm.endServiceDate, 
        u.userId, u.firstName AS userFirstName, u.lastName AS userLastName, u.role, u.rate,
        op.outsideProviderId, op.firstName AS outsideProviderFirstName, op.lastName AS outsideProviderLastName, 
        op.phoneNumber AS outsideProviderPhone, op.email AS outsideProviderEmail, op.agency AS outsideProviderAgency
      FROM ExistingClient ec
      JOIN TeamMember tm ON ec.clientId = tm.clientId
      LEFT JOIN users u ON tm.userId = u.userId
      LEFT JOIN OutsideProvider op ON tm.outsideProviderId = op.outsideProviderId
      WHERE ec.clientId = ?
    `;

    connection.query(query, [clientId], (err, results) => {
      if (err) {
        console.error("Error fetching team members for client:", err);
        return reject(err);
      }
      resolve(results);
    });
  });
};

// Function to update team member dates
const updateTeamMemberDates = (teamMemberId, startServiceDate, endServiceDate) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE TeamMember SET startServiceDate = ?, endServiceDate = ?
      WHERE teamMemberId = ?
    `;
    connection.query(query, [startServiceDate, endServiceDate, teamMemberId], (err, results) => {
      if (err) {
        console.error("Error updating team member dates:", err);
        return reject(err);
      }
      resolve(results);
    });
  });
};


// Function to get all clients for a team member
// const getClientsForTeamMember = (teamMemberId) => {
//   return new Promise((resolve, reject) => {
//     const query = `
//       SELECT ec.*
//       FROM ExistingClient ec
//       JOIN TeamMember tm ON ec.clientId = tm.clientId
//       WHERE tm.userId = ? OR tm.outsideProviderId = ?
//     `;
//     connection.query(query, [teamMemberId, teamMemberId], (err, results) => {
//       if (err) {
//         return reject(err);
//       }
//       resolve(results);
//     });
//   });
// };

const getClientsForTeamMember = (teamMemberId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT ec.*
      FROM ExistingClient ec
      JOIN TeamMember tm ON ec.clientId = tm.clientId
      WHERE tm.userId = ?
    `;
    connection.query(query, [teamMemberId], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};

// Function to unassign a team member
const unassignTeamMember = (clientId, teamMemberId, isOutsideProvider = false) => {
  return new Promise((resolve, reject) => {
    const query = `
      DELETE FROM TeamMember WHERE clientId = ? AND teamMemberId = ?
    `;
    connection.query(query, [clientId, teamMemberId], (err, results) => {
      if (err) {
        console.error("Database error while unassigning team member:", err);
        return reject(err);
      }
      resolve(results);
    });
  });
};


const checkTeamMemberByClient = (clientId, userId, outsideProviderId) => {
  return new Promise((resolve, reject) => {
    let query;
    let params = [clientId];

    if (userId) {
      query = `SELECT * FROM TeamMember WHERE clientId = ? AND userId = ?`;
      params.push(userId);
    } else if (outsideProviderId) {
      query = `SELECT * FROM TeamMember WHERE clientId = ? AND outsideProviderId = ?`;
      params.push(outsideProviderId);
    } else {
      return reject(
        new Error("Either userId or outsideProviderId must be provided")
      );
    }

    connection.query(query, params, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};

const isUserTeamMemberForSameClient = (userId, outsideProviderId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 1
      FROM TeamMember tm1
      JOIN TeamMember tm2 ON tm1.clientId = tm2.clientId
      WHERE tm1.userId = ? AND tm2.outsideProviderId = ?
    `;
    connection.query(query, [userId, outsideProviderId], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results.length > 0);
    });
  });
};

module.exports = {
  assignTeamMember,
  getTeamMembersByClientId,
  getClientsForTeamMember,
  unassignTeamMember,
  updateTeamMemberDates,
  checkTeamMemberByClient,
  isUserTeamMemberForSameClient
};
