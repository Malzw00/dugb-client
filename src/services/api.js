// src/services/api.js
import axios from "axios";
import baseURL from "@config/baseURL.config";

// Create an instance to facilitate its use in all functions.
const api = axios.create({
    baseURL, // Primary link from the config file
    headers: { "Content-Type": "application/json" },
    withCredentials: true, // مهم جدًا للكوكيز Cross-origin
    timeout: 5000, // Example: 5 second timeout
});

// Intercepting requests and responses (optional, for adding token or logging)
api.interceptors.request.use(
    (config) => {
        // Example: Adding the Authorization header if it exists
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error:", error);
        return Promise.reject(error);
    }
);

export default api;