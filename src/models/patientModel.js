const connection = require("../configs/db");

const createPatient = (patient, callback) => {
  const query = `
  INSERT INTO ExistingClient (
    aType, teamMemberList, guardianList, consentList, insurance, invoice, psNote,
    firstName, lastName, gender, birthDate, address, postalCode, phone, email,
    diagnosis, school, age, currentStatus, fscdIdNum, contractId, guardianId,
    insuranceInfoId, invoiceId, consentId, scheduleId, teamMemberId, outsideProviderId
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;
  const values = [
    patient.aType,
    patient.teamMemberList,
    patient.guardianList,
    patient.consentList,
    patient.insurance,
    patient.invoice,
    patient.psNote,
    patient.firstName,
    patient.lastName,
    patient.gender,
    patient.birthDate,
    patient.address,
    patient.postalCode,
    patient.phone,
    patient.email,
    patient.diagnosis,
    patient.school,
    patient.age,
    patient.currentStatus,
    patient.fscdIdNum,
    patient.contractId,
    patient.guardianId,
    patient.insuranceInfoId,
    patient.invoiceId,
    patient.consentId,
    patient.scheduleId,
    patient.teamMemberId,
    patient.outsideProviderId,
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

const getPatientById = (clientId, callback) => {
  const query = "SELECT * FROM ExistingClient WHERE clientId = ?";
  connection.query(query, [clientId], callback);
};

const updatePatientById = (clientId, patient, callback) => {
  const query = `
    UPDATE ExistingClient SET
      aType = ?, teamMemberList = ?, guardianList = ?, consentList = ?, insurance = ?, invoice = ?, psNote = ?,
      firstName = ?, lastName = ?, gender = ?, birthDate = ?, address = ?, postalCode = ?, phone = ?, email = ?,
      diagnosis = ?, school = ?, age = ?, currentStatus = ?, fscdIdNum = ?, contractId = ?, guardianId = ?,
      insuranceInfoId = ?, invoiceId = ?, consentId = ?, scheduleId = ?, teamMemberId = ?, outsideProviderId = ?
    WHERE clientId = ?
  `;
  const values = [
    patient.aType,
    patient.teamMemberList,
    patient.guardianList,
    patient.consentList,
    patient.insurance,
    patient.invoice,
    patient.psNote,
    patient.firstName,
    patient.lastName,
    patient.gender,
    patient.birthDate,
    patient.address,
    patient.postalCode,
    patient.phone,
    patient.email,
    patient.diagnosis,
    patient.school,
    patient.age,
    patient.currentStatus,
    patient.fscdIdNum,
    patient.contractId,
    patient.guardianId,
    patient.insuranceInfoId,
    patient.invoiceId,
    patient.consentId,
    patient.scheduleId,
    patient.teamMemberId,
    patient.outsideProviderId,
    clientId,
  ];
  connection.query(query, values, callback);
};

const deletePatientById = (clientId, callback) => {
  const query = "DELETE FROM ExistingClient WHERE clientId = ?";
  connection.query(query, [clientId], callback);
};

module.exports = {
  createPatient,
  getPatientById,
  updatePatientById,
  deletePatientById,
};
