export const BASE_URL = "http://localhost:5000";

//utils/apiPaths.js
export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/v1/auth/register",
    LOGIN: "/api/v1/auth/login",
    GET_PROFILE: "/api/v1/auth/profile",
    REFRESH: "/api/v1/auth/refresh",
  },

  USERS: {
    GET_ALL_USERS: "/api/v1/users",
    GET_USER_BY_ID: () => `/api/v1/users/${userId}`,
    CREATE_USER: "/api/v1/users",
    UPDATE_USER: () => `/api/v1/users/${userId}`,
    DELETE_USER: () => `/api/v1/users/${userId}`,
  },

  TASKS: {
    GET_DASHBOARD_DATA: "/api/v1/tasks/dashboard-data",
    GET_USER_DASHBOARD_DATA: "/api/v1/tasks/user-dashboard-data",
    GET_ALL_TASKS: "/api/v1/tasks",
    GET_TASK_BY_ID: () => `/api/v1/tasks/${taskId}`,
    CREATE_TASK: "/api/v1/tasks",
    UPDATE_USER: () => `/ap1/v1/tasks/${taskId}`,
    DELETE_USER: () => `/api/v1/tasks/${taskId}`,

    UPDATE_TASK_STATUS: () => `/api/v1/tasks/${taskId}/status`,
    UPDATE_TODO_CHECKLIST: () => `/api/v1/tasks/${taskId}/todo`,
  },

  REPORT: {
    EXPORT_TASKS: "/api/v1/reports/export/tasks",
    EXPORT_USERS: "/api/v1/reports/export/users",
  },

  IMAGE: {
    UPLOAD_IMAGE: "/api/v1/auth/upload-image",
  },
};
