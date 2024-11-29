// src/controllers/waitlistClientController.js
const waitlistClientModel = require('../models/waitlistClientModel.js');

const waitlistClientController = {
  createWaitlistClient: (req, res) => {
    const data = req.body;
    waitlistClientModel.createWaitlistClient(data, (err, results) => {
      if (err) {
        console.error('Error creating waitlist client:', err);
        res.status(500).send('Error creating waitlist client');
      } else {
        res.status(201).send({ waitlistClientId: results.insertId });
      }
    });
  },

  getAllWaitlistClients: (req, res) => {
    waitlistClientModel.getAllWaitlistClients((err, results) => {
      if (err) {
        console.error('Error fetching waitlist clients:', err);
        res.status(500).send('Error fetching waitlist clients');
      } else {
        res.status(200).send(results);
      }
    });
  },

  getWaitlistClientById: (req, res) => {
    const id = req.params.id;
    waitlistClientModel.getWaitlistClientById(id, (err, results) => {
      if (err) {
        console.error('Error fetching waitlist client:', err);
        res.status(500).send('Error fetching waitlist client');
      } else if (results.length === 0) {
        res.status(404).send('Waitlist client not found');
      } else {
        res.status(200).send(results[0]);
      }
    });
  },

  updateWaitlistClient: (req, res) => {
    const id = req.params.id;
    const data = req.body;
  
    waitlistClientModel.updateWaitlistClient(id, data, (err, results) => {
      if (err) {
        console.error('Error updating waitlist client:', err);
        res.status(500).send('Error updating waitlist client');
      } else {
        res.status(200).send('Waitlist client updated successfully');
      }
    });
  },

  deleteWaitlistClient: (req, res) => {
    const id = req.params.id;
    waitlistClientModel.deleteWaitlistClient(id, (err, results) => {
      if (err) {
        console.error('Error deleting waitlist client:', err);
        res.status(500).send('Error deleting waitlist client');
      } else {
        res.status(200).send('Waitlist client deleted successfully');
      }
    });
  },
};

module.exports = waitlistClientController;
