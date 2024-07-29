const {
  createPatient,
  getPatientById,
  updatePatientById,
  deletePatientById,
} = require("../models/patientModel");

const createPatientController = (req, res) => {
  const patient = req.body;
  createPatient(patient, (err, createdPatient) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).send(createdPatient);
  });
};

const getPatientController = (req, res) => {
  const { clientId } = req.params;
  getPatientById(clientId, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (results.length === 0) {
      return res.status(404).send("Patient not found");
    }
    res.status(200).send(results[0]);
  });
};

const updatePatientController = (req, res) => {
  const { clientId } = req.params;
  const patient = req.body;
  updatePatientById(clientId, patient, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send(results);
  });
};

const deletePatientController = (req, res) => {
  const { clientId } = req.params;
  deletePatientById(clientId, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send(results);
  });
};

module.exports = {
  createPatientController,
  getPatientController,
  updatePatientController,
  deletePatientController,
};
