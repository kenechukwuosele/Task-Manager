import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { PRIORITY_DATA } from "../../utils/data";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { LuTrash2 } from "react-icons/lu";
import SelectDropdown from "../../components/Inputs/SelectDropdown";
import SelectUsers from "../../components/Inputs/SelectUsers";
import TodoListInput from "../../components/Inputs/TodoListInput";
import AddAttachmentsInput from "../../components/Inputs/AddAttachmentsInput";
import { toast } from "react-toastify";

// ✅ Default state defined once
const defaultTask = {
  title: "",
  description: "",
  priority: "Low",
  dueDate: null,
  assignedTo: [],
  todoChecklist: [],
  attachments: [],
};

const CreateTask = () => {
  const location = useLocation();
  const { taskId } = location.state || {};
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState(defaultTask);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  // Fetch task data for editing
  useEffect(() => {
    if (taskId) {
      const fetchTask = async () => {
        try {
          const response = await axiosInstance.get(
            API_PATHS.TASKS.GET_TASK_BY_ID(taskId)
          );
          const task = response.data;
          setTaskData({
            title: task.title,
            description: task.description,
            priority: task.priority,
            dueDate: task.dueDate,
            assignedTo: task.assignedTo.map((user) => user._id),
            todoChecklist: task.todoChecklist,
            attachments: task.attachments,
          });
        } catch (err) {
          console.error("Error fetching task: ", err);
          toast.error("Failed to load task data.");
        }
      };
      fetchTask();
    }
  }, [taskId]);

  const handleValueChange = (key, value) => {
    setTaskData((prevData) => ({ ...prevData, [key]: value }));
  };

  // ✅ Consistent todoList mapping
  const formatTodoChecklist = (list) =>
    list?.map((item) => ({
      text: typeof item === "string" ? item : item.text,
      completed: item.completed || false,
    }));

  const updateTask = async () => {
    setLoading(true);
    try {
      await axiosInstance.put(`${API_PATHS.TASKS.UPDATE_TASK}/${taskId}`, {
        ...taskData,
        dueDate: taskData.dueDate
          ? new Date(taskData.dueDate).toISOString()
          : null,
        todoChecklist: formatTodoChecklist(taskData.todoChecklist),
      });

      toast.success("Task updated successfully");
      navigate("/tasks");
    } catch (err) {
      console.error("Error updating task: ", err);
      toast.error("Failed to update task. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const createTask = async () => {
    setLoading(true);
    try {
      await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData,
        dueDate: taskData.dueDate
          ? new Date(taskData.dueDate).toISOString()
          : null,
        todoChecklist: formatTodoChecklist(taskData.todoChecklist),
      });

      toast.success("Task created successfully");
      navigate("/tasks"); // redirect after creation
    } catch (err) {
      console.error("Error creating task: ", err);
      toast.error("Failed to create task. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async () => {
    setLoading(true);
    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));
      toast.success("Task deleted successfully");
      navigate("/tasks");
    } catch (err) {
      console.error("Error deleting task: ", err);
      toast.error("Failed to delete task. Try again.");
    } finally {
      setLoading(false);
      setOpenDeleteAlert(false);
    }
  };

  const handleSubmit = () => {
    setError("");

    if (!taskData.title.trim()) return setError("Title is required.");
    if (!taskData.description.trim())
      return setError("Description is required.");
    if (!taskData.dueDate) return setError("Due date is required.");
    if (!taskData.assignedTo?.length)
      return setError("Assign the task to at least one member.");
    if (!taskData.todoChecklist?.length)
      return setError("Add at least one todo item.");

    taskId ? updateTask() : createTask();
  };

  return (
    <DashboardLayout>
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <div className="col-span-3 glass-card p-6 border border-slate-100">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                {taskId ? "Update Task" : "Create Task"}
              </h2>

              {taskId && (
                <button
                  className="flex items-center gap-2 text-red-600 border border-red-200 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300 text-sm font-medium"
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  <LuTrash2 />
                  Delete
                </button>
              )}
            </div>

            {/* Task Title */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Task Title
              </label>
              <input
                type="text"
                placeholder="Create a task title"
                className="w-full border border-slate-200 bg-slate-50 text-slate-800 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
                value={taskData.title}
                onChange={(e) => handleValueChange("title", e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Description
              </label>
              <textarea
                placeholder="Describe the task"
                className="w-full border border-slate-200 bg-slate-50 text-slate-800 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
                rows={4}
                value={taskData.description}
                onChange={(e) =>
                  handleValueChange("description", e.target.value)
                }
              />
            </div>

            {/* Priority, Due Date, Assign To */}
            <div className="grid grid-cols-12 gap-5">
              <div className="col-span-6 md:col-span-4">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Priority
                </label>
                <SelectDropdown
                  options={PRIORITY_DATA}
                  value={taskData.priority}
                  onChange={(value) => handleValueChange("priority", value)}
                  placeholder="Select Priority"
                />
              </div>

              <div className="col-span-6 md:col-span-4">
                <label className="text-sm font-medium text-slate-700 mb-1.5">
                  Due Date
                </label>
                <input
                  type="date"
                  className="w-full border border-slate-200 bg-slate-50 text-slate-800 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
                  value={
                    taskData.dueDate
                      ? moment(taskData.dueDate).format("YYYY-MM-DD")
                      : ""
                  }
                  onChange={(e) => handleValueChange("dueDate", e.target.value)}
                />
              </div>

              <div className="col-span-12 md:col-span-4">
                <label className="text-sm font-medium text-slate-700 mb-1.5">
                  Assign To
                </label>
                <SelectUsers
                  selectedUsers={taskData.assignedTo}
                  setSelectedUsers={(value) =>
                    handleValueChange("assignedTo", value)
                  }
                />
              </div>
            </div>

            {/* Todo Checklist */}
            <div className="mt-6">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                Todo Checklist
              </label>
              <TodoListInput
                todoList={taskData?.todoChecklist}
                setTodoList={(value) =>
                  handleValueChange("todoChecklist", value)
                }
              />
            </div>

            {/* Attachments */}
            <div className="mt-6">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                Attachments
              </label>
              <AddAttachmentsInput
                attachments={taskData?.attachments}
                setAttachments={(value) =>
                  handleValueChange("attachments", value)
                }
              />
            </div>

            {/* Error message */}
            {error && (
              <p className="text-red-500 text-sm mt-3 font-medium">{error}</p>
            )}

            {/* Submit button */}
            <div className="flex justify-end mt-8">
              <button
                className={`btn-primary px-8 py-2.5 rounded-xl font-semibold shadow-lg shadow-primary/25 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
                onClick={handleSubmit}
                type="button"
                disabled={loading}
              >
                {loading ? "Saving..." : taskId ? "Update Task" : "Create Task"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Alert Modal */}
      {openDeleteAlert && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 w-full max-w-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              Delete Task
            </h3>
            <p className="mb-6 text-slate-600">
              Are you sure you want to delete this task? This action cannot be
              undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setOpenDeleteAlert(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition font-medium"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={deleteTask}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium shadow-lg shadow-red-500/20"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CreateTask;
