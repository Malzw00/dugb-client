/**
 * Reference Services
 * ------------------
 * Provides API request functions for project references:
 * - get all references
 * - get reference by ID
 * - create reference
 * - update reference
 * - delete reference
 */

import api from "@services/api";

/* ========================================================================== */
/*                                REFERENCES                                   */
/* ========================================================================== */

/**
 * Get all references (supports pagination).
 *
 * @function getReferences
 * @param {Object} params
 * @param {number} [params.offset]
 * @param {number} [params.limit]
 * @returns {Promise<AxiosResponse>}
 */
export function getReferences(params = {}) {
    return api.get("/references", { params });
}

/**
 * Get a reference by ID.
 *
 * @function getReferenceById
 * @param {string|number} referenceId
 * @returns {Promise<AxiosResponse>}
 */
export function getReferenceById(referenceId) {
    return api.get(`/references/${referenceId}`);
}

/**
 * Create a new reference.
 *
 * @function createReference
 * @param {Object} data
 * @param {string} data.title
 * @param {string} data.link
 * @param {string} [data.author]
 * @returns {Promise<AxiosResponse>}
 */
export function createReference(data) {
    return api.post("/references", data);
}

/**
 * Update an existing reference by ID.
 *
 * @function updateReference
 * @param {string|number} referenceId
 * @param {Object} data
 * @param {string} [data.title]
 * @param {string} [data.link]
 * @param {string} [data.author]
 * @returns {Promise<AxiosResponse>}
 */
export function updateReference(referenceId, data) {
    return api.put(`/references/${referenceId}`, data);
}

/**
 * Delete a reference by ID.
 *
 * @function deleteReference
 * @param {string|number} referenceId
 * @returns {Promise<AxiosResponse>}
 */
export function deleteReference(referenceId) {
    return api.delete(`/references/${referenceId}`);
}