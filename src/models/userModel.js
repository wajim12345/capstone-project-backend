const connection = require("../configs/db");

const createUser = (user, callback) => {
  const query =
    "INSERT INTO users (firstName, lastName, email, password, phoneNumber, address, postalCode, city, province, role, profilePicture) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [
    user.firstName,
    user.lastName,
    user.email,
    user.password,
    user.phoneNumber,
    user.address,
    user.postalCode,
    user.city,
    user.province,
    user.role,
    user.profilePicture,
    // user.position
  ];

  connection.query(query, values, callback);
};

const getAllUsers = (callback) => {
  const query = "SELECT * FROM users";

  connection.query(query, callback);
};

const getUserByEmail = (email, callback) => {
  const query = "SELECT * FROM users WHERE email = ?";

  connection.query(query, [email], callback);
};

const getUserById = (id, callback) => {
  const query = "SELECT * FROM users WHERE id = ?";

  connection.query(query, [id], callback);
};

const updateUserById = (id, user, callback) => {
  const query =
    "UPDATE users SET firstName = ?, lastName = ?, email = ?, phoneNumber = ?, address = ?, postalCode = ?, city = ?, province = ?, role = ?, profilePicture = ?, position = ? WHERE id = ?";
  const values = [
    user.firstName,
    user.lastName,
    user.email,
    user.phoneNumber,
    user.address,
    user.postalCode,
    user.city,
    user.province,
    user.role,
    user.profilePicture,
    user.position,
    id,
  ];

  connection.query(query, values, callback);
};

const updateUserByEmail = (email, updates, callback) => {
  const fields = Object.keys(updates)
    .map((field) => `${field} = ?`)
    .join(", ");
  const values = [...Object.values(updates), email];
  const query = `UPDATE users SET ${fields} WHERE email = ?`;
  connection.query(query, values, callback);
};

const deleteUserById = (id, callback) => {
  const query = "DELETE FROM users WHERE id = ?";

  connection.query(query, [id], callback);
};

module.exports = {
  createUser,
  getAllUsers,
  getUserByEmail,
  getUserById,
  updateUserById,
  deleteUserById,
  updateUserByEmail,
};
