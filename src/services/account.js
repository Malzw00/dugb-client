/**
 * Account Services
 * ----------------
 * Functions for interacting with account-related API endpoints.
 *
 * Endpoints covered:
 *
 * - GET    /accounts/search
 *
 * - GET    /accounts/me
 * - PUT    /accounts/me
 * - DELETE /accounts/me
 *
 * - GET    /accounts/:accountId
 * - DELETE /accounts/:accountId
 */

import api from "@services/api";

/* ============================================================
 * SEARCH ACCOUNTS
 * ============================================================ */

/**
 * Search accounts by keyword, role, offset and limit.
 *
 * @function searchAccounts
 * @param {Object} params
 * @param {string} [params.keyword]
 * @param {string} [params.role]
 * @param {number} [params.offset=0]
 * @param {number} [params.limit=20]
 * @returns {Promise<AxiosResponse>}
 */
export async function searchAccounts({
    keyword = "",
    role = "",
    offset = 0,
    limit = 20,
} = {}) {
    return api.get("/accounts/search", {
        params: { keyword, role, offset, limit },
    });
}

/* ============================================================
 * ME ENDPOINTS
 * ============================================================ */

/**
 * Get authenticated user account details.
 *
 * @function getMyAccount
 * @returns {Promise<AxiosResponse>}
 */
export async function getMyAccount() {
    return api.get("/accounts/me");
}

/**
 * Update the authenticated user's account.
 *
 * @function updateMyAccount
 * @param {Object} data - Fields to update.
 * @returns {Promise<AxiosResponse>}
 */
export async function updateMyAccount(data) {
    return api.put("/accounts/me", data);
}

/**
 * Delete the authenticated user's account.
 *
 * @function deleteMyAccount
 * @returns {Promise<AxiosResponse>}
 */
export async function deleteMyAccount() {
    return api.delete("/accounts/me");
}

/* ============================================================
 * ACCOUNT BY ID
 * ============================================================ */

/**
 * Get account details by ID.
 *
 * @function getAccountById
 * @param {string|number} accountId
 * @returns {Promise<AxiosResponse>}
 */
export async function getAccountById(accountId) {
    return api.get(`/accounts/${accountId}`);
}

/**
 * Delete an account by ID (admin only).
 *
 * @function deleteAccountById
 * @param {string|number} accountId
 * @returns {Promise<AxiosResponse>}
 */
export async function deleteAccountById(accountId) {
    return api.delete(`/accounts/${accountId}`);
}