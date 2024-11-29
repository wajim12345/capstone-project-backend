const connection = require("../configs/db");

const getAllPatients = (callback) => {
  const query = "SELECT * FROM ExistingClient";
  connection.query(query, callback);
};

const createPatient = (patient, callback) => {
  const query = `
  INSERT INTO ExistingClient (
    psNote, firstName, lastName, gender, birthDate, address, city, province, postalCode, phoneNumber, email,
    school, age, currentStatus, fscdIdNum, grade, serviceStartDate, serviceEndDate
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;
  const values = [
    patient.psNote, 
    patient.firstName, 
    patient.lastName, 
    patient.gender, 
    patient.birthDate, 
    patient.address, 
    patient.city, 
    patient.province, 
    patient.postalCode, 
    patient.phoneNumber, 
    patient.email, 
    patient.school, 
    patient.age, 
    patient.currentStatus, 
    patient.fscdIdNum, 
    patient.grade,
    patient.serviceStartDate,
    patient.serviceEndDate
  ];
  connection.query(query, values, (err, results) => {
    if (err) {
      return callback(err);
    }
    // Fetch the newly created patient data using the auto-generated clientId
    const getPatientQuery = "SELECT * FROM ExistingClient WHERE clientId = ?";
    connection.query(
      getPatientQuery,
      [results.insertId],
      (err, patientResults) => {
        if (err) {
          return callback(err);
        }
        callback(null, patientResults[0]);
      }
    );
  });
};

const getPatientById = (clientId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM ExistingClient WHERE clientId = ?
    `;
    connection.query(query, [clientId], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};

const updatePatientById = (clientId, patient) => {
  return new Promise((resolve, reject) => {
    // Initialize an array to hold the field assignments
    const fields = [];
    const values = [];

    // Iterate over the patient object to dynamically create the query
    Object.keys(patient).forEach((key) => {
      if (patient[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(patient[key]);
      }
    });

    // Join the fields array with commas to form the SET clause
    const query = `UPDATE ExistingClient SET ${fields.join(', ')} WHERE clientId = ?`;
    values.push(clientId); // Add clientId to the values array

    // Execute the query and handle the promise resolve/reject
    connection.query(query, values, (err, results) => {
      if (err) {
        return reject(err); // reject the promise with the error
      }
      resolve(results); // resolve the promise with the results
    });
  });
};


const deletePatientById = (clientId, callback) => {
  const query = "DELETE FROM ExistingClient WHERE clientId = ?";
  connection.query(query, [clientId], callback);
};

module.exports = {
  getAllPatients,
  createPatient,
  getPatientById,
  updatePatientById,
  deletePatientById,
};
