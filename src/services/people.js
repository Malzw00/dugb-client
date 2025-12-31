/**
 * People Services
 * ---------------
 * Provides API request functions for:
 * - Supervisors
 * - Students
 */

import api from "@services/api";

/* ========================================================================== */
/*                                SUPERVISORS                                  */
/* ========================================================================== */

/**
 * Get all supervisors with optional pagination.
 *
 * @function getSupervisors
 * @param {Object} params
 * @param {number} [params.offset]
 * @param {number} [params.limit]
 * @returns {Promise<AxiosResponse>}
 */
export function getSupervisors(params = {}) {
    return api.get("/supervisors", { params });
}


/**
 * search for student.
 *
 * @function searchForSupervisors
 * @returns {Promise<AxiosResponse>}
 */
export function searchForSupervisors({ text, limit, offset }) {
    return api.get(`/supervisors/search`, {
        params: { text, limit, offset }
    });
}


/**
 * Get a supervisor by ID.
 *
 * @function getSupervisorById
 * @param {string|number} supervisorId
 * @returns {Promise<AxiosResponse>}
 */
export function getSupervisorById(supervisorId) {
    return api.get(`/supervisors/${supervisorId}`);
}

/**
 * Get projects supervised by a supervisor.
 *
 * @function getSupervisorProjects
 * @param {string|number} supervisorId
 * @returns {Promise<AxiosResponse>}
 */
export function getSupervisorProjects(supervisorId) {
    return api.get(`/supervisors/${supervisorId}/projects`);
}

/**
 * Create a supervisor.
 *
 * @function createSupervisor
 * @param {Object} data
 * @returns {Promise<AxiosResponse>}
 */
export function createSupervisor(data) {
    return api.post("/supervisors", data);
}

/**
 * Update a supervisor by ID.
 *
 * @function updateSupervisor
 * @param {string|number} supervisorId
 * @param {Object} data
 * @returns {Promise<AxiosResponse>}
 */
export function updateSupervisor(supervisorId, data) {
    return api.put(`/supervisors/${supervisorId}`, data);
}

/**
 * Delete a supervisor by ID.
 *
 * @function deleteSupervisor
 * @param {string|number} supervisorId
 * @returns {Promise<AxiosResponse>}
 */
export function deleteSupervisor(supervisorId) {
    return api.delete(`/supervisors/${supervisorId}`);
}

/* ------------------------ Supervisor Account Linking ----------------------- */

/**
 * Get linked account info of a supervisor.
 *
 * @function getSupervisorAccount
 * @param {string|number} supervisorId
 * @returns {Promise<AxiosResponse>}
 */
export function getSupervisorAccount(supervisorId) {
    return api.get(`/supervisors/${supervisorId}/account`);
}

/**
 * Link supervisor to an account.
 *
 * @function addSupervisorAccount
 * @param {string|number} supervisorId
 * @param {Object} data
 * @param {number} data.accountId
 * @returns {Promise<AxiosResponse>}
 */
export function addSupervisorAccount(supervisorId, data) {
    return api.post(`/supervisors/${supervisorId}/account`, data);
}

/**
 * Remove linked account of a supervisor.
 *
 * @function removeSupervisorAccount
 * @param {string|number} supervisorId
 * @returns {Promise<AxiosResponse>}
 */
export function removeSupervisorAccount(supervisorId) {
    return api.delete(`/supervisors/${supervisorId}/account`);
}

/* ========================================================================== */
/*                                   STUDENTS                                  */
/* ========================================================================== */

/**
 * Get all students with pagination.
 *
 * @function getStudents
 * @param {Object} params
 * @param {number} [params.offset]
 * @param {number} [params.limit]
 * @param {number} [params.departmentId]
 * @returns {Promise<AxiosResponse>}
 */
export function getStudents(params = {}) {
    return api.get("/students", { params });
}

/**
 * search for student.
 *
 * @function searchForStudents
 * @returns {Promise<AxiosResponse>}
 */
export function searchForStudents({ text, limit, offset }) {
    return api.get(`/students/search`, {
        params: { text, limit, offset }
    });
}

/**
 * Get a student by ID.
 *
 * @function getStudentById
 * @param {string|number} studentId
 * @returns {Promise<AxiosResponse>}
 */
export function getStudentById(studentId) {
    return api.get(`/students/${studentId}`);
}

/**
 * Create a new student.
 *
 * @function createStudent
 * @param {Object} data
 * @returns {Promise<AxiosResponse>}
 */
export function createStudent(data) {
    return api.post("/students", data);
}

/**
 * Update a student by ID.
 *
 * @function updateStudent
 * @param {string|number} studentId
 * @param {Object} data
 * @returns {Promise<AxiosResponse>}
 */
export function updateStudent(studentId, data) {
    return api.put(`/students/${studentId}`, data);
}

/**
 * Delete a student.
 *
 * @function deleteStudent
 * @param {string|number} studentId
 * @returns {Promise<AxiosResponse>}
 */
export function deleteStudent(studentId) {
    return api.delete(`/students/${studentId}`);
}

/* ------------------------- Student Account Linking ------------------------- */

/**
 * Get linked account of a student.
 *
 * @function getStudentAccount
 * @param {string|number} studentId
 * @returns {Promise<AxiosResponse>}
 */
export function getStudentAccount(studentId) {
    return api.get(`/students/${studentId}/account`);
}

/**
 * Link student to an account.
 *
 * @function addStudentAccount
 * @param {string|number} studentId
 * @param {Object} data
 * @param {number} data.accountId
 * @returns {Promise<AxiosResponse>}
 */
export function addStudentAccount(studentId, data) {
    return api.post(`/students/${studentId}/account`, data);
}

/**
 * Unlink student from an account.
 *
 * @function removeStudentAccount
 * @param {string|number} studentId
 * @returns {Promise<AxiosResponse>}
 */
export function removeStudentAccount(studentId) {
    return api.delete(`/students/${studentId}/account`);
}