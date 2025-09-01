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
export const SOLUTION_CATEGORIES_URL = "/api/solution-categories";
export const SERVICES_URL = "/api/services";
export const SOLUTIONS_URL = "/api/solutions";
export const PARTNERS_URL = "/api/partners";
export const CAREERS_URL = "/api/careers";
export const QUOTES_URL = "/api/quotes";
export const S3_URL = "/api/s3";

export const API_ENDPOINTS = {
  USERS: { BASE: USERS_URL, REGISTER: `${AUTH_URL}/register`, LOGIN: `${AUTH_URL}/login`, LOGOUT: `${AUTH_URL}/logout`, PROFILE: `${AUTH_URL}/profile`, FORGOT_PASSWORD: `${AUTH_URL}/forgot-password`, RESET_PASSWORD: `${AUTH_URL}/reset-password/:token`, GET_ALL: USERS_URL, GET_BY_ID: (id) => `${USERS_URL}/${id}`, UPDATE: (id) => `${USERS_URL}/${id}`, DELETE: (id) => `${USERS_URL}/${id}` },
  NOTIFICATIONS: { BASE: NOTIFICATIONS_URL, CONTACT: `${NOTIFICATIONS_URL}/contact`, GET_ALL: NOTIFICATIONS_URL, GET_BY_ID: (id) => `${NOTIFICATIONS_URL}/${id}`, UPDATE: (id) => `${NOTIFICATIONS_URL}/${id}`, DELETE: (id) => `${NOTIFICATIONS_URL}/${id}`, BULK_UPDATE: `${NOTIFICATIONS_URL}/bulk/update`, BULK_DELETE: `${NOTIFICATIONS_URL}/bulk/delete`, MARK_READ: (id) => `${NOTIFICATIONS_URL}/${id}/mark-read`, MARK_RESPONDED: (id) => `${NOTIFICATIONS_URL}/${id}/respond`, STATS: `${NOTIFICATIONS_URL}/dashboard`, EXPORT: `${NOTIFICATIONS_URL}/export` },
  SERVICE_CATEGORIES: { BASE: SERVICE_CATEGORIES_URL, GET_ALL: SERVICE_CATEGORIES_URL, GET_BY_ID: (id) => `${SERVICE_CATEGORIES_URL}/${id}`, CREATE: SERVICE_CATEGORIES_URL, UPDATE: (id) => `${SERVICE_CATEGORIES_URL}/${id}`, DELETE: (id) => `${SERVICE_CATEGORIES_URL}/${id}` },
  SOLUTION_CATEGORIES: { BASE: SOLUTION_CATEGORIES_URL, GET_ALL: SOLUTION_CATEGORIES_URL, GET_BY_ID: (id) => `${SOLUTION_CATEGORIES_URL}/${id}`, CREATE: SOLUTION_CATEGORIES_URL, UPDATE: (id) => `${SOLUTION_CATEGORIES_URL}/${id}`, DELETE: (id) => `${SOLUTION_CATEGORIES_URL}/${id}` },
  SERVICES: { BASE: SERVICES_URL, GET_ALL: SERVICES_URL, GET_BY_ID: (id) => `${SERVICES_URL}/${id}`, CREATE: SERVICES_URL, UPDATE: (id) => `${SERVICES_URL}/${id}`, DELETE: (id) => `${SERVICES_URL}/${id}`, GET_BY_CATEGORY: (categoryId) => `${SERVICES_URL}/category/${categoryId}`, GET_CATEGORIES: `${SERVICES_URL}/categories` },
  SOLUTIONS: { BASE: SOLUTIONS_URL, GET_ALL: SOLUTIONS_URL, GET_BY_ID: (id) => `${SOLUTIONS_URL}/${id}`, CREATE: SOLUTIONS_URL, UPDATE: (id) => `${SOLUTIONS_URL}/${id}`, DELETE: (id) => `${SOLUTIONS_URL}/${id}`, GET_BY_CATEGORY: (categoryId) => `${SOLUTIONS_URL}/category/${categoryId}`, GET_CATEGORIES: `${SOLUTIONS_URL}/categories` },
  S3: { UPLOAD: `${S3_URL}/upload`, DELETE: `${S3_URL}/delete` },
  PARTNERS: { BASE: PARTNERS_URL, GET_ALL: PARTNERS_URL, GET_BY_ID: (id) => `${PARTNERS_URL}/${id}`, CREATE: PARTNERS_URL, UPDATE: (id) => `${PARTNERS_URL}/${id}`, DELETE: (id) => `${PARTNERS_URL}/${id}` },
  CAREERS: {
    BASE: CAREERS_URL,
    APPLY: `${CAREERS_URL}/apply`,
    APPLICATIONS: {
      BASE: `${CAREERS_URL}/applications`,
      GET_ALL: `${CAREERS_URL}/applications`,
      GET_BY_ID: (id) => `${CAREERS_URL}/applications/${id}`,
      UPDATE: (id) => `${CAREERS_URL}/applications/${id}`,
      DELETE: (id) => `${CAREERS_URL}/applications/${id}`,
      STATUS: (id) => `${CAREERS_URL}/applications/${id}/status`,
      DOWNLOAD: (id) => `${CAREERS_URL}/applications/${id}/download`,
      DOWNLOAD_PROXY: (id) => `${CAREERS_URL}/applications/${id}/download-proxy`,
    },
    STATS: `${CAREERS_URL}/stats`,
},
//  QUOTES: { BASE: QUOTES_URL, GET_ALL: QUOTES_URL, GET_BY_ID: (id) => `${QUOTES_URL}/${id}`, CREATE: QUOTES_URL, UPDATE: (id) => `${QUOTES_URL}/${id}`, DELETE: (id) => `${QUOTES_URL}/${id}` }

  QUOTES: { 
    BASE: QUOTES_URL,
    GET_ALL: QUOTES_URL,
    GET_BY_ID: (id) => `${QUOTES_URL}/${id}`,
    CREATE: QUOTES_URL,  // This is the submit endpoint
    UPDATE: (id) => `${QUOTES_URL}/${id}`,
    DELETE: (id) => `${QUOTES_URL}/${id}`,
    SUBMIT: QUOTES_URL,  // alias for CREATE
    STATS: `${QUOTES_URL}/stats`,
  },
   RESOURCES: {
    BASE: '/api/resources',
    CREATE: '/api/resources',
    GET_BY_ID: (id) => `/api/resources/${id}`,
    UPDATE: (id) => `/api/resources/${id}`,
    DELETE: (id) => `/api/resources/${id}`,
    STATS: '/api/resources/stats/summary'
  }
};