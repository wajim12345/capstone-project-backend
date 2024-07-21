const express = require('express');
const router = express.Router();
const { getAllUsersController, getUserByIdController, updateUserByIdController, deleteUserByIdController } = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');

// Protect routes
router.get('/', authenticateToken, getAllUsersController);
router.get('/:id', authenticateToken, getUserByIdController);
router.patch('/:id', authenticateToken, updateUserByIdController);
router.delete('/:id', authenticateToken, deleteUserByIdController);

module.exports = router;