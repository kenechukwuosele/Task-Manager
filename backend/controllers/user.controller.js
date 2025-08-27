const task = require("../models/task.model");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    const usersWithTasks = await Promise.all(
      users.map(async (user) => {
        const pendingTasks = await task.countDocuments({
          user: user._id,
          status: "pending",
        });
        const inProgressTasks = await task.countDocuments({
          user: user._id,
          status: "in-progress",
        });
        const completedTasks = await task.countDocuments({
          user: user._id,
          status: "completed",
        });
        return {
          ...user._doc,
          pendingTasks,
          inProgressTasks,
          completedTasks,
        };
      })
    );

    res.json(usersWithTasks);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Export the controller functions
module.exports = {
  getUsers,
  getUserById,
  deleteUser,
};
