const jwt = require("jsonwebtoken");

// verify if the user token is valid
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    // No token, unauthorized
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // Invalid token, forbidden
      return res.sendStatus(403);
    }

    req.user = user;
    console.log("Token verified, user:", user);
    next();
  });
};

// verify if the user is admin
const authorizeAdmin = (req, res, next) => {
  console.log("Checking admin status for user:", req.user); 
  if (!req.user || req.user.isAdmin !== 1) {
    return res.sendStatus(403);
  }
  next();
};

module.exports = { authenticateToken, authorizeAdmin };
