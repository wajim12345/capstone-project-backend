const connection = require("../configs/db");

// Function to create a new staff contract
const createStaffContract = (contract, callback) => {
  const query = `
    INSERT INTO staffContract (userId, fileId, startDate, endDate)
    VALUES (?, ?, ?, ?)
  `;

  const values = [
    contract.userId,
    contract.fileId,
    contract.startDate,
    contract.endDate,
  ];

  connection.query(query, values, callback);
};

// Function to get all staff contracts
const getAllStaffContracts = (callback) => {
  const query = "SELECT * FROM staffContract";
  connection.query(query, callback);
};

// Function to get a staff contract by contractId
const getStaffContractById = (contractId) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM staffContract WHERE contractId = ?";
    connection.query(query, [contractId], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results[0]);
    });
  });
};

// Function to update a staff contract by contractId
const updateStaffContractById = (contractId, contractData) => {
  return new Promise((resolve, reject) => {
    const fields = [];
    const values = [];

    Object.keys(contractData).forEach((key) => {
      if (contractData[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(contractData[key]);
      }
    });

    const query = `UPDATE staffContract SET ${fields.join(
      ", "
    )} WHERE contractId = ?`;
    values.push(contractId);

    // Execute the query
    connection.query(query, values, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

// Function to delete a staff contract by contractId
const deleteStaffContractById = (contractId, callback) => {
  const query = "DELETE FROM staffContract WHERE contractId = ?";
  connection.query(query, [contractId], callback);
};

// Function to get contracts by userId
const getStaffContractsByUserId = (userId) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM staffContract WHERE userId = ?";
    connection.query(query, [userId], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};

module.exports = {
  createStaffContract,
  getAllStaffContracts,
  getStaffContractById,
  updateStaffContractById,
  deleteStaffContractById,
  getStaffContractsByUserId,
};
