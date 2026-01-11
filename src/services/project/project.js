/**
 * Project Services
 * ----------------
 * This module provides functions for interacting with the backend Project API.
 * All HTTP requests use Axios instance located at @services/api.
 */

import api from "@services/api";

/**
 * Get a list of projects with optional filters, pagination, and ordering.
 *
 * @function getProjects
 * @param {Object} [options={}] - Filter and pagination options.
 * @param {number} [options.offset=0] - Pagination offset.
 * @param {number} [options.limit=20] - Pagination limit.
 * @param {Array<number>} [options.categories=[]] - Category IDs.
 * @param {Array<number>} [options.departmentId] - Department ID.
 * @param {Array<number>} [options.collageId] - Collage ID.
 * @param {"date"|"rating"|"likes"|"grade"} [options.sortBy="date"] - Sorting field.
 * @param {"ASC"|"DESC"} [options.order="DESC"] - Sorting direction.
 * @returns {Promise<AxiosResponse>} Axios full response.
 */
export async function getProjects({
    offset = 0,
    limit = 20,
    categories = [],
    departmentId,
    collageId,
    semester,
    sortBy = "date",
    order = "DESC",
    year,
} = {}) {
    return api.get("/projects", {
        params: {
            offset,
            limit,
            categories,
            departmentId,
            collageId,
            sortBy,
            order,
            semester,
            year,
        },
    });
}

/**
 * Get a single project by its ID.
 *
 * @function getProjectById
 * @param {number|string} projectId - Unique project ID.
 * @returns {Promise<AxiosResponse>} Axios full response.
 */
export async function getProjectById(projectId) {
    return api.get(`/projects/${projectId}`);
}

/**
 * Create a new project.
 * Matches backend route: POST /projects
 *
 * @function createProject
 * @param {Object} params - Project payload.
 * @param {string} params.title - Project title.
 * @param {string} params.description - Description text.
 * @param {string|Date} params.date - Creation date.
 * @param {'Winter'|'Spring'|'Summer'|'Autumn'} params.semester - Academic semester.
 * @param {number} params.departmentId - Department ID.
 * @param {number} params.supervisorId - Supervisor ID.
 * @returns {Promise<AxiosResponse>} Axios full response.
 */
export async function createProject({
    title,
    description,
    date,
    semester,
    departmentId,
    supervisorId,
}) {
    return api.post("/projects", {
        title,
        description,
        date,
        semester,
        departmentId,
        supervisorId,
    });
}

/**
 * Update an existing project by its ID.
 * Matches backend route: PUT /projects/:projectId
 *
 * @function updateProject
 * @param {number|string} projectId - Unique project ID.
 * @param {Object} params - Updated fields.
 * @param {string} [params.title] - Project title.
 * @param {string} [params.description] - Description text.
 * @param {string|Date} [params.date]
 * @param {'Winter'|'Spring'|'Summer'|'Autumn'} [params.semester]
 * @param {number} [params.departmentId]
 * @param {number} [params.supervisorId]
 * @param {number} [params.grade]
 * @param {number} [params.imageId]
 * @param {boolean} [params.available]
 * @returns {Promise<AxiosResponse>} Axios full response.
 */
export async function updateProject(
    projectId,
    {
        title,
        description,
        date,
        semester,
        departmentId,
        supervisorId,
        grade,
        imageId,
        available,
    }
) {
    return api.put(`/projects/${projectId}`, {
        title,
        description,
        date,
        semester,
        departmentId,
        supervisorId,
        grade,
        imageId,
        available,
    });
}

/**
 * Delete a project by its ID.
 *
 * @function deleteProject
 * @param {number|string} projectId - Unique project ID.
 * @returns {Promise<AxiosResponse>} Axios full response.
 */
export async function deleteProject(projectId) {
    return api.delete(`/projects/${projectId}`);
}

/**
 * Search for projects with keyword and advanced filters.
 * Matches backend route: GET /projects/search
 *
 * @function searchProjects
 * @param {Object} [options={}] - Search filters.
 * @param {string} [options.text=""] - Search text.
 * @param {number} [options.offset=0] - Pagination offset.
 * @param {number} [options.limit=20] - Pagination limit.
 * @returns {Promise<AxiosResponse>} Axios full response.
 */
export async function searchProjects({
    text = '',
    offset = 0,
    limit = 20,
} = {}) {
    return api.get("/projects/search", {
        params: {
            text,
            offset,
            limit,
        },
    });
}