import React, { useState, useEffect } from "react";
import Modal from "../Modal";
import Input from "../Inputs/Input";
import { LuFileText, LuCalendar, LuFlag, LuUser } from "react-icons/lu";
import MotionButton from "../MotionButton";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import TodoListInput from "../Inputs/TodoListInput";
import AddAttachmentsInput from "../Inputs/AddAttachmentsInput";
import SelectDropdown from "../Inputs/SelectDropdown";

const AddEditTaskModal = ({ isOpen, onClose, type, taskData, onTaskSaved }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    assignedTo: "",
    todoList: [],
    attachments: [],
  });
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  // Fetch users for assignment
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
        const userOptions = response.data.map((user) => ({
          value: user._id,
          label: user.name,
        }));
        setUsers(userOptions);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (type === "edit" && taskData) {
        setFormData({
          title: taskData.title || "",
          description: taskData.description || "",
          priority: taskData.priority || "medium",
          dueDate: taskData.dueDate ? taskData.dueDate.split("T")[0] : "",
          assignedTo: taskData.assignedTo?._id || taskData.assignedTo || "",
          todoList: taskData.todoList || [],
          attachments: taskData.attachments || [],
        });
      } else {
        // Reset for add
        setFormData({
          title: "",
          description: "",
          priority: "medium",
          dueDate: "",
          assignedTo: "",
          todoList: [],
          attachments: [],
        });
      }
    }
  }, [isOpen, type, taskData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDropdownChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!formData.assignedTo) {
      toast.error("Please assign the task to a user");
      return;
    }

    setLoading(true);

    try {
      if (type === "add") {
        await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, formData);
        toast.success("Task created successfully");
      } else {
        await axiosInstance.put(
          API_PATHS.TASKS.UPDATE_TASK(taskData._id),
          formData
        );
        toast.success("Task updated successfully");
      }
      onTaskSaved();
      onClose();
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error(error.response?.data?.message || "Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={type === "add" ? "Create New Task" : "Edit Task"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            <LuFileText className="inline mr-2" size={16} />
            Task Title
          </label>
          <Input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter task description"
            className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all min-h-[100px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              <LuFlag className="inline mr-2" size={16} />
              Priority
            </label>
            <SelectDropdown
              options={priorityOptions}
              value={formData.priority}
              onChange={(val) => handleDropdownChange("priority", val)}
              placeholder="Select Priority"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              <LuCalendar className="inline mr-2" size={16} />
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            <LuUser className="inline mr-2" size={16} />
            Assign To
          </label>
          <SelectDropdown
            options={users}
            value={formData.assignedTo}
            onChange={(val) => handleDropdownChange("assignedTo", val)}
            placeholder="Select User"
          />
        </div>

        <div className="space-y-4">
          <TodoListInput
            todoList={formData.todoList}
            setTodoList={(list) =>
              setFormData((prev) => ({ ...prev, todoList: list }))
            }
          />
          <AddAttachmentsInput
            attachments={formData.attachments}
            setAttachments={(list) =>
              setFormData((prev) => ({ ...prev, attachments: list }))
            }
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <MotionButton
            type="button"
            className="btn-secondary"
            onClick={onClose}
          >
            Cancel
          </MotionButton>
          <MotionButton
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : type === "add"
              ? "Create Task"
              : "Update Task"}
          </MotionButton>
        </div>
      </form>
    </Modal>
  );
};

export default AddEditTaskModal;
