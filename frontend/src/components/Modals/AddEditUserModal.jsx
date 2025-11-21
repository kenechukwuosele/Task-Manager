import React, { useState, useEffect } from "react";
import Modal from "../Modal";
import Input from "../Inputs/Input";
import SelectDropdown from "../Inputs/SelectDropdown";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-toastify";

const AddEditUserModal = ({
  isOpen,
  onClose,
  type = "add",
  userData = null,
  onUserSaved,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && type === "edit" && userData) {
      setName(userData.name || "");
      setEmail(userData.email || "");
      setRole(userData.role || "user");
      setPassword(""); // Don't populate password on edit
    } else {
      // Reset form for add mode
      setName("");
      setEmail("");
      setRole("user");
      setPassword("");
    }
    setError(null);
  }, [isOpen, type, userData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (type === "add" && !password) {
      setError("Password is required for new users");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name,
        email,
        role,
      };

      if (password) {
        payload.password = password;
      }

      if (type === "add") {
        await axiosInstance.post(API_PATHS.USERS.CREATE_USER, payload);
        toast.success("User created successfully");
      } else {
        await axiosInstance.put(
          API_PATHS.USERS.UPDATE_USER(userData._id),
          payload
        );
        toast.success("User updated successfully");
      }

      if (onUserSaved) onUserSaved();
      onClose();
    } catch (err) {
      console.error("Error saving user:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to save user";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={type === "add" ? "Add New User" : "Edit User"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <Input
          label="Full Name"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          label="Email Address"
          placeholder="john@example.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <SelectDropdown
          label="Role"
          options={[
            { value: "user", label: "User" },
            { value: "admin", label: "Admin" },
          ]}
          value={role}
          onChange={(value) => setRole(value)}
        />

        <Input
          label={type === "add" ? "Password" : "New Password (Optional)"}
          placeholder={
            type === "add" ? "Enter password" : "Leave blank to keep current"
          }
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-all shadow-lg shadow-primary/25 font-medium disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading
              ? "Saving..."
              : type === "add"
              ? "Create User"
              : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddEditUserModal;
