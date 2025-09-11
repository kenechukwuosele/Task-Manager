const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

//Middleware to check if the user is authenticated

const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (token && token.startsWith("Bearer ")) {
      token = token.split(" ")[1]; // Extract the token

      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ message: "Token expired" });
        }
        if (err.name === "JsonWebTokenError") {
          return res.status(401).json({ message: "Invalid token" });
        }
        return res.status(401).json({ message: "Not authorized" });
      }

      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      return next();
    } else {
      return res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (error) {
    console.error("Error in authentication middleware:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//Middleware to check if the user is an admin
const adminOnly = async (req, res, next) => {
  try {
    if (req.user && req.user.role === "admin") {
      next(); // If the user is an admin, proceed to the next middleware or route handler
    } else {
      return res.status(403).json({ message: "Access denied, admin only" }); // If not an admin, deny access
    }
  } catch (error) {
    console.error("Error in admin middleware:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" }); // Handle errors
  }
};

module.exports = { protect, adminOnly }; // Export the middlewares for use in other parts of the application
