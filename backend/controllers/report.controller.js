const Task = require("../models/task.model");
const User = require("../models/user.model");
const excelJS = require("exceljs");

//@desc Exports tasks report
//@route GET /api/reports/export/tasks
//@access Private/Admin
const exportTasksReport = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "name email");

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Tasks Report");

    worksheet.columns = [
      { header: "Task ID", key: "_id", width: 25 },
      { header: "Task Name", key: "name", width: 30 },
      { header: "Description", key: "description", width: 50 },
      { header: "Assigned To", key: "assignedTo.name", width: 30 },
      { header: "Assigned To Email", key: "assignedTo.email", width: 30 },
      { header: "Status", key: "status", width: 15 },
      { header: "Due Date", key: "dueDate", width: 20 },
      { header: "Priority", key: "priority", width: 15 },
    ];

    tasks.forEach((task) => {
      const assignedTo = task.assignedTo ? task.assignedTo.name : "Unassigned";
      const assignedToEmail = task.assignedTo
        ? task.assignedTo.email
        : "Unassigned";
      worksheet.addRow({
        _id: task._id,
        name: task.name,
        description: task.description,
        "assignedTo.name": assignedTo,
        "assignedTo.email": assignedToEmail,
        status: task.status,
        dueDate: task.dueDate
          ? task.dueDate.toISOString().split("T")[0]
          : "No Due Date",
        priority: task.priority,
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=tasks_report.xlsx"
    );

    return workbook.xlsx
      .write(res)
      .then(() => {
        res.status(200).end();
      })
      .catch((error) => {
        console.error("Error writing Excel file:", error);
        res.status(500).json({ message: "Error generating report" });
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error generating report", error: error.message });
    console.error("Error generating tasks report:", error);
  }
};

//@desc Exports users report
//@route GET /api/reports/export/users
//@access Private/Admin
const exportUsersReport = async (req, res) => {
  try {
    // 1) Fetch users
    const users = await User.find()
      .select("name email role createdAt")
      .lean();

    // 2) Fetch tasks and populate assigned user
    const userTasks = await Task.find()
      .populate("assignedTo", "name email _id")
      .lean();

    // 3) Initialize map
    const userTaskMap = {};
    users.forEach((user) => {
      userTaskMap[user._id] = {
        name: user.name,
        email: user.email,
        taskCount: 0,
        pendingTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0,
        overdueTasks: 0,
      };
    });

    // 4) Count tasks per user
    userTasks.forEach((task) => {
      if (task.assignedTo && userTaskMap[task.assignedTo._id]) {
        const stats = userTaskMap[task.assignedTo._id];

        stats.taskCount++;

        if (task.status === "Pending") {
          stats.pendingTasks++;
        } else if (task.status === "Completed") {
          stats.completedTasks++;
        } else if (task.status === "In Progress") {
          stats.inProgressTasks++;
        }

        if (task.dueDate && new Date(task.dueDate) < new Date()) {
          stats.overdueTasks++;
        }
      }
    });

    // 5) Prepare Excel workbook
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Users Report");

    worksheet.columns = [
      { header: "User ID", key: "_id", width: 25 },
      { header: "Name", key: "name", width: 30 },
      { header: "Email", key: "email", width: 30 },
      { header: "Role", key: "role", width: 15 },
      { header: "Created At", key: "createdAt", width: 20 },
      { header: "Total Tasks", key: "taskCount", width: 15 },
      { header: "Pending Tasks", key: "pendingTasks", width: 15 },
      { header: "Completed Tasks", key: "completedTasks", width: 18 },
      { header: "In Progress Tasks", key: "inProgressTasks", width: 20 },
      { header: "Overdue Tasks", key: "overdueTasks", width: 15 },
    ];

    // 6) Add rows
    users.forEach((user) => {
      worksheet.addRow({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
          ? user.createdAt.toISOString().split("T")[0]
          : "",
        taskCount: userTaskMap[user._id].taskCount,
        pendingTasks: userTaskMap[user._id].pendingTasks,
        completedTasks: userTaskMap[user._id].completedTasks,
        inProgressTasks: userTaskMap[user._id].inProgressTasks,
        overdueTasks: userTaskMap[user._id].overdueTasks,
      });
    });

    // 7) Send Excel file
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=users_report.xlsx"
    );

    return workbook.xlsx
      .write(res)
      .then(() => res.status(200).end())
      .catch((error) => {
        console.error("Error writing Excel file:", error);
        res.status(500).json({ message: "Error generating report" });
      });
  } catch (error) {
    console.error("Error generating users report:", error);
    res
      .status(500)
      .json({ message: "Error generating report", error: error.message });
  }
};


module.exports = {
  exportTasksReport,
  exportUsersReport,
};
