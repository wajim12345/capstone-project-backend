const connection = require("../configs/db");

const createConsent = (consent, callback) => {
  const query =
    "INSERT INTO consent (clientId, permissionNote, receivedDate, withdrawDate) VALUES (?,?,?,?)";
  const values = [
    consent.clientId,
    consent.permissionNote,
    consent.receivedDate,
    consent.withdrawDate,
  ];

  connection.query(query, values, callback);
};

const getConsentById = (consentId) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM consent WHERE consentId = ?";

    connection.query(query, [consentId], (err, result) => {
      if (err) {
        return reject(err);
      }

      resolve(result[0]);
    });
  });
};

const deleteConsentById = (consentId, callback) => {
  const query = "DELETE FROM consent WHERE consentId = ?";
  connection.query(query, [consentId], callback);
};

const updateByConsentId = (consentId, consent, callback) => {
  const query =
    "UPDATE consent SET clientId = ?, permissionNote = ?, receivedDate = ?, withdrawDate = ? WHERE consentId = ?";
  const values = [
    consent.clientId,
    consent.permissionNote,
    consent.receivedDate,
    consent.withdrawDate,
    consentId,
  ];

  connection.query(query, values, callback);
};

const getAllConsent = (callback) => {
  const query = "SELECT * FROM consent";
  connection.query(query, callback);
};

const getConsentByClientId = (clientId) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM consent WHERE clientId = ?";

    connection.query(query, [clientId], (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

module.exports = {
  createConsent,
  getConsentById,
  deleteConsentById,
  updateByConsentId,
  getAllConsent,
  getConsentByClientId,
};
