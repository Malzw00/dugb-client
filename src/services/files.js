/**
 * Files Services
 * --------------
 * Provides API request functions for file operations:
 * - List files
 * - Get file by ID
 * - Upload file
 * - Delete file
 */

import api from "@services/api";

/* ========================================================================== */
/*                                   FILES                                     */
/* ========================================================================== */

/**
 * Get all files (supports pagination if used).
 *
 * @function getFiles
 * @param {Object} params
 * @param {number} [params.offset]
 * @param {number} [params.limit]
 * @returns {Promise<AxiosResponse>}
 */
export function getFiles(params = {}) {
    return api.get("/files", { params });
}

/**
 * Get a file by ID.
 *
 * @function getFileById
 * @param {string|number} fileId
 * @returns {Promise<AxiosResponse>}
 */
export function getFileById(fileId) {
    return api.get(`/files/${fileId}`);
}

/**
 * Delete file by ID.
 *
 * @function deleteFile
 * @param {string|number} fileId
 * @returns {Promise<AxiosResponse>}
 */
export function deleteFile(fileId) {
    return api.delete(`/files/${fileId}`);
}

/**
 * Upload a new file.
 *
 * NOTE:
 *  - Must be multipart/form-data
 *  - file + optional category
 *
 * @function uploadFile
 * @param {FormData} formData
 * @returns {Promise<AxiosResponse>}
 */
export function uploadFile(formData) {
    return api.post("/files", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}