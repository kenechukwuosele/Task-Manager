const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

//Middleware to check if the user is authenticated
const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (token && token.startsWith("Bearer ")) {
      token = token.split(" ")[1]; // Extract the token from the header
      console.log("JWT_SECRET is", process.env.JWT_SECRET ? "loaded" : "missing");
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
      req.user = await User.findById(decoded.id).select("-password"); // Find the user by ID and exclude the password field
      next(); // Call the next middleware or route handler
    } else {
      return res.status(401).json({ message: "Not authorized, no token" }); // If no token is provided
    }
  } catch (error) {
    console.error("Error in authentication middleware:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" }); // Handle errors
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
