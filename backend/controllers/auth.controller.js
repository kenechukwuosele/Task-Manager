const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const PQueue = require("p-queue").default;
const { generateTokenAndSetCookie } = require("../utils/generateTokenandSetCookie");

const queue = new PQueue({ concurrency: 1 });

// REGISTER USER
const registerUser = async (req, res) => {
  await queue.add(async () => {
    try {
      const { name, email, password, adminInviteToken } = req.body;
      const profileImageUrl = req.file?.path || null;

      if (!name || !email || !password)
        return res.status(400).json({ message: "Name, email, and password required" });

      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: "User already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        profileImageUrl,
        role: adminInviteToken ? "admin" : "user",
      });

      await newUser.save();
      const accessToken = generateTokenAndSetCookie(newUser._id, res);

      res.status(201).json({ ...newUser._doc, message: "User created successfully", token: accessToken });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  });
};

// LOGIN USER
const loginUser = async (req, res) => {
  await queue.add(async () => {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ message: "Email and password required" });

      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ message: "Invalid email or password" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

      const accessToken = generateTokenAndSetCookie(user._id, res);

      res.json({ ...user._doc, token: accessToken });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });
};

// REFRESH TOKEN
const refreshAccessToken = (req, res) => {
  const token = req.cookies.refreshAccessToken;
  if (!token) return res.status(401).json({ message: "No refresh token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const accessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: "15m" });
    res.json({ accessToken });
  } catch (err) {
    console.error(err);
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

// GET PROFILE
const getUserProfile = async (req, res) => {
  await queue.add(async () => {
    try {
      const user = await User.findById(req.user._id).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });
};

// UPDATE PROFILE
const updateUserProfile = async (req, res) => {
  await queue.add(async () => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ message: "User not found" });

      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) user.password = await bcrypt.hash(req.body.password, 10);
      if (req.file?.path) user.profileImageUrl = req.file.path;

      const updatedUser = await user.save();
      const accessToken = generateTokenAndSetCookie(updatedUser._id, res);

      res.json({ ...updatedUser._doc, token: accessToken });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });
};

// LOGOUT
const logoutUser = (req, res) => {
  res.clearCookie("refreshAccessToken");
  res.json({ message: "Logged out successfully" });
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  refreshAccessToken,
  logoutUser,
};
