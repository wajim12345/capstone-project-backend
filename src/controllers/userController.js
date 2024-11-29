const bcrypt = require("bcrypt");
const {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  getUserByEmail,
  getPasswordByUserId,
} = require("../models/userModel");

const getAllUsersController = (req, res) => {
  getAllUsers((err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send(results);
  });
};

const getUserByIdController = async (req, res) => {
  try {
    const userId = req.params.id;
    const loggedInUserId = req.user.id;
    const isAdmin = req.user.isAdmin; 

    // If the logged-in user is not an admin, restrict access to only their own user information
    if (!isAdmin && String(userId) !== String(loggedInUserId)) {
      return res
        .status(403)
        .json({
          message: "Access denied. You can only view your own profile.",
        });
    }

    // Fetch user details
    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching user", error: err });
  }
};

// Controller to update user by admin
const updateUserByIdByAdminController = async (req, res) => {
  const userId = req.params.id;
  const { email, ...otherFields } = req.body;

  try {
    // Check if the user exists by ID
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).send({ error: "User ID not found" });
    }

    // If email is being updated, check if the email is already in use by another user
    if (email) {
      const userWithEmail = await getUserByEmail(email);
      if (userWithEmail && userWithEmail.userId != userId) {
        return res.status(400).send({ error: "Email already exists" });
      }
    }

    // Proceed with updating the user
    const updateResults = await updateUserById(
      userId,
      { email, ...otherFields },
      true
    );
    res.send(updateResults);
  } catch (err) {
    res.status(500).send({ error: "An error occurred", details: err.message });
  }
};

// Controller to update user by self
const updateUserByIdBySelfController = async (req, res) => {
  const userId = req.params.id;
  const loggedInUserId = req.user.id;

  // Check if the logged-in user is trying to update their own profile
  if (String(userId) !== String(loggedInUserId)) {
    return res
      .status(403)
      .send({ message: "You are not authorized to update this profile." });
  }

  // Allowed fields for users to update their own profile
  const allowedFields = [
    "phoneNumber",
    "address",
    "postalCode",
    "city",
    "province",
  ];

  // Check for any invalid fields in the request
  const sentFields = Object.keys(req.body);
  const invalidFields = sentFields.filter(
    (field) => !allowedFields.includes(field)
  );

  if (invalidFields.length > 0) {
    return res.status(400).send({
      message: `The following fields are not allowed to be updated: ${invalidFields.join(
        ", "
      )}`,
    });
  }

  try {
    // Update the user with allowed fields
    const results = await updateUserById(userId, req.body, false);
    res.send({ message: "User updated successfully.", results });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error updating user.", error: error.message });
  }
};

// Change password
const changePasswordController = async (req, res) => {
  const userId = req.params.id;
  const loggedInUserId = req.user.id;

  // Ensure the user is updating their own password
  if (String(userId) !== String(loggedInUserId)) {
    return res
      .status(403)
      .send({ message: "You are not authorized to change this password." });
  }

  const { currentPassword, newPassword } = req.body;

  // Validate request data
  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .send({ message: "Current password and new password are required." });
  }

  try {
    // Fetch the current hashed password from the database
    const user = await getUserById(loggedInUserId);
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // Compare the current password with the stored hashed password
    const isCurrentPasswordMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isCurrentPasswordMatch) {
      return res
        .status(401)
        .send({ message: "Current password is incorrect." });
    }

    // Ensure the new password is different from the current password
    const isNewPasswordSame = await bcrypt.compare(newPassword, user.password);
    if (isNewPasswordSame) {
      return res.status(400).send({
        message: "New password must be different from the current password.",
      });
    }

    // Hash the new password before sending it to the update function
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Call updateUserById to update the password in the database
    const updateUser = { password: hashedNewPassword };
    await updateUserById(userId, updateUser, false);

    res.send({ message: "Password changed successfully." });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).send({ message: "Server error: " + error.message });
  }
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
  updateUserByIdByAdminController,
  deleteUserByIdController,
  updateUserByIdBySelfController,
  changePasswordController,
};
