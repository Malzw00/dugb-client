/**
 * Auth Services
 * -------------
 * Provides functions for authentication and account access operations:
 * - register
 * - login
 * - logout
 * - forgot password
 * - reset password
 * - refresh token
 */

import api from "@services/api";

/* ============================================================
 * REGISTER NEW ACCOUNT
 * ============================================================ */

/**
 * Register a new user account.
 *
 * @function register
 * @param {Object} data
 * @param {string} data.fst_name
 * @param {string} data.lst_name
 * @param {string} data.email
 * @param {string} data.password
 * @returns {Promise<AxiosResponse>}
 */
export function register(data) {
    return api.post("/auth/register", data);
}

/* ============================================================
 * LOGIN
 * ============================================================ */

/**
 * Log in with email and password.
 *
 * @function login
 * @param {Object} data
 * @param {string} data.email
 * @param {string} data.password
 * @returns {Promise<AxiosResponse>}
 */
export function login(data) {
    return api.post("/auth/login", data);
}

/* ============================================================
 * LOGOUT
 * ============================================================ */

/**
 * Log out the currently authenticated user.
 *
 * @function logout
 * @returns {Promise<AxiosResponse>}
 */
export function logout() {
    return api.post("/auth/logout");
}

/* ============================================================
 * FORGOT PASSWORD
 * ============================================================ */

/**
 * Send password reset link or code.
 *
 * @function forgotPassword
 * @param {Object} data
 * @param {string} data.email
 * @returns {Promise<AxiosResponse>}
 */
export function forgotPassword(data) {
    return api.post("/auth/forgot-password", data);
}

/* ============================================================
 * RESET PASSWORD
 * ============================================================ */

/**
 * Reset account password using reset token.
 *
 * @function resetPassword
 * @param {Object} data
 * @param {string} data.token
 * @param {string} data.newPassword
 * @returns {Promise<AxiosResponse>}
 */
export function resetPassword(data) {
    return api.post("/auth/reset-password", data);
}

/* ============================================================
 * REFRESH ACCESS TOKEN
 * ============================================================ */

/**
 * Refresh the access token using the refresh token.
 *
 * @function refreshToken
 * @param {Object} data
 * @param {string} data.refreshToken
 * @returns {Promise<AxiosResponse>}
 */
export function refreshToken(data) {
    return api.post("/auth/refresh", data);
}
