const express = require("express");
const { adminOnly, protect } = require("../middlewares/auth.middleware");
const { getUsers, getUserById, deleteUser } = require("../controllers/user.controller");


const UserRoutes = express.Router();

//User routes
UserRoutes.get("/", protect, adminOnly, getUsers);
UserRoutes.get("/:id", protect, adminOnly, getUserById);
UserRoutes.delete("/:id", protect, adminOnly, deleteUser );

module.exports = UserRoutes; // Export the user routes for use in the main server file  

