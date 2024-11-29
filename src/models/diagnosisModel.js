const connection = require("../configs/db");

// Function to get all diagnoses
const getAllDiagnosis = (callback) => {
  const query = "SELECT * FROM Diagnosis";
  connection.query(query, callback);
};

// Function to create a new diagnosis
const createDiagnosis = (diagnosis, aType, clientId, callback) => {
  const query = `
    INSERT INTO Diagnosis (diagnosis, aType, clientId)
    VALUES (?, ?, ?)
  `;

  const values = [diagnosis, aType, clientId];

  connection.query(query, values, (err, results) => {
    if (err) {
      return callback(err);
    }
    // Fetch the newly created diagnosis data
    const getDiagnosisQuery = "SELECT * FROM Diagnosis WHERE diagnosisId = ?";
    connection.query(
      getDiagnosisQuery,
      [results.insertId],
      (err, diagnosisResults) => {
        if (err) {
          return callback(err);
        }
        callback(null, diagnosisResults[0]);
      }
    );
  });
};

// Function to get a diagnosis by clientId
const getDiagnosisByClientId = (clientId, callback) => {
  const query = "SELECT * FROM Diagnosis WHERE clientId = ?";
  connection.query(query, [clientId], callback);
};

// Function to update diagnosis by diagnosisId
const updateDiagnosisById = (diagnosisId, diagnosisData, callback) => {
  // Initialize an array to hold the field assignments
  const fields = [];
  const values = [];

  // Iterate over the diagnosis object to dynamically create the query
  Object.keys(diagnosisData).forEach((key) => {
    if (diagnosisData[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(diagnosisData[key]);
    }
  });

  // Join the fields array with commas to form the SET clause
  const query = `UPDATE Diagnosis SET ${fields.join(
    ", "
  )} WHERE diagnosisId = ?`;
  values.push(diagnosisId); // Add diagnosisId to the values array

  // Execute the query
  connection.query(query, values, callback);
};

// Function to delete a diagnosis by diagnosisId
const deleteDiagnosisById = (diagnosisId, callback) => {
  const query = "DELETE FROM Diagnosis WHERE diagnosisId = ?";
  connection.query(query, [diagnosisId], callback);
};

const getDiagnosisById = (diagnosisId, callback) => {
  const query = "SELECT * FROM Diagnosis WHERE diagnosisId = ?";
  connection.query(query, [diagnosisId], (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results[0]);
  });
};

module.exports = {
  getAllDiagnosis,
  createDiagnosis,
  getDiagnosisByClientId,
  updateDiagnosisById,
  deleteDiagnosisById,
  getDiagnosisById,
};
