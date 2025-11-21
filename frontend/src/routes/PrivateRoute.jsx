import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axiosInstance from "../utils/axiosinstance";
import { API_PATHS } from "../utils/apiPaths";

const PrivateRoute = ({ allowedRoles }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        console.log("No access token found");
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        // Try to get user profile to verify authentication
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
        setUser(response.data);
      } catch (error) {
        console.log("Authentication check failed:", error);
        // Clear any stale data
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    // Show loading spinner while checking authentication
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

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
