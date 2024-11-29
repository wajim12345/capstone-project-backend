const connection = require("../configs/db");

// Function to create a new client contract
const createClientContract = (contract, callback) => {
  const query = `
    INSERT INTO clientContract (clientId, fileId, startDate, endDate, COOhours, PBChours, SLPhours, OThours, PThours, AIDEhours, COUShours, CARhours)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    contract.clientId,
    contract.fileId,
    contract.startDate,
    contract.endDate,
    contract.COOhours,
    contract.PBChours,
    contract.SLPhours,
    contract.OThours,
    contract.PThours,
    contract.AIDEhours,
    contract.COUShours,
    contract.CARhours,
  ];

  connection.query(query, values, callback);
};

// Function to get all client contracts
const getAllClientContracts = (callback) => {
  const query = "SELECT * FROM clientContract";
  connection.query(query, callback);
};

// Function to get a client contract by contractId
const getClientContractById = (contractId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM ClientContract WHERE contractId = ?
    `;
    connection.query(query, [contractId], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results[0]);
    });
  });
};

// Function to update a client contract by contractId
const updateClientContractById = (contractId, contractData, callback) => {
  const fields = [];
  const values = [];

  Object.keys(contractData).forEach((key) => {
    if (contractData[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(contractData[key]);
    }
  });

  const query = `UPDATE clientContract SET ${fields.join(
    ", "
  )} WHERE contractId = ?`;
  values.push(contractId);

  connection.query(query, values, callback);
};

// Function to delete a client contract by contractId
const deleteClientContractById = (contractId, callback) => {
  const query = "DELETE FROM clientContract WHERE contractId = ?";
  connection.query(query, [contractId], callback);
};

// Function to get contracts by clientId
const getClientContractsByClientId = (clientId) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM clientContract WHERE clientId = ?";
    connection.query(query, [clientId], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};

module.exports = {
  createClientContract,
  getAllClientContracts,
  getClientContractById,
  updateClientContractById,
  deleteClientContractById,
  getClientContractsByClientId,
};
