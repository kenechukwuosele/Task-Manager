import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-toastify";
import Modal from "../Modal";
import AvatarGroup from "../AvatarGroup";
import UserAvatar from "../UserAvatar";

const SelectUsers = ({ selectedUsers, setSelectedUsers }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedUsers, setTempSelectedUsers] = useState([]);
  const [fetchError, setFetchError] = useState(false); // New: Track fetch error

  // Fetch all users once
  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      if (Array.isArray(response.data)) {
        setAllUsers(response.data);
      } else {
        setAllUsers([]); // Ensure array if response is unexpected
        toast.error("Unexpected response format from users API");
      }
    } catch (error) {
      setFetchError(true);
      toast.error("Error fetching users");
      console.error("Error fetching users", error);
    }
  };

  const toggleUserSelection = (userId) => {
    setTempSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAssign = () => {
    setSelectedUsers(tempSelectedUsers);
    setIsModalOpen(false);
  };

  const selectedUsersObjects = allUsers.filter((user) =>
    selectedUsers.includes(user._id)
  ); // Changed: Pass full users, not just URLs

  // Fetch users on mount
  useEffect(() => {
    getAllUsers();
  }, []);

  // Sync modal selections with current assigned users when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setTempSelectedUsers(selectedUsers);
    }
  }, [isModalOpen, selectedUsers]);

  return (
    <div className="space-y-4 mt-2">
      {/* Fallback message if fetch failed and trying to show avatars */}
      {fetchError && selectedUsers.length > 0 && (
        <p className="text-red-500">Unable to load user avatars due to fetch error.</p>
      )}

      {/* Button if no users assigned */}
      {selectedUsers.length === 0 && (
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={() => setIsModalOpen(true)}
        >
          Assign Users
        </button>
      )}

      {/* Avatars if users are assigned */}
      {selectedUsersObjects.length > 0 && (
        <div className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
          <AvatarGroup users={selectedUsersObjects} maxVisible={3} /> {/* Changed: Pass users */}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Select Users"
      >
        <div className="space-y-4 h-[60vh] overflow-y-auto">
          {allUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-4 border-b border-gray-200 py-2"
            >
              <UserAvatar user={user} size={40} />
              <div className="flex-1">
                <p className="font-medium text-gray-800 dark:text-white">
                  {user.name}
                </p>
                <p className="text-[13px] text-gray-500">{user.email}</p>
              </div>

              <input
                type="checkbox"
                checked={tempSelectedUsers.includes(user._id)}
                onChange={() => toggleUserSelection(user._id)}
                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm outline-none cursor-pointer"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            className="card-btn"
            onClick={() => setIsModalOpen(false)}
          >
            CANCEL
          </button>
          <button
            className="card-btn-fill"
            onClick={handleAssign}
          >
            DONE
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SelectUsers;