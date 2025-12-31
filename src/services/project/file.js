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
 * Upload a new Book.
 *
 * @function uploadBookFile
 * @param {Object} params
 * @param {string|number} params.projectId - Project ID
 * @param {File} params.file - File object from input[type=file]
 * @param {function} [params.onProgress] - Upload progress callback
 * @returns {Promise<AxiosResponse>}
 */
export function uploadBookFile({ projectId, file, onProgress }) {

    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", 'book');

    return api.post(`/projects/${projectId}/files/book`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: onProgress
            ? (e) => {
                const percent = Math.round((e.loaded * 100) / e.total);
                onProgress(percent);
            }
            : undefined,
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
 * Upload a new Presentation.
 *
 * @function uploadPresentationFile
 * @param {Object} params
 * @param {string|number} params.projectId - Project ID
 * @param {File} params.file - File object from input[type=file]
 * @param {function} [params.onProgress] - Upload progress callback
 * @returns {Promise<AxiosResponse>}
 */
export function uploadPresentationFile({ projectId, file, onProgress }) {

    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", 'presentation');

    return api.post(`/projects/${projectId}/files/presentation`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: onProgress
            ? (e) => {
                const percent = Math.round((e.loaded * 100) / e.total);
                onProgress(percent);
            }
            : undefined,
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