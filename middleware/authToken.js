const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  // Extract the token from the "Authorization" header
  const token = req.headers.authorization?.split(" ")[1]; // Format: Bearer <token>

  if (!token) {
    return res.status(401).json({ message: "Access denied. Token missing." });
  }
  try {
    // Verify the token using the secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach the decoded user data (e.g., userId) to the request object
    req.user = decoded;
    next(); // Pass control to the next middleware or route handler
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};
module.exports = authenticateToken;
