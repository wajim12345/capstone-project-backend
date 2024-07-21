const { getAllUsers, getUserById, updateUserById, deleteUserById } = require('../models/user');

const getAllUsersController = (req, res) => {
  getAllUsers((err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send(results);
  });
};

const getUserByIdController = (req, res) => {
  getUserById(req.params.id, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (results.length === 0) {
      return res.status(404).send('User not found');
    }
    res.send(results[0]);
  });
};

const updateUserByIdController = (req, res) => {
  updateUserById(req.params.id, req.body, (err, results) => {
    if (err) {
      return res.status(400).send(err);
    }
    res.send(results);
  });
};

const deleteUserByIdController = (req, res) => {
  deleteUserById(req.params.id, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send(results);
  });
};

module.exports = {
  getAllUsersController,
  getUserByIdController,
  updateUserByIdController,
  deleteUserByIdController
};