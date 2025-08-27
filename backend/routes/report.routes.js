const express = require("express");
const { adminOnly, protect } = require("../middlewares/auth.middleware");
const { exportTasksReport, exportUsersReport } = require("../controllers/report.controller");

const ReportRoutes = express.Router();

ReportRoutes.get("/export/tasks", protect, adminOnly, exportTasksReport);
ReportRoutes.get("/export/users", protect, adminOnly, exportUsersReport);

module.exports = ReportRoutes;


