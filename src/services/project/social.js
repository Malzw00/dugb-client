/**
 * Project Social Services
 * ----------------------
 * This module provides functions for interacting with project social endpoints:
 * likes, comments, and ratings.
 *
 * Endpoints covered:
 * - GET    /projects/:projectId/likes
 * - GET    /projects/:projectId/likes/count
 * - GET    /projects/:projectId/likes/me
 * - POST   /projects/:projectId/likes
 * - DELETE /projects/:projectId/likes/me
 *
 * - GET    /projects/:projectId/comments
 * - GET    /projects/:projectId/comments/count
 * - POST   /projects/:projectId/comments
 * - DELETE /projects/:projectId/comments/:commentId
 *
 * - GET    /projects/:projectId/ratings
 * - GET    /projects/:projectId/ratings/average
 * - GET    /projects/:projectId/ratings/me
 * - POST   /projects/:projectId/ratings
 * - PUT    /projects/:projectId/ratings
 */

import api from "@services/api";

/* ============================================================
 * LIKES
 * ============================================================ */

/**
 * Get all likes for a specific project.
 *
 * @function getProjectLikes
 * @param {string|number} projectId - The ID of the project.
 * @returns {Promise<AxiosResponse>}
 */
export async function getProjectLikes(projectId) {
    return api.get(`/projects/${projectId}/likes`);
}

/**
 * Get the total number of likes for a project.
 *
 * @function getProjectLikesCount
 * @param {string|number} projectId
 * @returns {Promise<AxiosResponse>}
 */
export async function getProjectLikesCount(projectId) {
    return api.get(`/projects/${projectId}/likes/count`);
}

/**
 * Check if the authenticated user has liked the project.
 *
 * @function amILikeProject
 * @param {string|number} projectId
 * @returns {Promise<AxiosResponse>}
 */
export async function amILikeProject(projectId) {
    return api.get(`/projects/${projectId}/likes/me`);
}

/**
 * Add a like to the project.
 *
 * @function addProjectLike
 * @param {string|number} projectId
 * @returns {Promise<AxiosResponse>}
 */
export async function addProjectLike(projectId) {
    return api.post(`/projects/${projectId}/likes`);
}

/**
 * Remove like of the authenticated user.
 *
 * @function removeProjectLike
 * @param {string|number} projectId
 * @returns {Promise<AxiosResponse>}
 */
export async function removeProjectLike(projectId) {
    return api.delete(`/projects/${projectId}/likes/me`);
}

/* ============================================================
 * COMMENTS
 * ============================================================ */

/**
 * Get all comments for a specific project.
 *
 * @function getProjectComments
 * @param {string|number} projectId
 * @param {Object} [params={}] - Pagination options.
 * @param {number} [params.offset=0]
 * @param {number} [params.limit=20]
 * @returns {Promise<AxiosResponse>}
 */
export async function getProjectComments(projectId, { offset = 0, limit = 20 } = {}) {
    return api.get(`/projects/${projectId}/comments`, { params: { offset, limit } });
}

/**
 * Get total number of comments for a project.
 *
 * @function getProjectCommentsCount
 * @param {string|number} projectId
 * @returns {Promise<AxiosResponse>}
 */
export async function getProjectCommentsCount(projectId) {
    return api.get(`/projects/${projectId}/comments/count`);
}

/**
 * Add a new comment to a project.
 *
 * @function addProjectComment
 * @param {Object} params
 * @param {string|number} params.projectId
 * @param {string} params.content - Comment text.
 * @returns {Promise<AxiosResponse>}
 */
export async function addProjectComment({ projectId, content }) {
    return api.post(`/projects/${projectId}/comments`, { content });
}

/**
 * Delete a specific comment from a project.
 *
 * @function deleteProjectComment
 * @param {Object} params
 * @param {string|number} params.projectId
 * @param {string|number} params.commentId
 * @returns {Promise<AxiosResponse>}
 */
export async function deleteProjectComment({ projectId, commentId }) {
    return api.delete(`/projects/${projectId}/comments/${commentId}`);
}

/* ============================================================
 * RATINGS
 * ============================================================ */

/**
 * Get all ratings for a project.
 *
 * @function getProjectRatings
 * @param {string|number} projectId
 * @returns {Promise<AxiosResponse>}
 */
export async function getProjectRatings(projectId) {
    return api.get(`/projects/${projectId}/ratings`);
}

/**
 * Get the average rating of a project.
 *
 * @function getProjectRatingAverage
 * @param {string|number} projectId
 * @returns {Promise<AxiosResponse>}
 */
export async function getProjectRatingAverage(projectId) {
    return api.get(`/projects/${projectId}/ratings/average`);
}

/**
 * Get the authenticated user's rating for a project.
 *
 * @function getMyProjectRating
 * @param {string|number} projectId
 * @returns {Promise<AxiosResponse>}
 */
export async function getMyProjectRating(projectId) {
    return api.get(`/projects/${projectId}/ratings/me`);
}

/**
 * Add a new rating to the project.
 *
 * @function rateProject
 * @param {Object} params
 * @param {string|number} params.projectId
 * @param {number} params.rate
 * @returns {Promise<AxiosResponse>}
 */
export async function rateProject({ projectId, rate }) {
    return api.post(`/projects/${projectId}/ratings`, { rate });
}

/**
 * Update the rating of the authenticated user.
 *
 * @function updateProjectRating
 * @param {Object} params
 * @param {string|number} params.projectId
 * @param {number} params.rate
 * @returns {Promise<AxiosResponse>}
 */
export async function updateProjectRating({ projectId, rate }) {
    return api.put(`/projects/${projectId}/ratings`, { rate });
}