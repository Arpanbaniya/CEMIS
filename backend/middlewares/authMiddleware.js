const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract Bearer token

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token and check expiration
    req.user = decoded; // Attach user data to request
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      console.error("Token expired:", err);
      return res.status(401).json({ message: "Session expired. Please log in again." });
    } else if (err.name === "JsonWebTokenError") {
      console.error("Invalid token:", err);
      return res.status(400).json({ message: "Invalid token." });
    } else {
      console.error("Token verification error:", err);
      return res.status(500).json({ message: "Internal server error during token verification." });
    }
  }
};

module.exports = authMiddleware;
