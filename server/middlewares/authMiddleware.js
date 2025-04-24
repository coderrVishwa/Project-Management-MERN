const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];  // Get token from headers
    const decryptedToken = jwt.verify(token, process.env.JWT_SECRET);  // Verify token
    req.body.userId = decryptedToken.userId;  // Attach user ID to the request body
    next();  // Proceed to the next middleware or route handler
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};
