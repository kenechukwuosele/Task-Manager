import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login.jsx";
import SignUp from "../pages/auth/SignUp.jsx";
import Unauthorized from "../pages/unauthorized.jsx";
import Dashboard from "../pages/Admin/Dashboard";
import CreateTask from "../pages/Admin/CreateTask.jsx";
import ManageTasks from "../pages/Admin/ManageTasks";
import ManageUsers from "../pages/Admin/ManageUsers";
import Reports from "../pages/Admin/Reports";
import UserDashboard from "../pages/User/UserDashboard";
import MyTasks from "../pages/User/MyTasks";
import ViewTaskDetails from "../pages/User/ViewTaskDetails";
import ProfileSettings from "../pages/ProfileSettings";
import PrivateRoute from "../routes/PrivateRoute";
import { Toaster } from "react-hot-toast";

const AppRoutes = () => {
  console.log("AppRoutes loaded"); 
  return (
    <div>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Unauthorized Page */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Admin Routes */}
        <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/create-task" element={<CreateTask />} />
          <Route path="/admin/manage-tasks" element={<ManageTasks />} />
          <Route path="/admin/manage-users" element={<ManageUsers />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/profile-settings" element={<ProfileSettings />} />
        </Route>

        {/* User Routes */}
        <Route element={<PrivateRoute allowedRoles={["user"]} />}>
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/my-tasks" element={<MyTasks />} />
          <Route path="/user/view-task-details/:id" element={<ViewTaskDetails />} />
          <Route path="/user/profile-settings" element={<ProfileSettings />} />
        </Route>

        {/* Catch-all → redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      </div>
      


  );
};

export default AppRoutes;
