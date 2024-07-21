const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, getUserByEmail } = require('../models/user');

const registerUserController = async (req, res) => {
  const { firstName, lastName, email, phoneNumber, address, postalCode, city, province, role, profilePicture, password } = req.body;
  
  const validRoles = ['admin', 'service'];
  if (!validRoles.includes(role)) {
    return res.status(400).send({ message: 'Invalid role. Role must be either "admin" or "service".' });
  }


  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { firstName, lastName, email, phoneNumber, address, postalCode, city, province, role, profilePicture, password: hashedPassword };

    createUser(user, (err, results) => {
      if (err) {
        return res.status(400).send(err);
      }
      res.status(201).send(results);
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

const loginUserController = (req, res) => {
  const { email, password } = req.body;

  getUserByEmail(email, async (err, results) => {
    if (err) {
      console.error('Error querying user by email:', err);
      return res.status(500).send('Internal Server Error');
    }

    if (results.length === 0) {
      return res.status(401).send('Invalid email or password');
    }

    const user = results[0];

    try {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        const token = jwt.sign({ id: user.id, email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });

        // Exclude the password from the user object
        const { password, ...userWithoutPassword } = user;

        res.json({
          token,
          user: userWithoutPassword
        });
      } else {
        res.status(401).send('Invalid email or password');
      }
    } catch (error) {
      console.error('Error during password comparison or token generation:', error);
      res.status(500).send('Internal Server Error');
    }
  });
};


module.exports = {
  registerUserController,
  loginUserController
};