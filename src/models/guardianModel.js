const connection = require("../configs/db");

// Create a new primary guardian
const createPrimaryGuardian = (guardian) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO PrimaryGuardian (clientId, custody, firstName, lastName, relationship, phoneNumber, email, address, city, province, postalCode)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      guardian.clientId,
      guardian.custody,
      guardian.firstName,
      guardian.lastName,
      guardian.relationship,
      guardian.phoneNumber,
      guardian.email,
      guardian.address,
      guardian.city,
      guardian.province,
      guardian.postalCode,
    ];

    connection.query(query, values, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};

// Get primary guardian by client ID
const getPrimaryGuardianByClientId = (clientId) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM PrimaryGuardian WHERE clientId = ?";
    connection.query(query, [clientId], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};

// Update primary guardian
const updatePrimaryGuardian = (guardianId, guardian, callback) => {
  const fields = [];
  const values = [];

  Object.keys(guardian).forEach((key) => {
    if (guardian[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(guardian[key]);
    }
  });

  const query = `UPDATE PrimaryGuardian SET ${fields.join(", ")} WHERE guardianId = ?`;
  values.push(guardianId);

  connection.query(query, values, callback);
};

// Delete primary guardian
const deletePrimaryGuardian = (guardianId, callback) => {
  const query = "DELETE FROM PrimaryGuardian WHERE guardianId = ?";
  connection.query(query, [guardianId], callback);
};


module.exports = {
  createPrimaryGuardian,
  getPrimaryGuardianByClientId,
  updatePrimaryGuardian,
  deletePrimaryGuardian,
};
