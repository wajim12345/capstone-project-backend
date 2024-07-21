const express = require('express');
const router = express.Router();
const { registerUserController, loginUserController } = require('../controllers/authController');

// Registration endpoint
router.post('/register', registerUserController);

// Login endpoint
router.post('/login', loginUserController);

module.exports = router;