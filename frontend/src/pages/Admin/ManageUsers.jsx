import React, { useState, useEffect, useMemo, useCallback } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-toastify";
import {
  LuPlus,
  LuSearch,
  LuPencil,
  LuTrash2,
  LuMail,
  LuShield,
  LuUser,
} from "react-icons/lu";
import UserAvatar from "../../components/UserAvatar";
import AddEditUserModal from "../../components/Modals/AddEditUserModal";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [openAddEditModal, setOpenAddEditModal] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch users from API
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      setUsers(response.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      if (error.response?.status === 401) {
        // Token expired or invalid, redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return;
      }
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Memoized filtered users
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;

    const query = searchQuery.toLowerCase();
    return users.filter(
      (user) =>
        (user.name && user.name.toLowerCase().includes(query)) ||
        (user.email && user.email.toLowerCase().includes(query))
    );
  }, [users, searchQuery]);

  // Memoized statistics
  const userStats = useMemo(() => {
    const total = users.length;
    const admins = users.filter((u) => u.role === "admin").length;
    const regularUsers = users.filter((u) => u.role === "user").length;
    const activeUsers = users.filter((u) => u.isActive !== false).length;

    return { total, admins, regularUsers, activeUsers };
  }, [users]);

  // Handle user delete
  const handleDeleteUser = async (userId, userName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete user "${userName}"? This action cannot be undone.`
      )
    )
      return;

    try {
      await axiosInstance.delete(API_PATHS.USERS.DELETE_USER(userId));
      toast.success("User deleted successfully");
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error("Error deleting user:", error);
      if (error.response?.status === 401) {
        // Token expired or invalid, redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return;
      }
      toast.error("Failed to delete user");
    }
  };

  const handleAddUser = () => {
    setModalType("add");
    setSelectedUser(null);
    setOpenAddEditModal(true);
  };

  const handleEditUser = (user) => {
    setModalType("edit");
    setSelectedUser(user);
    setOpenAddEditModal(true);
  };

  // Get role badge color
  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-50 text-red-600 border-red-100";
      case "user":
        return "bg-blue-50 text-blue-600 border-blue-100";
      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  return (
    <DashboardLayout>
      <div className="mt-5">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Manage Users
          </h1>
          <button
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-primary/25 font-medium"
            onClick={handleAddUser}
          >
            <LuPlus size={18} />
            Add User
          </button>
        </div>

        {/* Search */}
        <div className="glass-card p-4 mb-6">
          <div className="relative">
            <LuSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search users by name or email..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* User Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="glass-card p-5 border-l-4 border-l-primary">
            <h3 className="text-sm font-medium text-slate-500">Total Users</h3>
            <p className="text-2xl font-bold text-slate-800 mt-1">
              {userStats.total}
            </p>
          </div>
          <div className="glass-card p-5 border-l-4 border-l-red-500">
            <h3 className="text-sm font-medium text-slate-500">Admins</h3>
            <p className="text-2xl font-bold text-red-600 mt-1">
              {userStats.admins}
            </p>
          </div>
          <div className="glass-card p-5 border-l-4 border-l-blue-500">
            <h3 className="text-sm font-medium text-slate-500">
              Regular Users
            </h3>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {userStats.regularUsers}
            </p>
          </div>
          <div className="glass-card p-5 border-l-4 border-l-green-500">
            <h3 className="text-sm font-medium text-slate-500">Active Users</h3>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {userStats.activeUsers}
            </p>
          </div>
        </div>

        {/* Users Table */}
        <div className="glass-card p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
              <p className="text-slate-500 mt-3 font-medium">
                Loading users...
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="py-4 px-4 text-left text-slate-700 font-semibold text-sm">
                      User
                    </th>
                    <th className="py-4 px-4 text-left text-slate-700 font-semibold text-sm">
                      Role
                    </th>
                    <th className="py-4 px-4 text-left text-slate-700 font-semibold text-sm">
                      Tasks
                    </th>
                    <th className="py-4 px-4 text-left text-slate-700 font-semibold text-sm">
                      Status
                    </th>
                    <th className="py-4 px-4 text-left text-slate-700 font-semibold text-sm">
                      Joined
                    </th>
                    <th className="py-4 px-4 text-left text-slate-700 font-semibold text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers && filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                      <tr
                        key={user._id}
                        className="hover:bg-slate-50/80 transition-colors duration-200"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <UserAvatar user={user} size="sm" />
                            <div>
                              <p className="text-sm font-medium text-slate-800">
                                {user.name}
                              </p>
                              <p className="text-xs text-slate-500 flex items-center gap-1">
                                <LuMail size={12} />
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 text-xs rounded-full border font-medium ${getRoleColor(
                              user.role
                            )}`}
                          >
                            {user.role === "admin" && (
                              <LuShield size={12} className="inline mr-1" />
                            )}
                            {user.role === "user" && (
                              <LuUser size={12} className="inline mr-1" />
                            )}
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm font-medium">
                            <div className="flex gap-3">
                              <span className="text-purple-600 bg-purple-50 px-2 py-0.5 rounded text-xs">
                                P: {user.pendingTasks || 0}
                              </span>
                              <span className="text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded text-xs">
                                IP: {user.inProgressTasks || 0}
                              </span>
                              <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs">
                                C: {user.completedTasks || 0}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-2 py-1 text-xs rounded-full border ${
                              user.isActive !== false
                                ? "bg-green-50 text-green-600 border-green-100"
                                : "bg-red-50 text-red-600 border-red-100"
                            } font-medium`}
                          >
                            {user.isActive !== false ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-500 text-sm whitespace-nowrap">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            <button
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              onClick={() => handleEditUser(user)}
                              title="Edit User"
                            >
                              <LuPencil size={16} />
                            </button>
                            <button
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              onClick={() =>
                                handleDeleteUser(user._id, user.name)
                              }
                              title="Delete User"
                            >
                              <LuTrash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-12 text-slate-400 text-sm italic"
                      >
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <AddEditUserModal
        isOpen={openAddEditModal}
        onClose={() => setOpenAddEditModal(false)}
        type={modalType}
        userData={selectedUser}
        onUserSaved={fetchUsers}
      />
    </DashboardLayout>
  );
};

export default ManageUsers;
