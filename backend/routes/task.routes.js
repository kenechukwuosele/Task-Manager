const express = require("express");

const { protect, adminOnly } = require("../middlewares/auth.middleware");
const { getDashboardData, getUserDashboardData, getTasks, getTasksById, createTask, updateTask, deleteTask, updateTaskStatus, updateTaskCheckList } = require("../controllers/task.controller");

const taskRoutes = express.Router();

//task management routes
taskRoutes.get("/dashboard-data", protect, getDashboardData);
taskRoutes.get("/user-dashboard-data", protect, getUserDashboardData);
taskRoutes.get("/", protect, getTasks);
taskRoutes.get("/:id", protect, getTasksById);
taskRoutes.post("/", protect, adminOnly, createTask);
taskRoutes.put("/:id", protect, updateTask);
taskRoutes.delete("/:id", protect, adminOnly, deleteTask);
taskRoutes.put("/:id/status", protect, updateTaskStatus);
taskRoutes.put("/:id/todo", protect, updateTaskCheckList);


module.exports = taskRoutes;