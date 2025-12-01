/**
 * Project References Services
 * ---------------------------
 * This module provides functions for interacting with project references endpoints.
 *
 * Endpoints:
 * - GET    /projects/:projectId/files/references
 * - POST   /projects/:projectId/files/references
 * - DELETE /projects/:projectId/files/references/:referenceId
 */

import api from "@services/api";

/* ============================================================
 * GET REFERENCES
 * ============================================================ */

/**
 * Get all references associated with a specific project.
 *
 * @function getProjectReferences
 * @param {string|number} projectId - Project ID.
 * @returns {Promise<AxiosResponse>}
 */
export async function getProjectReferences(projectId) {
    return api.get(`/projects/${projectId}/files/references`);
}

/* ============================================================
 * ADD REFERENCE
 * ============================================================ */

/**
 * Add a new reference to the project.
 *
 * @function addProjectReference
 * @param {Object} params
 * @param {string|number} params.projectId - Project ID.
 * @param {string} params.title - Reference title.
 * @param {string} params.link - Reference link (local:{path} / network:{path}).
 * @param {string} params.author - Reference author.
 * @returns {Promise<AxiosResponse>}
 */
export async function addProjectReference({ projectId, title, link, author }) {
    return api.post(`/projects/${projectId}/files/references`, {
        title,
        link,
        author,
    });
}

/* ============================================================
 * DELETE REFERENCE
 * ============================================================ */

/**
 * Delete a specific reference by its ID.
 *
 * @function deleteProjectReference
 * @param {Object} params
 * @param {string|number} params.projectId - Project ID.
 * @param {string|number} params.referenceId - Reference ID to delete.
 * @returns {Promise<AxiosResponse>}
 */
export async function deleteProjectReference({ projectId, referenceId }) {
    return api.delete(
        `/projects/${projectId}/files/references/${referenceId}`
    );
}