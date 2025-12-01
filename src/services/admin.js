/**
 * Admin Services
 * --------------
 * Functions for interacting with admin-related API endpoints.
 *
 * Endpoints:
 *
 * - PUT    /admins/accounts/:accountId/role
 * - GET    /admins/accounts
 * - GET    /admins/accounts/:accountId/permissions
 * - POST   /admins/accounts/:accountId/permissions
 * - DELETE /admins/accounts/:accountId/permissions/:permissionId
 */

import api from "@services/api";

/* ============================================================
 * UPDATE ACCOUNT ROLE (ASSIGN / REMOVE ADMIN)
 * ============================================================ */

/**
 * Assign or remove the admin role from an account.
 *
 * @function updateAccountRole
 * @param {Object} params
 * @param {string|number} params.accountId - Target account ID.
 * @param {("admin"|"user")} params.role - New role to apply.
 * @returns {Promise<AxiosResponse>}
 */
export async function updateAccountRole({ accountId, role }) {
    return api.put(`/admins/accounts/${accountId}/role`, { role });
}

/* ============================================================
 * GET ALL ADMINS (PAGINATED)
 * ============================================================ */

/**
 * Get a paginated list of administrator accounts.
 *
 * @function getAdmins
 * @param {Object} params
 * @param {number} [params.limit]
 * @param {number} [params.offset]
 * @returns {Promise<AxiosResponse>}
 */
export async function getAdmins({ limit, offset } = {}) {
    return api.get(`/admins/accounts`, {
        params: { limit, offset },
    });
}

/* ============================================================
 * GET ACCOUNT PERMISSIONS
 * ============================================================ */

/**
 * Get all permissions assigned to a specific admin account.
 *
 * @function getAccountPermissions
 * @param {string|number} accountId - Account ID.
 * @returns {Promise<AxiosResponse>}
 */
export async function getAccountPermissions(accountId) {
    return api.get(`/admins/accounts/${accountId}/permissions`);
}

/* ============================================================
 * GRANT PERMISSION TO ACCOUNT
 * ============================================================ */

/**
 * Grant a specific permission to an admin account.
 *
 * @function grantPermission
 * @param {Object} params
 * @param {string|number} params.accountId - Account ID.
 * @param {string|number} params.permissionId - Permission ID.
 * @returns {Promise<AxiosResponse>}
 */
export async function grantPermission({ accountId, permissionId }) {
    return api.post(`/admins/accounts/${accountId}/permissions`, {
        permissionId,
    });
}

/* ============================================================
 * REMOVE PERMISSION FROM ACCOUNT
 * ============================================================ */

/**
 * Remove a specific permission from an admin account.
 *
 * @function removePermission
 * @param {Object} params
 * @param {string|number} params.accountId - Account ID.
 * @param {string|number} params.permissionId - Permission ID.
 * @returns {Promise<AxiosResponse>}
 */
export async function removePermission({ accountId, permissionId }) {
    return api.delete(
        `/admins/accounts/${accountId}/permissions/${permissionId}`
    );
}