import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log("PrivateRoute user:", user);

  if (!user) {
    console.log("➡️ Redirecting to /login because no user");
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log("➡️ Redirecting to /unauthorized because role mismatch");
    return <Navigate to="/unauthorized" replace />;
  }

  console.log("✅ Allowed, rendering child route");
  return <Outlet />;
};

export default PrivateRoute;
