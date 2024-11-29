// const crypto = require("crypto");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const sendEmail = require("../utils/sendEmail");
// const {
//   createUser,
//   getUserByEmail,
//   updateUserByEmail,
// } = require("../models/userModel");

// const registerUserController = async (req, res) => {
//   const {
//     firstName,
//     lastName,
//     email,
//     phoneNumber,
//     address,
//     postalCode,
//     city,
//     province,
//     role,
//     profilePicture,
//     password,

//   } = req.body;

//   const validRoles = ["admin", "service"];
//   if (!validRoles.includes(role)) {
//     return res
//       .status(400)
//       .send({
//         message: 'Invalid role. Role must be either "admin" or "service".',
//       });
//   }

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = {
//       firstName,
//       lastName,
//       email,
//       phoneNumber,
//       address,
//       postalCode,
//       city,
//       province,
//       role,
//       profilePicture,
//       password: hashedPassword,
//     };

//     createUser(user, (err, results) => {
//       if (err) {
//         return res.status(400).send(err);
//       }
//       res.status(201).send(results);
//     });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// };

// const loginUserController = (req, res) => {
//   const { email, password } = req.body;

//   getUserByEmail(email, async (err, results) => {
//     if (err) {
//       return res.status(500).send("Internal Server Error");
//     }

//     if (results.length === 0) {
//       return res.status(401).send("Invalid email or password");
//     }

//     const user = results[0];

//     try {
//       const passwordMatch = await bcrypt.compare(password, user.password);
//       if (passwordMatch) {
//         const token = jwt.sign(
//           { id: user.id, email: user.email, role: user.role },
//           process.env.JWT_SECRET,
//           { expiresIn: "1d" }
//         );

//         // Exclude the password from the user object
//         const { password, ...userWithoutPassword } = user;

//         res.json({
//           token,
//           user: userWithoutPassword,
//         });
//       } else {
//         res.status(401).send("Invalid email or password");
//       }
//     } catch (error) {
//       res
//         .status(500)
//         .send("Error during password comparison or token generation:", error);
//     }
//   });
// };

// const requestPasswordReset = async (req, res) => {
//   const { email } = req.body;

//   try {
//     const results = await new Promise((resolve, reject) =>
//       getUserByEmail(email, (err, results) => {
//         if (err) {
//           console.error("Error finding user by email:", err);
//           reject(err);
//         } else {
//           resolve(results);
//         }
//       })
//     );

//     if (results.length === 0) {
//       return res.status(404).json({ error: "No user found with that email" });
//     }

//     const user = results[0];
//     const resetPasswordToken = jwt.sign(
//       { id: user.id, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );
//     const resetPasswordExpires = new Date(Date.now() + 3600000)
//       .toISOString()
//       .slice(0, 19)
//       .replace("T", " ");

//     await new Promise((resolve, reject) =>
//       updateUserByEmail(
//         email,
//         { resetPasswordToken, resetPasswordExpires },
//         (err, results) => {
//           if (err) {
//             reject(err);
//           } else {
//             resolve(results);
//           }
//         }
//       )
//     );

//     const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetPasswordToken}`;

//     await sendEmail(
//       user.email,
//       "Password Reset",
//       `You are receiving this because you (or someone else) have requested to reset the password for your account.\n\n
//       Please click on the following link, or paste this into your browser to complete the process:\n\n
//       ${resetPasswordUrl}\n\n
//       If you did not request this, please ignore this email and your password will remain unchanged.\n`
//     );

//     res.status(200).json({
//       resetPasswordToken,
//       message: "A reset password link has been sent to your email address",
//     });
//   } catch (error) {
//     console.error("Error during password reset request:", error);
//     res.status(500).json({ error: "An error occurred during the password reset request" });
//   }
// };

// const resetPassword = async (req, res) => {
//   const { resetToken } = req.params;
//   const { newPassword } = req.body;

//   try {
//     const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
//     const email = decoded.email;

//     const results = await new Promise((resolve, reject) =>
//       getUserByEmail(email, (err, results) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(results);
//         }
//       })
//     );

//     if (results.length === 0) {
//       return res.status(400).send("Invalid or expired token");
//     }

//     const user = results[0];
//     if (new Date(user.resetPasswordExpires) < Date.now()) {
//       return res.status(400).send("Token has expired");
//     }

//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     await new Promise((resolve, reject) =>
//       updateUserByEmail(
//         email,
//         {
//           password: hashedPassword,
//           resetPasswordToken: null,
//           resetPasswordExpires: null,
//         },
//         (err, results) => {
//           if (err) {
//             reject(err);
//           } else {
//             resolve(results);
//           }
//         }
//       )
//     );

//     res.status(200).send("Password has been updated");
//   } catch (error) {
//     res.status(500).send(error);
//   }
// };

// module.exports = {
//   registerUserController,
//   loginUserController,
//   requestPasswordReset,
//   resetPassword,
// };

const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const {
  createUser,
  getUserByEmail,
  updateUserByEmail,
} = require("../models/userModel");

const registerUserController = (req, res) => {
  const user = { ...req.body };

  createUser(user, (err, results) => {
    if (err) {
      console.error("Error during user registration:", err);
      return res
        .status(400)
        .send({ error: "Failed to register user", details: err });
    }

    console.log("User registered successfully:", results);
    res
      .status(201)
      .send({ message: "User created successfully", userId: results.insertId });
  });
};

// const loginUserController = (req, res) => {

const loginUserController = (req, res) => {
  const { email, password } = req.body;

  getUserByEmail(email, async (err, results) => {
    if (err) {
      return res.status(500).send("Internal Server Error");
    }

    if (results.length === 0) {
      return res.status(401).send("Invalid email or password");
    }

    const user = results[0];

    try {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        const token = jwt.sign(
          { id: user.userId, email: user.email, isAdmin: user.isAdmin },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        // Exclude the password from the user object
        const { password, ...userWithoutPassword } = user;

        return res.json({
          token,
          user: userWithoutPassword,
        });
      } else {
        console.log("Password mismatch for user:", email);
        return res.status(401).send("Invalid email or password");
      }
    } catch (error) {
      console.log(
        "Error during password comparison or token generation:",
        error
      );
      return res.status(500).send("Internal Server Error");
    }
  });
};

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const results = await new Promise((resolve, reject) =>
      getUserByEmail(email, (err, results) => {
        if (err) {
          console.error("Error finding user by email:", err);
          reject(err);
        } else {
          resolve(results);
        }
      })
    );

    if (results.length === 0) {
      return res.status(404).json({ error: "No user found with that email" });
    }

    const user = results[0];
    const captchaCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetPasswordExpires = new Date(Date.now() + 3600000)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    await new Promise((resolve, reject) =>
      updateUserByEmail(
        email,
        { captchaCode, resetPasswordExpires },
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      )
    );

    await sendEmail(
      user.email,
      "Password Reset",
      `You are receiving this because you (or someone else) have requested to reset the password for your account.\n\n
      Please use the following CAPTCHA code to complete the process:\n\n
      CAPTCHA Code: ${captchaCode}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`
    );

    res.status(200).json({
      message: "A CAPTCHA code has been sent to your email address",
      captchaCode,
      email,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred during the password reset request" });
  }
};

const resetPassword = async (req, res) => {
  const { email, newPassword, captchaCode } = req.body;

  try {
    const results = await new Promise((resolve, reject) =>
      getUserByEmail(email, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      })
    );

    if (results.length === 0) {
      return res.status(400).send("Invalid email");
    }

    const user = results[0];
    if (new Date(user.resetPasswordExpires) < Date.now()) {
      return res.status(400).send("CAPTCHA code has expired");
    }

    if (user.captchaCode !== captchaCode) {
      return res.status(400).send("Invalid CAPTCHA code");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await new Promise((resolve, reject) =>
      updateUserByEmail(
        email,
        {
          password: hashedPassword,
          captchaCode: null,
          resetPasswordExpires: null,
        },
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      )
    );

    res.status(200).send("Password has been updated");
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  registerUserController,
  loginUserController,
  requestPasswordReset,
  resetPassword,
};
