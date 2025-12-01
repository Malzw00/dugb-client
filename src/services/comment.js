/**
 * Comment Services
 * ----------------
 * Provides API request functions for managing comments and likes:
 * - get comment
 * - update comment
 * - delete comment
 * - get likes
 * - like/unlike
 */

import api from "@services/api"; ///

/* ========================================================================== */
/*                                  COMMENTS                                   */
/* ========================================================================== */

/**
 * Get a specific comment by ID.
 *
 * @function getComment
 * @param {number|string} commentId
 * @returns {Promise<AxiosResponse>}
 */
export function getComment(commentId) {
    return api.get(`/comments/${commentId}`);
}

/**
 * Update a comment by ID.
 *
 * @function updateComment
 * @param {number|string} commentId
 * @param {Object} data
 * @param {string} data.content
 * @returns {Promise<AxiosResponse>}
 */
export function updateComment(commentId, data) {
    return api.put(`/comments/${commentId}`, data);
}

/**
 * Delete a comment by ID.
 *
 * @function deleteComment
 * @param {number|string} commentId
 * @returns {Promise<AxiosResponse>}
 */
export function deleteComment(commentId) {
    return api.delete(`/comments/${commentId}`);
}

/* ========================================================================== */
/*                                    LIKES                                     */
/* ========================================================================== */

/**
 * Get all likes for a specific comment.
 *
 * @function getCommentLikes
 * @param {number|string} commentId
 * @param {Object} [params] - Optional pagination params
 * @param {number} [params.offset]
 * @param {number} [params.limit]
 * @returns {Promise<AxiosResponse>}
 */
export function getCommentLikes(commentId, params = {}) {
    return api.get(`/comments/${commentId}/likes`, { params });
}

/**
 * Get the likes count for a comment.
 *
 * @function getCommentLikesCount
 * @param {number|string} commentId
 * @returns {Promise<AxiosResponse>}
 */
export function getCommentLikesCount(commentId) {
    return api.get(`/comments/${commentId}/likes/count`);
}

/**
 * Check if the current authenticated user liked the comment.
 *
 * @function amILikedComment
 * @param {number|string} commentId
 * @returns {Promise<AxiosResponse>}
 */
export function amILikedComment(commentId) {
    return api.get(`/comments/${commentId}/likes/me`);
}

/**
 * Add a like to a comment.
 *
 * @function likeComment
 * @param {number|string} commentId
 * @returns {Promise<AxiosResponse>}
 */
export function likeComment(commentId) {
    return api.post(`/comments/${commentId}/likes`);
}

/**
 * Remove the current user's like from a comment.
 *
 * @function unlikeComment
 * @param {number|string} commentId
 * @returns {Promise<AxiosResponse>}
 */
export function unlikeComment(commentId) {
    return api.delete(`/comments/${commentId}/likes`);
}