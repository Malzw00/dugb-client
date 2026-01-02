// src/services/api.js
import axios from "axios";
import baseURL from "@config/baseURL.config";
import { store } from '@store/store';
import { setAccessToken, clearUser } from '@store/slices/user.slice';

// Create axios instance
const api = axios.create({
    baseURL: `${baseURL}/api/v1`,
    headers: { "Content-Type": "application/json" },
    withCredentials: true, // مهم للـ refresh_token cookie
    timeout: 5000,
});

/* =========================
   Request Interceptor
========================= */
api.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const accessToken = state.user?.value?.accessToken;

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        } else {
            delete config.headers.Authorization;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

/* =========================
   Response Interceptor
========================= */
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // تحقق من شروط refresh
        if (
            error.response?.status === 401 &&
            error.response?.data?.accessTokenExpired === true &&
            !originalRequest._retry &&
            !originalRequest.url.includes('/auth/me')
        ) {
            console.log('will request auth/me to refresh access token');

            originalRequest._retry = true;

            try {
                // اطلب access token جديد باستخدام refresh token (cookie)
                const res = await api.post('/auth/me');

                const newAccessToken = res.data.result.accessToken;

                // خزّنه في redux
                store.dispatch(setAccessToken(newAccessToken));

                // أعد تعيين الهيدر وأعد الطلب
                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;

                return api(originalRequest);

            } catch (refreshError) {
                // refresh فشل → logout
                store.dispatch(clearUser());
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;