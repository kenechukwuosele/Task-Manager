import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import TaskListTable from "../../components/TaskListTable";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-toastify";
import { LuFilter, LuSearch, LuEye } from "react-icons/lu";

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch user's tasks from API
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS);
      setTasks(response.data.tasks || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Filter tasks based on search and status
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    return matchesSearch && matchesStatus;
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
      toast.error("Failed to update task status");
    }
  };

  return (
    <DashboardLayout>
      <div className="mt-5">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            My Tasks
          </h1>
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
                placeholder="Search my tasks..."
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
                      Task Name
                    </th>
                    <th className="py-4 px-4 text-left text-slate-700 font-semibold text-sm">
                      Status
                    </th>
                    <th className="py-4 px-4 text-left text-slate-700 font-semibold text-sm">
                      Priority
                    </th>
                    <th className="py-4 px-4 text-left text-slate-700 font-semibold text-sm">
                      Due Date
                    </th>
                    <th className="py-4 px-4 text-left text-slate-700 font-semibold text-sm">
                      Progress
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
                          {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="py-4 px-4">
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-500"
                              style={{ width: `${task.progress || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-slate-500 mt-1 font-medium">
                            {task.progress || 0}%
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <button
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            onClick={() =>
                              (window.location.href = `/user/view-task-details/${task._id}`)
                            }
                            title="View Details"
                          >
                            <LuEye size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
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
      </div>
    </DashboardLayout>
  );
};

export default MyTasks;
