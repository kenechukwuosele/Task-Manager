import React, { useState, useContext, useEffect } from "react";
import DashboardLayout from "../components/Layouts/DashboardLayout";
import Input from "../components/Inputs/Input";
import ProfilePhotoSelector from "../components/Inputs/ProfilePhotoSelector";
import MotionButton from "../components/MotionButton";
import { UserContext } from "../context/userContext";
import { API_PATHS } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosinstance";
import { toast } from "react-toastify";
import { LuUser, LuMail, LuCamera } from "react-icons/lu";

const ProfileSettings = () => {
  const { user, updateUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profilePic: null,
  });

  // Initialize form data with current user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        profilePic: null,
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfilePicChange = (file) => {
    setFormData((prev) => ({
      ...prev,
      profilePic: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    setLoading(true);

    try {
      const updateData = new FormData();
      updateData.append("name", formData.name);
      updateData.append("email", formData.email);
      if (formData.profilePic) {
        updateData.append("profilePic", formData.profilePic);
      }

      const response = await axiosInstance.put(
        API_PATHS.AUTH.UPDATE_PROFILE,
        updateData,
        { withCredentials: true }
      );

      // Update user context with new data
      updateUser(response.data);

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-500">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto mt-5">
        <div className="card">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              Profile Settings
            </h1>
            <p className="text-slate-500">
              Update your personal information and profile picture
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <ProfilePhotoSelector
                  image={formData.profilePic}
                  setImage={handleProfilePicChange}
                  currentImage={user?.profilePic}
                />
                <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-full shadow-lg">
                  <LuCamera size={16} />
                </div>
              </div>
              <p className="text-sm text-slate-500 text-center">
                Click on the image to change your profile picture
              </p>
            </div>

            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <LuUser className="inline mr-2" size={16} />
                Full Name
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <LuMail className="inline mr-2" size={16} />
                Email Address
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                required
              />
            </div>

            {/* Role Display (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Role
              </label>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-3 py-1 text-xs rounded-full font-medium ${
                    user.role === "admin"
                      ? "bg-red-50 text-red-600 border border-red-100"
                      : "bg-indigo-50 text-indigo-600 border border-indigo-100"
                  }`}
                >
                  {user.role === "admin" ? "Administrator" : "User"}
                </span>
                <span className="text-sm text-slate-400">
                  Role cannot be changed
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-4">
              <MotionButton
                type="button"
                className="btn-secondary"
                onClick={() => window.history.back()}
              >
                Cancel
              </MotionButton>
              <MotionButton
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? "Updating..." : "Update Profile"}
              </MotionButton>
            </div>
          </form>
        </div>

        {/* Additional Info */}
        <div className="mt-6 bg-indigo-50 p-4 rounded-lg border border-indigo-100">
          <h3 className="text-sm font-medium text-indigo-800 mb-2">
            Profile Information
          </h3>
          <ul className="text-sm text-indigo-600 space-y-1">
            <li>• Your profile picture will be visible to other users</li>
            <li>• Changes will take effect immediately after saving</li>
            <li>• Email changes may require re-verification in some cases</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfileSettings;
