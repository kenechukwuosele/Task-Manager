const express = require("express");
const { adminOnly, protect } = require("../middlewares/auth.middleware");
const {
  getUsers,
  getUserById,
  deleteUser,
  createUser,
  updateUser,
} = require("../controllers/user.controller");

const UserRoutes = express.Router();

//User routes
UserRoutes.get("/", protect, adminOnly, getUsers);
UserRoutes.get("/:id", protect, adminOnly, getUserById);
UserRoutes.delete("/:id", protect, adminOnly, deleteUser);
UserRoutes.post("/", protect, adminOnly, createUser);
UserRoutes.put("/:id", protect, adminOnly, updateUser);

module.exports = UserRoutes;
