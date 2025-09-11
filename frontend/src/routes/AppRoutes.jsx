import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login.jsx";
import SignUp from "../pages/auth/SignUp.jsx";
import Unauthorized from "../pages/unauthorized.jsx";
import Dashboard from "../pages/admin/Dashboard";
import CreateTask from "../pages/admin/CreateTask";
import ManageTasks from "../pages/admin/ManageTasks";
import ManageUsers from "../pages/admin/ManageUsers";
import UserDashboard from "../pages/user/UserDashboard";
import MyTasks from "../pages/user/MyTasks";
import ViewTaskDetails from "../pages/user/ViewTaskDetails";
import PrivateRoute from "../routes/PrivateRoute";

const AppRoutes = () => {
  console.log("AppRoutes loaded");
  return (
    
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
        </Route>

        {/* User Routes */}
        <Route element={<PrivateRoute allowedRoles={["user"]} />}>
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/my-tasks" element={<MyTasks />} />
          <Route path="/user/view-task-details/:id" element={<ViewTaskDetails />} />
        </Route>

        {/* Catch-all → redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
  
  );
};

export default AppRoutes;
