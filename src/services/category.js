/**
 * Category Services
 * -----------------
 * Provides API request functions for project categories:
 * - get all categories
 * - get category by ID
 * - create category
 * - update category
 * - delete category
 * - manage projects in categories
 */

import api from "@services/api";

/* ========================================================================== */
/*                               CATEGORIES                                    */
/* ========================================================================== */

/**
 * Get all categories (supports optional collage filter and pagination).
 *
 * @function getCategories
 * @param {Object} params
 * @param {number} [params.collageId]
 * @param {number} [params.offset]
 * @param {number} [params.limit]
 * @returns {Promise<AxiosResponse>}
 */
export function getCategories(params = {}) {
    return api.get("/categories", { params });
}

/**
 * Create multiple categories at once.
 *
 * @function createCategories
 * @param {Object} data
 * @param {Array<string>} data.name
 * @param {number} data.collageId
 * @returns {Promise<AxiosResponse>}
 */
export function createCategories(data) {
    return api.post("/categories", data);
}

/**
 * Update a category by ID.
 *
 * @function updateCategory
 * @param {number|string} categoryId
 * @param {Object} data
 * @param {string} [data.name]
 * @param {number} [data.collageId]
 * @returns {Promise<AxiosResponse>}
 */
export function updateCategory(categoryId, data) {
    return api.put(`/categories/${categoryId}`, data);
}

/**
 * Delete a category by ID.
 *
 * @function deleteCategory
 * @param {number|string} categoryId
 * @returns {Promise<AxiosResponse>}
 */
export function deleteCategory(categoryId) {
    return api.delete(`/categories/${categoryId}`);
}

/* ========================================================================== */
/*                             CATEGORY PROJECTS                               */
/* ========================================================================== */

/**
 * Get all projects of a specific category.
 *
 * @function getCategoryProjects
 * @param {number|string} categoryId
 * @param {Object} [params] - Optional pagination parameters.
 * @param {number} [params.offset]
 * @param {number} [params.limit]
 * @returns {Promise<AxiosResponse>}
 */
export function getCategoryProjects(categoryId) {
    return api.get(`/categories/${categoryId}/projects`,);
}

/**
 * Add a project to a category.
 *
 * @function addProjectToCategory
 * @param {number|string} categoryId
 * @param {Object} data
 * @param {number} data.projectId
 * @returns {Promise<AxiosResponse>}
 */
export function addProjectToCategory(categoryId, data) {
    return api.post(`/categories/${categoryId}/projects`, data);
}

/**
 * Remove a project from a category.
 *
 * @function removeProjectFromCategory
 * @param {number|string} categoryId
 * @param {number|string} projectId
 * @returns {Promise<AxiosResponse>}
 */
export function removeProjectFromCategory(categoryId, projectId) {
    return api.delete(`/categories/${categoryId}/projects/${projectId}`);
}
