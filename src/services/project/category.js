/**
 * Project Categories Services
 * ---------------------------
 * This module provides functions for interacting with project categories endpoints.
 *
 * Endpoints:
 * - GET    /projects/:projectId/categories
 * - POST   /projects/:projectId/categories
 * - DELETE /projects/:projectId/categories/:categoryId
 */

import api from "@services/api";

/* ============================================================
 * GET ALL PROJECT CATEGORIES
 * ============================================================ */

/**
 * Get all categories linked to a specific project.
 *
 * @function getProjectCategories
 * @param {string|number} projectId - The ID of the project.
 * @returns {Promise<AxiosResponse>}
 */
export async function getProjectCategories(projectId) {
    return api.get(`/projects/${projectId}/categories`, { params: { projectId } });
}

/* ============================================================
 * ADD CATEGORY TO PROJECT
 * ============================================================ */

/**
 * Add a new category to a specific project.
 *
 * @function addProjectCategory
 * @param {Object} params
 * @param {string|number} params.projectId - The ID of the project.
 * @param {number} params.categoryId - The ID of the category to link.
 * @returns {Promise<AxiosResponse>}
 */
export async function addProjectCategory({ projectId, categoryId }) {
    return api.post(`/projects/${projectId}/categories`, {
        categoryId, projectId
    });
}

/* ============================================================
 * DELETE CATEGORY FROM PROJECT
 * ============================================================ */

/**
 * Remove a category from a specific project.
 *
 * @function deleteProjectCategory
 * @param {Object} params
 * @param {string|number} params.projectId - The ID of the project.
 * @param {string|number} params.categoryId - The ID of the category to remove.
 * @returns {Promise<AxiosResponse>}
 */
export async function deleteProjectCategory({ projectId, categoryId }) {
    return api.delete(`/projects/${projectId}/categories/${categoryId}`, {params: {
        projectId, categoryId
    }});
}