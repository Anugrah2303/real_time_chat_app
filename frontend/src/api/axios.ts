import axios, { type AxiosError } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;
    const isBlocked = status === 403 && message === "Your account is blocked";
    if (status === 401 || isBlocked) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.dispatchEvent(
        new CustomEvent("auth:unauthorized", { detail: { message: isBlocked ? message : undefined } })
      );
    }
    return Promise.reject(error);
  }
);

export default api;
