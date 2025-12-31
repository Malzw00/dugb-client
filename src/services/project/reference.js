/**
 * Project References Services
 * ---------------------------
 * This module provides functions for interacting with project references endpoints.
 *
 * Endpoints:
 * - GET    /projects/:projectId/references
 * - POST   /projects/:projectId/references
 * - DELETE /projects/:projectId/references/:referenceId
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
    return api.get(`/projects/${projectId}/references`, {
        params: { projectId }
    });
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
 * @param {string} params.link
 * @param {string} params.author - Reference author.
 * @returns {Promise<AxiosResponse>}
 */
export async function addProjectReference({ projectId, referenceId }) {
    return api.post(`/projects/${projectId}/references`, {
        referenceId,
        projectId,
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
        `/projects/${projectId}/references/${referenceId}`, {
            params: {projectId, referenceId,}
        }
    );
}