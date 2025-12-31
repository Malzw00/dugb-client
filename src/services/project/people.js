/**
 * Project People Services
 * -----------------------
 * This module provides functions for interacting with project-people endpoints:
 *
 * Endpoints:
 * - GET    /projects/:projectId/people/students
 * - POST   /projects/:projectId/people/students
 * - DELETE /projects/:projectId/people/students/:studentId
 *
 * - GET    /projects/:projectId/people/supervisor
 * - PUT    /projects/:projectId/people/supervisor/:supervisorId
 * - DELETE /projects/:projectId/people/supervisor/:supervisorId
 */

import api from "@services/api";

/* ============================================================
 * STUDENTS
 * ============================================================ */

/**
 * Get all students assigned to a specific project.
 *
 * @function getProjectStudents
 * @param {string|number} projectId - Project ID.
 * @returns {Promise<AxiosResponse>}
 */
export async function getProjectStudents(projectId) {
    return api.get(`/projects/${projectId}/people/students`, {
        params: {
            projectId
        } 
    });
}

/**
 * Add a student to a specific project.
 *
 * @function addProjectStudent
 * @returns {Promise<AxiosResponse>}
 */
export async function addProjectStudent({ projectId, studentId }) {
    return api.post(`/projects/${projectId}/people/students`, {
        projectId,
        studentId,
    });
}

/**
 * Remove a student from a project.
 *
 * @function removeProjectStudent
 * @param {Object} params .
 * @param {string|number} params.projectId - Project ID.
 * @param {string|number} params.studentId - Student ID to remove.
 * @returns {Promise<AxiosResponse>}
 */
export async function removeProjectStudent({ projectId, studentId }) {
    return api.delete(`/projects/${projectId}/people/students/${studentId}`, {
        params: {
            studentId, projectId
        }
    });
}

/* ============================================================
 * SUPERVISOR
 * ============================================================ */

/**
 * Get supervisor assigned to the project.
 *
 * @function getProjectSupervisor
 * @param {string|number} projectId - Project ID.
 * @returns {Promise<AxiosResponse>}
 */
export async function getProjectSupervisor(projectId) {
    return api.get(`/projects/${projectId}/people/supervisor`);
}

/**
 * Set or update the supervisor of a project.
 *
 * @function setProjectSupervisor
 * @returns {Promise<AxiosResponse>}
 */
export async function setProjectSupervisor({ projectId, supervisorId }) {
    return api.put(`/projects/${projectId}/people/supervisor/${supervisorId}`, { projectId, supervisorId });
}

/**
 * Remove supervisor from a project.
 *
 * @function removeProjectSupervisor
 * @param {string|number} projectId - Project ID.
 * @param {string|number} supervisorId - Supervisor ID to remove.
 * @returns {Promise<AxiosResponse>}
 */
export async function removeProjectSupervisor({ projectId, supervisorId }) {
    return api.delete(`/projects/${projectId}/people/supervisor/${supervisorId}`);
}