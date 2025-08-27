const express = require("express");
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware"); // Assuming you have a middleware for handling file uploads

const authRoutes = express.Router();


//auth routes
authRoutes.post("/register", registerUser);
authRoutes.post("/login", loginUser);
authRoutes.get("/profile", protect, getUserProfile);
authRoutes.put("/update-profile", protect, updateUserProfile);

authRoutes.post('/upload-image', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    res.json({
      message: 'Image uploaded successfully',
      filePath: `/uploads/${req.file.filename}`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = authRoutes; // Export the auth routes for use in the main server file