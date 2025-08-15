/* eslint-disable no-undef */
export const BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:5000' 
  : '';

export const USERS_URL = '/api/users';
export const AUTH_URL = '/api/auth';

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
  }
};
