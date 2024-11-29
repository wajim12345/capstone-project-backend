const {
  getAllPatients,
  createPatient,
  getPatientById,
  updatePatientById,
  deletePatientById,
} = require("../models/patientModel");
const { getTeamMembersByClientId } = require("../models/teamMemberModel");

const getAllPatientsController = (req, res) => {
  getAllPatients((err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send(results);
  });
};

const createPatientController = (req, res) => {
  const patient = req.body;
  createPatient(patient, (err, createdPatient) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).send(createdPatient);
  });
};

const getPatientController = async (req, res) => {
  const { clientId } = req.params;
  const loggedInUserId = req.user.id; // ID of the logged-in user
  const isAdmin = req.user.isAdmin; // Admin status of the logged-in user

  try {
    // If not an admin, check if the user is a team member of the client
    if (!isAdmin) {
      const teamMembers = await getTeamMembersByClientId(clientId);

      // Check if the logged-in user is in the list of team members
      const isTeamMember = teamMembers.some(
        (member) =>
          member.userId === loggedInUserId ||
          member.outsideProviderId === loggedInUserId
      );

      if (!isTeamMember) {
        return res.status(403).json({
          message:
            "Access denied. You are not authorized to view this patient's information.",
        });
      }
    }

    // Fetch patient details if admin or authorized team member
    const patient = await getPatientById(clientId);
    if (!patient || patient.length === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json(patient[0]);
  } catch (err) {
    res.status(500).json({ message: "Error fetching patient", error: err });
  }
};

const updatePatientController = async (req, res) => {
  const { clientId } = req.params;
  const patient = req.body;

  try {
    // check if the patient exists
    const results = await getPatientById(clientId);
    if (results.length === 0) {
      return res.status(404).send("Patient not found");
    }

    // update if the patient exists
    const updateResults = await updatePatientById(clientId, patient);
    res.status(200).send({ message: "Patient successfully deleted", updateResults });

    res.status(200).send();
  } catch (err) {
    res.status(500).send(err);
  }
};

const deletePatientController = (req, res) => {
  const { clientId } = req.params;

  // check if the patient exists
  getPatientById(clientId, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (results.length === 0) {
      return res.status(404).send("Patient not found");
    }

    // delete if the patient exists
    deletePatientById(clientId, (err, deleteResults) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(200).send({ message: "Patient successfully deleted" });
    });
  });
};

module.exports = {
  getAllPatientsController,
  createPatientController,
  getPatientController,
  updatePatientController,
  deletePatientController,
};
