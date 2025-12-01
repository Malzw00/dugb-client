/**
 * Project Keywords Services
 * ------------------------
 * This module provides functions for interacting with project keywords endpoints.
 *
 * Endpoints:
 * - GET    /projects/:projectId/keywords
 * - POST   /projects/:projectId/keywords
 * - DELETE /projects/:projectId/keywords/:keywordId
 */

import api from "@services/api";

/* ============================================================
 * GET ALL PROJECT KEYWORDS
 * ============================================================ */

/**
 * Get all keywords linked to a specific project.
 *
 * @function getProjectKeywords
 * @param {string|number} projectId - The ID of the project.
 * @returns {Promise<AxiosResponse>}
 */
export async function getProjectKeywords(projectId) {
    return api.get(`/projects/${projectId}/keywords`);
}

/* ============================================================
 * ADD KEYWORDS TO PROJECT
 * ============================================================ */

/**
 * Add one or more keywords to a specific project.
 *
 * @function addProjectKeywords
 * @param {Object} params
 * @param {string|number} params.projectId - The ID of the project.
 * @param {Array<string>} params.keywords - List of keyword strings to add.
 * @returns {Promise<AxiosResponse>}
 */
export async function addProjectKeywords({ projectId, keywords }) {
    return api.post(`/projects/${projectId}/keywords`, {
        keywords,
    });
}

/* ============================================================
 * DELETE KEYWORD FROM PROJECT
 * ============================================================ */

/**
 * Remove a specific keyword from a project.
 *
 * @function deleteProjectKeyword
 * @param {Object} params
 * @param {string|number} params.projectId - The ID of the project.
 * @param {string|number} params.keywordId - The ID of the keyword to remove.
 * @returns {Promise<AxiosResponse>}
 */
export async function deleteProjectKeyword({ projectId, keywordId }) {
    return api.delete(`/projects/${projectId}/keywords/${keywordId}`);
}