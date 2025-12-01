/**
 * Project Files Services
 * ----------------------
 * This module provides functions for interacting with project file endpoints.
 *
 * Endpoints:
 * - GET    /projects/:projectId/files/book
 * - POST   /projects/:projectId/files/book
 * - DELETE /projects/:projectId/files/book
 *
 * - GET    /projects/:projectId/files/presentation
 * - POST   /projects/:projectId/files/presentation
 * - DELETE /projects/:projectId/files/presentation
 */

import api from "@services/api";

/* ============================================================
 * BOOK FILE ENDPOINTS
 * ============================================================ */

/**
 * Get book file of a specific project.
 *
 * @function getBookFile
 * @param {string|number} projectId - Project ID.
 * @returns {Promise<AxiosResponse>}
 */
export async function getBookFile(projectId) {
    return api.get(`/projects/${projectId}/files/book`);
}

/**
 * Upload or replace book file for a project.
 *
 * @function uploadBookFile
 * @param {string|number} projectId - Project ID.
 * @param {File} file - Book file to upload.
 * @returns {Promise<AxiosResponse>}
 */
export async function uploadBookFile({ projectId, file }) {
    const formData = new FormData();
    formData.append("file", file);

    return api.post(`/projects/${projectId}/files/book`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
}

/**
 * Delete book file of a project.
 *
 * @function deleteBookFile
 * @param {string|number} projectId - Project ID.
 * @returns {Promise<AxiosResponse>}
 */
export async function deleteBookFile(projectId) {
    return api.delete(`/projects/${projectId}/files/book`);
}

/* ============================================================
 * PRESENTATION FILE ENDPOINTS
 * ============================================================ */

/**
 * Get presentation file of a specific project.
 *
 * @function getPresentationFile
 * @param {string|number} projectId - Project ID.
 * @returns {Promise<AxiosResponse>}
 */
export async function getPresentationFile(projectId) {
    return api.get(`/projects/${projectId}/files/presentation`);
}

/**
 * Upload or replace presentation file for a project.
 *
 * @function uploadPresentationFile
 * @param {string|number} projectId - Project ID.
 * @param {File} file - Presentation file.
 * @returns {Promise<AxiosResponse>}
 */
export async function uploadPresentationFile({ projectId, file }) {
    const formData = new FormData();
    formData.append("file", file);

    return api.post(`/projects/${projectId}/files/presentation`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
}

/**
 * Delete presentation file of a project.
 *
 * @function deletePresentationFile
 * @param {string|number} projectId - Project ID.
 * @returns {Promise<AxiosResponse>}
 */
export async function deletePresentationFile(projectId) {
    return api.delete(`/projects/${projectId}/files/presentation`);
}