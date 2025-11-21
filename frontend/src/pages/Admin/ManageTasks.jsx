import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import TaskListTable from "../../components/TaskListTable";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-toastify";
import { LuPlus, LuFilter, LuSearch, LuPencil, LuTrash2 } from "react-icons/lu";
import AddEditTaskModal from "../../components/Modals/AddEditTaskModal";

const ManageTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const [openAddEditModal, setOpenAddEditModal] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [selectedTask, setSelectedTask] = useState(null);

  // Fetch tasks from API
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS);
      setTasks(response.data.tasks || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      if (error.response?.status === 401) {
        // Token expired or invalid, redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return;
      }
      toast.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Handle task status update
  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK_STATUS(taskId), {
        status: newStatus,
      });
      toast.success("Task status updated successfully");
      fetchTasks(); // Refresh the list
    } catch (error) {
      console.error("Error updating task status:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return;
      }
      toast.error("Failed to update task status");
    }
  };

  // Handle task delete
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));
      toast.success("Task deleted successfully");
      fetchTasks(); // Refresh the list
    } catch (error) {
      console.error("Error deleting task:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return;
      }
      toast.error("Failed to delete task");
    }
  };

  const handleAddTask = () => {
    setModalType("add");
    setSelectedTask(null);
    setOpenAddEditModal(true);
  };

  const handleEditTask = (task) => {
    setModalType("edit");
    setSelectedTask(task);
    setOpenAddEditModal(true);
  };

  return (
    <DashboardLayout>
      <div className="mt-5">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Manage Tasks
          </h1>
          <button
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-primary/25 font-medium"
            onClick={handleAddTask}
          >
            <LuPlus size={18} />
            Create Task
          </button>
        </div>

        {/* Filters and Search */}
        <div className="glass-card p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <LuSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search tasks..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <LuFilter
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                />
                <select
                  className="pl-10 pr-8 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none appearance-none cursor-pointer"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Priority Filter */}
            <div className="flex items-center gap-2">
              <select
                className="px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none cursor-pointer"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="all">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Task Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="glass-card p-5 border-l-4 border-l-primary">
            <h3 className="text-sm font-medium text-slate-500">Total Tasks</h3>
            <p className="text-2xl font-bold text-slate-800 mt-1">
              {tasks.length}
            </p>
          </div>
          <div className="glass-card p-5 border-l-4 border-l-purple-500">
            <h3 className="text-sm font-medium text-slate-500">Pending</h3>
            <p className="text-2xl font-bold text-purple-600 mt-1">
              {tasks.filter((t) => t.status === "pending").length}
            </p>
          </div>
          <div className="glass-card p-5 border-l-4 border-l-cyan-500">
            <h3 className="text-sm font-medium text-slate-500">In Progress</h3>
            <p className="text-2xl font-bold text-cyan-600 mt-1">
              {tasks.filter((t) => t.status === "in-progress").length}
            </p>
          </div>
          <div className="glass-card p-5 border-l-4 border-l-green-500">
            <h3 className="text-sm font-medium text-slate-500">Completed</h3>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {tasks.filter((t) => t.status === "completed").length}
            </p>
          </div>
        </div>

        {/* Tasks Table */}
        <div className="glass-card p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
              <p className="text-slate-500 mt-3 font-medium">
                Loading tasks...
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="py-4 px-4 text-left text-slate-700 font-semibold text-sm">
                      Name
                    </th>
                    <th className="py-4 px-4 text-left text-slate-700 font-semibold text-sm">
                      Status
                    </th>
                    <th className="py-4 px-4 text-left text-slate-700 font-semibold text-sm">
                      Priority
                    </th>
                    <th className="py-4 px-4 text-left text-slate-700 font-semibold text-sm">
                      Created On
                    </th>
                    <th className="py-4 px-4 text-left text-slate-700 font-semibold text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTasks && filteredTasks.length > 0 ? (
                    filteredTasks.map((task, index) => (
                      <tr
                        key={task._id}
                        className="hover:bg-slate-50/80 transition-colors duration-200"
                      >
                        <td className="py-4 px-4 text-slate-700 text-sm font-medium truncate max-w-[200px]">
                          {task.title}
                        </td>
                        <td className="py-4 px-4">
                          <select
                            className="px-3 py-1 text-xs rounded-full border border-slate-200 bg-white focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer font-medium text-slate-600"
                            value={task.status}
                            onChange={(e) =>
                              handleStatusUpdate(task._id, e.target.value)
                            }
                          >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 text-xs rounded-full ${
                              task.priority === "high"
                                ? "bg-red-50 text-red-600 border border-red-100"
                                : task.priority === "medium"
                                ? "bg-orange-50 text-orange-600 border border-orange-100"
                                : "bg-green-50 text-green-600 border border-green-100"
                            } font-medium`}
                          >
                            {task.priority ?? "N/A"}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-500 text-sm whitespace-nowrap">
                          {task.createdAt
                            ? new Date(task.createdAt).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            <button
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              onClick={() => handleEditTask(task)}
                              title="Edit Task"
                            >
                              <LuPencil size={18} />
                            </button>
                            <button
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              onClick={() => handleDeleteTask(task._id)}
                              title="Delete Task"
                            >
                              <LuTrash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-12 text-slate-400 text-sm italic"
                      >
                        No tasks found matching your filters
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <AddEditTaskModal
          isOpen={openAddEditModal}
          onClose={() => setOpenAddEditModal(false)}
          type={modalType}
          taskData={selectedTask}
          onTaskSaved={fetchTasks}
        />
      </div>
    </DashboardLayout>
  );
};

export default ManageTasks;
