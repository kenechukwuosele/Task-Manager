const Task = require("../models/task.model");

const ALLOWED = ["pending", "in-progress", "completed"];

const getTasks = async (req, res) => {
  try {
    // 1) Build query filter
    const { status } = req.query;
    const roleFilter =
      req.user.role === "admin" ? {} : { assignedTo: req.user._id };
    const statusFilter =
      status && ALLOWED.includes(status)
        ? { status }
        : { status: { $in: ALLOWED } };
    const queryFilter = { ...roleFilter, ...statusFilter };

    // 2) Query tasks (lean for plain objects, populate refs)
    //Hits MongoDB with the built filter. Returns an array of documents.
    let tasks = await Task.find(queryFilter)
      .populate("assignedTo", "name email profileImageUrl")
      .populate("createdBy", "name email")
      .lean(); // 🔥 returns plain JS objects

    // 3) Add completed checklist count
    tasks = tasks.map((t) => {
      const completedCount = (t.todoChecklist || []).filter(
        (i) => i.completed
      ).length;
      return { ...t, completedCount };
    });

    // 4) Summary counts in parallel
    const [allTasks, pendingTasks, inProgressTasks, completedTasks] =
      await Promise.all([
        Task.countDocuments(roleFilter),
        Task.countDocuments({ ...roleFilter, status: "pending" }),
        Task.countDocuments({ ...roleFilter, status: "in-progress" }),
        Task.countDocuments({ ...roleFilter, status: "completed" }),
      ]);

    // 5) Response (rename if your frontend expects old names)
    res.json({
      tasks,
      allTasks,
      pendingTasks, // or pendingTasks
      inProgressTasks,
      completedTasks, // or completedTasks
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching tasks", error: error.message });
  }
};

const getTasksById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email profileImageUrl")
      .populate("createdBy", "name email");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const completedCount = (task.todoChecklist || []).filter(
      (i) => i.completed
    ).length;
    res.json({ ...task.toObject(), completedCount });
  } catch (error) {}
};

const createTask = async (req, res) => {
  try {
    let {
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      attachments,
      todoChecklist,
    } = req.body;

    // Validate todoChecklist
    if (!Array.isArray(todoChecklist)) {
      return res.status(400).json({ message: "Invalid checklist format" });
    }

    // Normalize and validate priority
    if (priority) {
      priority = priority.toLowerCase();
      if (!["low", "medium", "high"].includes(priority)) {
        return res.status(400).json({ message: "Invalid priority value" });
      }
    }

    const newTask = await Task.create({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      createdBy: req.user._id,
      todoChecklist,
      attachments,
    });

    return res
      .status(201)
      .json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating task", error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const user = req.user; // assume middleware sets req.user

    // 🔍 1. Find the task
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // 🔒 2. Permission check
    if (user.role !== "admin" && String(task.createdBy) !== String(user._id)) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this task" });
    }

    // 🔍 3. Validate todoChecklist if provided
    if (updates.todoChecklist && !Array.isArray(updates.todoChecklist)) {
      return res.status(400).json({ message: "Invalid checklist format" });
    }

    // Allowed status values from schema
    const allowedStatuses = ["pending", "in-progress", "completed"];

    if (updates.status === "todo") {
      updates.status = "pending";
    }

    // 🔄 4. Update allowed fields
    task.title = updates.title ?? task.title;
    task.description = updates.description ?? task.description;
    task.priority = updates.priority ?? task.priority;
    task.attachments = updates.attachments ?? task.attachments;
    task.todoChecklist = updates.todoChecklist ?? task.todoChecklist;

    if (updates.status) {
      if (!allowedStatuses.includes(updates.status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      task.status = updates.status;
    }

    // 🔒 5. Handle assignment rules
    if (updates.assignedTo) {
      if (user.role === "admin") {
        task.assignedTo = updates.assignedTo;
        task.dueDate = updates.dueDate; // ✅ Admin can reassign
      } else {
        return res.status(403).json({
          message: "Only admins can reassign tasks and set Due dates",
        });
      }
    }

    // 🔄 6. Auto-update progress from checklist if provided
    if (updates.todoChecklist) {
      const completed = updates.todoChecklist.filter((i) => i.completed).length;
      const total = updates.todoChecklist.length;
      task.progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    } else {
      task.progress = updates.progress ?? task.progress;
    }

    // 💾 7. Save and return
    await task.save();
    res.json({ message: "Task updated successfully", task });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating task", error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user; // assume middleware sets req.user

    // 🔍 1. Find the task
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Only allow if user is admin OR the creator of the task
    if (user.role !== "admin" && String(task.createdBy) !== String(user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Task.deleteOne({ _id: id });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting task", error: error.message });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!ALLOWED.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Find the task
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Permission check:
    // Admins can update any task, users can only update their own
    if (
      req.user.role !== "admin" &&
      String(task.assignedTo) !== String(req.user._id) &&
      String(task.createdBy) !== String(req.user._id)
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this task" });
    }

    // Update status
    task.status = status;
    await task.save();

    res.json({ message: "Task status updated successfully", task });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating task status", error: error.message });
  }
};

const updateTaskCheckList = async (req, res) => {
  try {
    const { id } = req.params;
    const { todoChecklist } = req.body;

    // Validate checklist format
    if (!Array.isArray(todoChecklist)) {
      return res.status(400).json({ message: "Invalid checklist format" });
    }

    // Find the task
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Permission check:
    // Admins can update any task, users can only update their own
    if (
      req.user.role !== "admin" &&
      String(task.assignedTo) !== String(req.user._id)
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this task" });
    }
    // Update checklist
    task.todoChecklist = todoChecklist;
    // Recalculate progress
    const completedCount = todoChecklist.filter((i) => i.completed).length;
    const totalCount = todoChecklist.length;
    task.progress =
      totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    if (task.progress === 100) {
      task.status = "completed";
    } else if (task.progress > 0) {
      task.status = "in-progress";
    } else {
      task.status = "pending";
    }
    await task.save();

    const updatedTask = await Task.findById(id).populate(
      "assignedTo",
      "name email profileImageUrl"
    );

    res.json({
      message: "Task checklist updated successfully",
      task: updatedTask,
    });
  } catch (error) {}
};

const getDashboardData = async (req, res) => {
  try {
    const user = req.user; // assume middleware sets req.user

    if(user.role === "user") {
      return res.status(403).json({ message: "Access denied" });  

    }
    // Count total tasks
    const totalTasks = await Task.countDocuments();

    // Count tasks by status
    const pendingTasks = await Task.countDocuments({ status: "pending" });
    const completedTasks = await Task.countDocuments({ status: "completed" });

    // Count overdue tasks
    // $ne = "not equal", $lt = "less than"
    // Find tasks not completed and due date < now
    const overdueTasks = await Task.countDocuments({
      status: { $ne: "completed" }, // Not equal to "completed"
      dueDate: { $lt: new Date() }, // Due date before current date
    });

    // Define allowed statuses
    const allowedStatuses = ["pending", "in-progress", "completed"];

    // Aggregate task distribution by status
    // $group = MongoDB aggregation operator to group documents by a field
    // _id will be the group key (status), count sums documents per group
    const taskDistributionRaw = await Task.aggregate([
      {
        $group: {
          _id: "$status", // Group by status field
          count: { $sum: 1 }, // Count tasks in each group
        },
      },
    ]);

    // Format the task distribution
    // Using reduce to build an object with all statuses
    const taskDistribution = allowedStatuses.reduce((acc, status) => {
      // 🔹 Format the key for consistency
      // Replace spaces with "-" and convert to lowercase
      // Regex: /\s+/g => match one or more spaces globally
      const formattedKey = status.replace(/\s+/g, "-").toLowerCase();

      // 🔹 acc = accumulator object
      // This is the "container" that collects results in reduce
      // We find the count for this status in the raw aggregation
      // ?.count = optional chaining, avoids error if find returns undefined
      // || 0 = default to 0 if status not found
      acc[formattedKey] =
        taskDistributionRaw.find((item) => item._id === status)?.count || 0;

      // 🔹 Return acc so reduce continues to next status
      return acc;
    }, {}); // Start with empty object {}

    //  Add total tasks as "all" key
    taskDistribution["all"] = totalTasks;

    // Aggregate task distribution by priority
    const allowedPriorities = ["low", "medium", "high"];
    const priorityDistributionRaw = await Task.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);

    const priorityDistribution = allowedPriorities.reduce((acc, priority) => {
      // Same trick as status distribution
      acc[priority] =
        priorityDistributionRaw.find((item) => item._id === priority)?.count ||
        0;
      return acc;
    }, {});

    // Fetch 10 most recent tasks
    const recentTasks = await Task.find({})
      .sort({ createdAt: -1 }) // Newest first
      .limit(10)
      .select("title status priority dueDate assignedTo createdBy createdAt"); // Select only needed fields

    //  Send response
    res.status(200).json({
      statistics: {
        totalTasks,
        pendingTasks,
        completedTasks,
        overdueTasks,
        taskDistribution,
        priorityDistribution,
      },
      charts: {
        taskDistribution,
        priorityDistribution,
      },
      recentTasks,
    });
  } catch (error) {
    res.status(500).json({ "server not found": error.message });
  }
};

const getUserDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    // Count total tasks assigned to the user
    const totalTasks = await Task.countDocuments({ assignedTo: userId });

    // Count tasks by status for the user
    const pendingTasks = await Task.countDocuments({
      assignedTo: userId,
      status: "pending",
    });
    const inProgressTasks = await Task.countDocuments({
      assignedTo: userId,
      status: "in-progress",
    });
    const completedTasks = await Task.countDocuments({
      assignedTo: userId,
      status: "completed",
    });
    const overdueTasks = await Task.countDocuments({
      assignedTo: userId,
      status: { $ne: "completed" }, // Not completed
      dueDate: { $lt: new Date() }, // Due date before now
    });

    const allowedStatuses = ["pending", "in-progress", "completed"];
    // Aggregate task distribution by status for the user
    const taskDistributionRaw = await Task.aggregate([
      {
        $match: { assignedTo: userId }, // Filter by assignedTo
      },
      {
        $group: {
          _id: "$status", // Group by status field
          count: { $sum: 1 }, // Count tasks in each group
        },
      },
    ]);
    // Format the task distribution
    const taskDistribution = allowedStatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, "-").toLowerCase();
      acc[formattedKey] =
        taskDistributionRaw.find((item) => item._id === status)?.count || 0;
      return acc;
    }, {}); // Start with empty object {}

    // Add total tasks as "all" key
    taskDistribution["all"] = totalTasks;

    // Fetch 10 most recent tasks for the user
    const recentTasks = await Task.find({ assignedTo: userId })
      .sort({ createdAt: -1 }) // Newest first
      .limit(10)
      .select("title status priority dueDate createdAt"); // Select only needed fields

    res.status(200).json({
      statistics: {
        totalTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
        overdueTasks,
        recentTasksCount: recentTasks.length,
      },
      recentTasks,
    });
  } catch (error) {}
};

module.exports = {
  getTasks,
  getTasksById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskCheckList,
  getDashboardData,
  getUserDashboardData,
};
