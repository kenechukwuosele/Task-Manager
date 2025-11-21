const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  refreshAccessToken,
  logoutUser,
} = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

const authRoutes = express.Router();

// auth routes
authRoutes.post("/register", upload.single("profilePic"), registerUser); // MUST match frontend field name
authRoutes.post("/login", loginUser);
authRoutes.get("/profile", protect, getUserProfile);
authRoutes.put("/update-profile", protect, upload.single("profilePic"), updateUserProfile);
authRoutes.post("/refresh", refreshAccessToken);
authRoutes.post("/logout", logoutUser);


module.exports = authRoutes;
