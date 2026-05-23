import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    withCredentials: true,
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    // 🚫 Do NOT retry refresh endpoint
    if (originalRequest.url.includes("/auth/refresh")) {
      return Promise.reject(err);
    }

    // 🚫 Prevent infinite loop
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          "http://localhost:8080/api/v1/auth/refresh",
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;

        localStorage.setItem("token", newAccessToken);

        // 🔁 retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return API(originalRequest);

      } catch (refreshError) {
        console.log("Refresh failed → logout");

        localStorage.clear();
        window.location.href = "/";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err);
  }
);

export default API;