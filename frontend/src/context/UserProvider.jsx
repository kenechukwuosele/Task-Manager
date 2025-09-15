import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosinstance";
import { API_PATHS } from "../utils/apiPaths";
import { UserContext } from "./userContext";

// UserProvider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  const updateUser = (data) => {
    if (!data) return;

    const normalizedUser = {
      ...data,
      profileImageUrl:
        data.profileImageUrl || data.avatar || data.imageUrl || null,
    };

    setUser(normalizedUser);

    if (data.token) {
      setAccessToken(data.token);
      localStorage.setItem("token", data.token);
    }

    localStorage.setItem("user", JSON.stringify(normalizedUser));
  };

  const logout = async () => {
    try {
      await axiosInstance.post(
        API_PATHS.AUTH.LOGOUT,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      toast.error("Logout failed:", err);
    } finally {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  };

  useEffect(() => {
    if (accessToken) {
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${accessToken}`;
    } else {
      delete axiosInstance.defaults.headers.common["Authorization"];
    }
  }, [accessToken]);

  return (
    <UserContext.Provider value={{ user, updateUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};
