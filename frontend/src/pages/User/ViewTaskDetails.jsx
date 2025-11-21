import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-toastify";
import moment from "moment";
import {
  LuArrowLeft,
  LuCheck,
  LuClock,
  LuUser,
  LuCalendar,
  LuFileText,
  LuPaperclip,
} from "react-icons/lu";
import AvatarGroup from "../../components/AvatarGroup";

const ViewTaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingChecklist, setUpdatingChecklist] = useState(false);

  // Fetch task details
  const fetchTaskDetails = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(id)
      );
      setTask(response.data);
    } catch (error) {
      console.error("Error fetching task details:", error);
      toast.error("Failed to fetch task details");
      navigate("/user/my-tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTaskDetails();
    }
  }, [id]);

  // Handle checklist item toggle
  const handleChecklistToggle = async (itemIndex) => {
    if (!task || updatingChecklist) return;

    const updatedChecklist = [...task.todoChecklist];
    updatedChecklist[itemIndex].completed =
      !updatedChecklist[itemIndex].completed;

    setUpdatingChecklist(true);
    try {
      await axiosInstance.put(API_PATHS.TASKS.UPDATE_TODO_CHECKLIST(id), {
        todoChecklist: updatedChecklist,
      });
      setTask({ ...task, todoChecklist: updatedChecklist });
      toast.success("Checklist updated successfully");
    } catch (error) {
      console.error("Error updating checklist:", error);
      toast.error("Failed to update checklist");
    } finally {
      setUpdatingChecklist(false);
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-600 border-green-200";
      case "in-progress":
        return "bg-cyan-100 text-cyan-600 border-cyan-200";
      case "pending":
        return "bg-purple-100 text-purple-600 border-purple-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-600 border-red-200";
      case "medium":
        return "bg-orange-100 text-orange-600 border-orange-200";
      case "low":
        return "bg-green-100 text-green-600 border-green-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!task) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <p className="text-gray-500">Task not found</p>
        </div>
      </DashboardLayout>
    );
  }

  const completedCount =
    task.todoChecklist?.filter((item) => item.completed).length || 0;
  const totalCount = task.todoChecklist?.length || 0;
  const progress =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <DashboardLayout>
      <div className="mt-5">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/user/my-tasks")}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-600"
          >
            <LuArrowLeft size={22} />
          </button>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Task Details
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Task Header */}
            <div className="glass-card p-6 border border-slate-100">
              <div className="flex items-start justify-between mb-5">
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                  {task.title}
                </h2>
                <div className="flex gap-2">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                      task.status
                    )}`}
                  >
                    {task.status}
                  </span>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                </div>
              </div>

              <p className="text-slate-600 mb-6 leading-relaxed">
                {task.description}
              </p>

              {/* Progress Bar */}
              <div className="mb-2">
                <div className="flex justify-between text-sm font-medium text-slate-600 mb-2">
                  <span>Progress</span>
                  <span>
                    {progress}% ({completedCount}/{totalCount})
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Todo Checklist */}
            {task.todoChecklist && task.todoChecklist.length > 0 && (
              <div className="glass-card p-6 border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <LuCheck size={20} className="text-primary" />
                  Todo Checklist
                </h3>
                <div className="space-y-3">
                  {task.todoChecklist.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 group">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => handleChecklistToggle(index)}
                        disabled={updatingChecklist}
                        className="w-5 h-5 text-primary bg-slate-100 border-slate-300 rounded focus:ring-primary focus:ring-offset-0 cursor-pointer transition-all"
                      />
                      <span
                        className={`flex-1 transition-colors ${
                          item.completed
                            ? "line-through text-slate-400"
                            : "text-slate-700 group-hover:text-slate-900"
                        }`}
                      >
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Attachments */}
            {task.attachments && task.attachments.length > 0 && (
              <div className="glass-card p-6 border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <LuPaperclip size={20} className="text-primary" />
                  Attachments
                </h3>
                <div className="space-y-2">
                  {task.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <LuFileText size={18} className="text-slate-500" />
                      <span className="text-sm font-medium text-slate-700">
                        {attachment.name || `Attachment ${index + 1}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Task Info */}
            <div className="glass-card p-6 border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-5">
                Task Information
              </h3>
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                    <LuCalendar size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                      Due Date
                    </p>
                    <p className="text-sm font-semibold text-slate-800">
                      {task.dueDate
                        ? moment(task.dueDate).format("MMM Do YYYY")
                        : "No due date"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                    <LuClock size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                      Created
                    </p>
                    <p className="text-sm font-semibold text-slate-800">
                      {moment(task.createdAt).format("MMM Do YYYY")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                    <LuUser size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                      Created By
                    </p>
                    <p className="text-sm font-semibold text-slate-800">
                      {task.createdBy?.name || "Unknown"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Assigned Users */}
            {task.assignedTo && task.assignedTo.length > 0 && (
              <div className="glass-card p-6 border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4">
                  Assigned To
                </h3>
                <AvatarGroup users={task.assignedTo} />
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ViewTaskDetails;
