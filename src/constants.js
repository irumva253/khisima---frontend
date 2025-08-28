/* eslint-disable no-undef */

// Backend API
export const BASE_URL = import.meta.env.VITE_APP_API_BASE_URL || "http://localhost:5000";
// Production example:
// export const BASE_URL = "https://your-production-backend.com";

// S3
// For Tigris, the URL format is: https://{bucket-name}.t3.storage.dev
export const S3_BASE_URL = `https://${import.meta.env.VITE_PUBLIC_S3_BUCKET_NAME_IMAGES}.t3.storage.dev`;

// API routes
export const USERS_URL = "/api/users";
export const AUTH_URL = "/api/auth";
export const NOTIFICATIONS_URL = "/api/notifications";
export const SERVICE_CATEGORIES_URL = "/api/service-categories";
export const SERVICES_URL = "/api/services";
export const PARTNERS_URL = "/api/partners";
export const S3_URL = "/api/s3"; // Add this line

export const API_ENDPOINTS = {
  USERS: { BASE: USERS_URL, REGISTER: `${AUTH_URL}/register`, LOGIN: `${AUTH_URL}/login`, LOGOUT: `${AUTH_URL}/logout`, PROFILE: `${AUTH_URL}/profile`, FORGOT_PASSWORD: `${AUTH_URL}/forgot-password`, RESET_PASSWORD: `${AUTH_URL}/reset-password/:token`, GET_ALL: USERS_URL, GET_BY_ID: (id) => `${USERS_URL}/${id}`, UPDATE: (id) => `${USERS_URL}/${id}`, DELETE: (id) => `${USERS_URL}/${id}` },
  NOTIFICATIONS: { BASE: NOTIFICATIONS_URL, CONTACT: `${NOTIFICATIONS_URL}/contact`, GET_ALL: NOTIFICATIONS_URL, GET_BY_ID: (id) => `${NOTIFICATIONS_URL}/${id}`, UPDATE: (id) => `${NOTIFICATIONS_URL}/${id}`, DELETE: (id) => `${NOTIFICATIONS_URL}/${id}`, BULK_UPDATE: `${NOTIFICATIONS_URL}/bulk/update`, BULK_DELETE: `${NOTIFICATIONS_URL}/bulk/delete`, MARK_READ: (id) => `${NOTIFICATIONS_URL}/${id}/mark-read`, MARK_RESPONDED: (id) => `${NOTIFICATIONS_URL}/${id}/respond`, STATS: `${NOTIFICATIONS_URL}/dashboard`, EXPORT: `${NOTIFICATIONS_URL}/export` },
  SERVICE_CATEGORIES: { BASE: SERVICE_CATEGORIES_URL, GET_ALL: SERVICE_CATEGORIES_URL, GET_BY_ID: (id) => `${SERVICE_CATEGORIES_URL}/${id}`, CREATE: SERVICE_CATEGORIES_URL, UPDATE: (id) => `${SERVICE_CATEGORIES_URL}/${id}`, DELETE: (id) => `${SERVICE_CATEGORIES_URL}/${id}` },
  SERVICES: { BASE: SERVICES_URL, GET_ALL: SERVICES_URL, GET_BY_ID: (id) => `${SERVICES_URL}/${id}`, CREATE: SERVICES_URL, UPDATE: (id) => `${SERVICES_URL}/${id}`, DELETE: (id) => `${SERVICES_URL}/${id}`, GET_BY_CATEGORY: (categoryId) => `${SERVICES_URL}/category/${categoryId}`, GET_CATEGORIES: `${SERVICES_URL}/categories` },
  S3: { UPLOAD: `${S3_URL}/upload`, DELETE: `${S3_URL}/delete` }, // Fix this line
  PARTNERS: { BASE: PARTNERS_URL, GET_ALL: PARTNERS_URL, GET_BY_ID: (id) => `${PARTNERS_URL}/${id}`, CREATE: PARTNERS_URL, UPDATE: (id) => `${PARTNERS_URL}/${id}`, DELETE: (id) => `${PARTNERS_URL}/${id}` }
};