const express = require('express');
const router = express.Router();
const waitlistClientController = require('../controllers/waitlistClientController');
const {
    authenticateToken,
    authorizeAdmin,
  } = require("../middleware/authMiddleware");
// Create a new waitlist client
router.post('/createWaitlistClient',authenticateToken, waitlistClientController.createWaitlistClient, authorizeAdmin);

// Get all waitlist clients
router.get('/getAllWaitlistClient',authenticateToken, waitlistClientController.getAllWaitlistClients, authorizeAdmin );

// Get a specific waitlist client by ID
router.get('/getWaitlistClient/:id', authenticateToken, waitlistClientController.getWaitlistClientById, authorizeAdmin);

// Update a waitlist client
router.put('/updateWaitlistClient/:id',authenticateToken, waitlistClientController.updateWaitlistClient, authorizeAdmin);

// Delete a waitlist client
router.delete('/deleteWaitlistClient/:id',authenticateToken, waitlistClientController.deleteWaitlistClient, authorizeAdmin);

module.exports = router;
