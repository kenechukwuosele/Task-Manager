const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateTokenAndSetCookie } = require("../utils/generateTokenandSetCookie");
const PQueue = require("p-queue").default;  

// Create a global queue (all controllers share this)
const queue = new PQueue({ concurrency: 1 }); 
// concurrency: 1 means one request at a time (you can raise to 2, 3, etc.)

// register a new user
const registerUser = async (req, res) => {
  await queue.add(async () => {
    try {
      const { name, email, password, profileImageUrl, adminInviteToken } = req.body;

       if (!name || !email || !password) {
        return res.status(400).json({ message: "Name, email and password are required" });
      }

      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      if (!password) return res.status(400).json({ message: "Password is required" });
      if (!email) return res.status(400).json({ message: "Email is required" });

      // create a new user
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        profileImageUrl: profileImageUrl || null,
        role: adminInviteToken ? "admin" : "user",
      });

      await newUser.save();

      res.status(201).json({
        ...newUser._doc,
        message: "User Created Successfully",
        token: generateTokenAndSetCookie(newUser._id, res),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  });
};

// login a user
const loginUser = async (req, res) => {
  await queue.add(async () => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) return res.status(404).json({ message: "Invalid email or password" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

      res.json({
        ...user._doc,
        token: generateTokenAndSetCookie(user._id, res),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });
};

// get user profile
const getUserProfile = async (req, res) => {
  await queue.add(async () => {
    try {
      const user = await User.findById(req.user._id).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });

      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  });
};

// update user profile
const updateUserProfile = async (req, res) => {
  await queue.add(async () => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      if (req.body.password) {
        user.password = await bcrypt.hash(req.body.password, 10);
      }

      const updatedUser = await user.save();

      res.json({
        ...updatedUser._doc,
        token: generateTokenAndSetCookie(updatedUser._id, res),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};
