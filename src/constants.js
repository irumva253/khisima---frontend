/* eslint-disable no-undef */
export const BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:5000' 
  : '';

export const USERS_URL = '/api/users';
export const AUTH_URL = '/api/auth';
export const NOTIFICATIONS_URL = '/api/notifications';

export const API_ENDPOINTS = {
  USERS: {
    BASE: USERS_URL,
    REGISTER: `${AUTH_URL}/register`,
    LOGIN: `${AUTH_URL}/login`,
    LOGOUT: `${AUTH_URL}/logout`,
    PROFILE: `${AUTH_URL}/profile`,
    FORGOT_PASSWORD: `${AUTH_URL}/forgot-password`,
    RESET_PASSWORD: `${AUTH_URL}/reset-password/:token`,
    GET_ALL: USERS_URL,
    GET_BY_ID: (id) => `${USERS_URL}/${id}`,
    UPDATE: (id) => `${USERS_URL}/${id}`,
    DELETE: (id) => `${USERS_URL}/${id}`
  },
  NOTIFICATIONS: {
    BASE: NOTIFICATIONS_URL,
    CONTACT: `${NOTIFICATIONS_URL}/contact`,
    GET_ALL: NOTIFICATIONS_URL,
    GET_BY_ID: (id) => `${NOTIFICATIONS_URL}/${id}`,
    UPDATE: (id) => `${NOTIFICATIONS_URL}/${id}`,
    DELETE: (id) => `${NOTIFICATIONS_URL}/${id}`,
    BULK_UPDATE: `${NOTIFICATIONS_URL}/bulk/update`,
    BULK_DELETE: `${NOTIFICATIONS_URL}/bulk/delete`,
    MARK_READ: (id) => `${NOTIFICATIONS_URL}/${id}/mark-read`,
    MARK_RESPONDED: (id) => `${NOTIFICATIONS_URL}/${id}/respond`,
    STATS: `${NOTIFICATIONS_URL}/dashboard`,
    EXPORT: `${NOTIFICATIONS_URL}/export`
  }
};