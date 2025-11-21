import axios from "axios";
import { API_PATHS } from "./apiPaths";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5555",
  withCredentials: true, // send cookies (refresh token)
});

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => refreshSubscribers.push(cb);
const onRefreshed = (newAccessToken) => {
  refreshSubscribers.forEach((cb) => cb(newAccessToken));
  refreshSubscribers = [];
};

const logoutAndRedirect = () => {
  localStorage.removeItem("accessToken");
  window.location.href = "/login";
};

// Attach access token to requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

// Handle 401 & refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) =>
          subscribeTokenRefresh((newToken) => {
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            resolve(axiosInstance(originalRequest));
          })
        );
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          `${axiosInstance.defaults.baseURL}${API_PATHS.AUTH.REFRESH}`,
          {},
          { withCredentials: true } // cookie is sent
        );

        const newAccessToken = data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;

        onRefreshed(newAccessToken);
        isRefreshing = false;

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch {
        isRefreshing = false;
        logoutAndRedirect();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
