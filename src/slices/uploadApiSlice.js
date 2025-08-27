import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ENDPOINTS } from "../constants";

export const uploadApi = createApi({
  reducerPath: "uploadApi",
  baseQuery: fetchBaseQuery({ 
    baseUrl: import.meta.env.VITE_APP_API_BASE_URL,
    credentials: "include", // Add this if you need to send cookies
  }),
  endpoints: (builder) => ({
    getPresignedUrl: builder.mutation({
      query: ({ fileName, contentType }) => ({
        url: API_ENDPOINTS.S3.UPLOAD,
        method: "POST",
        body: { fileName, contentType },
        // Add headers if needed
        headers: {
          "Content-Type": "application/json",
        },
      }),
      transformErrorResponse: (response) => ({
        message: response?.data?.message || "Failed to get presigned URL",
        status: response?.status,
      }),
    }),
    deleteFile: builder.mutation({
      query: ({ key }) => ({
        url: API_ENDPOINTS.S3.DELETE,
        method: "DELETE",
        body: { key },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      transformErrorResponse: (response) => ({
        message: response?.data?.message || "Failed to delete file",
        status: response?.status,
      }),
    }),
  }),
});

export const { useGetPresignedUrlMutation, useDeleteFileMutation } = uploadApi;