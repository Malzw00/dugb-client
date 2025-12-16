/**
 * Collage Services
 * ----------------
 * Provides functions to interact with collage and department API endpoints:
 * - get all collages
 * - get collage by ID
 * - create, update, delete collage
 * - get collage departments
 * - get department by ID
 * - add and remove departments
 */

import api from "@services/api";

/* ============================================================
 * GET ALL COLLAGES
 * ============================================================ */

/**
 * Retrieve all collages with optional pagination.
 *
 * @function getAllCollages
 * @param {Object} [params]
 * @param {number} [params.offset]
 * @param {number} [params.limit]
 * @returns {Promise<AxiosResponse>}
 */
export function getAllCollages(params = {}) {
    return api.get("/collages", { params });
}

/* ============================================================
 * GET COLLAGE BY ID
 * ============================================================ */

/**
 * Get a collage by its ID.
 *
 * @function getCollageByID
 * @param {number|string} collageId
 * @returns {Promise<AxiosResponse>}
 */
export function getCollageByID(collageId) {
    return api.get(`/collages/${collageId}`);
}

/* ============================================================
 * CREATE NEW COLLAGE
 * ============================================================ */

/**
 * Create a new collage.
 *
 * @function createCollage
 * @param {Object} data
 * @param {string} data.name - Collage name
 * @returns {Promise<AxiosResponse>}
 */
export function createCollage(data) {
    return api.post("/collages", data);
}

/* ============================================================
 * UPDATE COLLAGE
 * ============================================================ */

/**
 * Update collage name.
 *
 * @function updateCollage
 * @param {number|string} collageId
 * @param {Object} data
 * @param {string} data.name
 * @returns {Promise<AxiosResponse>}
 */
export function updateCollage(collageId, data) {
    return api.put(`/collages/${collageId}`, data);
}

/* ============================================================
 * DELETE COLLAGE
 * ============================================================ */

/**
 * Delete a collage by ID.
 *
 * @function deleteCollage
 * @param {number|string} collageId
 * @returns {Promise<AxiosResponse>}
 */
export function deleteCollage(collageId) {
    return api.delete(`/collages/${collageId}`);
}

/* ============================================================
 * GET DEPARTMENTS OF A COLLAGE
 * ============================================================ */

/**
 * Get all departments belonging to a collage.
 *
 * @function getDepartments
 * @param {number|string} collageId
 * @param {Object} [params]
 * @param {number} [params.offset]
 * @param {number} [params.limit]
 * @returns {Promise<AxiosResponse>}
 */
export function getDepartments(collageId, params = {}) {
    return api.get(`/collages/${collageId}/departments`, { params });
}

/* ============================================================
 * GET DEPARTMENT BY ID
 * ============================================================ */

/**
 * Get a specific department inside a collage.
 *
 * @function getDepartment
 * @param {number|string} collageId
 * @param {number|string} departmentId
 * @returns {Promise<AxiosResponse>}
 */
export function getDepartment(collageId, departmentId) {
    return api.get(`/collages/${collageId}/departments/${departmentId}`);
}

/* ============================================================
 * ADD NEW DEPARTMENT
 * ============================================================ */

/**
 * Add a new department to a collage.
 *
 * @function addDepartment
 * @param {number|string} collageId
 * @param {Object} data
 * @param {string} data.name
 * @returns {Promise<AxiosResponse>}
 */
export function addDepartment(collageId, data) {
    return api.post(`/collages/${collageId}/departments`, data);
}

/* ============================================================
 * REMOVE DEPARTMENT
 * ============================================================ */

/**
 * Remove a department from a collage.
 *
 * @function removeDepartment
 * @param {number|string} collageId
 * @param {number|string} departmentId
 * @returns {Promise<AxiosResponse>}
 */
export function removeDepartment(collageId, departmentId) {
    return api.delete(`/collages/${collageId}/departments/${departmentId}`);
}