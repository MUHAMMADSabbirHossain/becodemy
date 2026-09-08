import axios from 'axios';

const NEXT_PUBLIC_SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;

const axiosInstance = axios.create({
  baseURL: NEXT_PUBLIC_SERVER_URI,
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];

// Handle logout and prevent infinite loop
const handleLogout = () => {
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

// Handle adding a new access token to quered requests
const subscribeTokenRefresh = (callback: () => void) => {
  refreshSubscribers.push(callback);
};

// Execute queued requests after refresh
const onRefreshSuccess = () => {
  refreshSubscribers.forEach((callback) => callback());
  refreshSubscribers = [];
};

// Handle API requests
axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

// Handle expired tokes and refresh logic
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // prevent infinite retry loop
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh(() => resolve(axiosInstance(originalRequest)));
        });
      }
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post(
          `${NEXT_PUBLIC_SERVER_URI}/api/refresh-token-user`,
          {},
          { withCredentials: true },
        );

        isRefreshing = false;
        onRefreshSuccess();

        return axiosInstance(originalRequest);
      } catch (error) {
        isRefreshing = false;
        refreshSubscribers = [];
        handleLogout();

        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
