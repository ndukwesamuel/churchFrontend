import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";
// const apiUrl = "http://localhost:8080/api/v1";

const axiosInstance = axios.create({
  baseURL: apiUrl,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
