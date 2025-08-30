/* eslint-disable no-unused-vars */
import { apiSlice } from './apiSlice';
import { API_ENDPOINTS } from '../constants';

export const careerApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Submit career application (Public)
    submitCareerApplication: builder.mutation({
      query: (formData) => ({
        url: `${API_ENDPOINTS.CAREERS.BASE}/apply`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['CareerApplication'],
    }),

    // Get all applications (Admin)
    getCareerApplications: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        if (params.status && params.status !== 'all') queryParams.append('status', params.status);
        if (params.position && params.position !== 'all') queryParams.append('position', params.position);
        if (params.sortBy) queryParams.append('sortBy', params.sortBy);
        if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

        return {
          url: `${API_ENDPOINTS.CAREERS.BASE}/applications?${queryParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['CareerApplication'],
    }),

    // Get application by ID (Admin)
    getCareerApplicationById: builder.query({
      query: (id) => ({
        url: `${API_ENDPOINTS.CAREERS.BASE}/applications/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'CareerApplication', id }],
    }),

    // Update application status (Admin)
    updateCareerApplicationStatus: builder.mutation({
      query: ({ id, ...statusData }) => ({
        url: `${API_ENDPOINTS.CAREERS.BASE}/applications/${id}/status`,
        method: 'PUT',
        body: statusData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'CareerApplication', id },
        'CareerApplication',
        'CareerStats'
      ],
    }),

    // Delete application (Admin)
    deleteCareerApplication: builder.mutation({
      query: (id) => ({
        url: `${API_ENDPOINTS.CAREERS.BASE}/applications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CareerApplication', 'CareerStats'],
    }),

    // Get application statistics (Admin)
    getCareerStats: builder.query({
      query: () => ({
        url: `${API_ENDPOINTS.CAREERS.BASE}/stats`,
        method: 'GET',
      }),
      providesTags: ['CareerStats'],
    }),

    // Get signed download URL for resume (Admin) - FIXED PATH
    getResumeDownloadUrl: builder.mutation({
      query: (id) => ({
        url: `${API_ENDPOINTS.CAREERS.BASE}/applications/${id}/download`, // ADDED /applications/
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useSubmitCareerApplicationMutation,
  useGetCareerApplicationsQuery,
  useGetCareerApplicationByIdQuery,
  useUpdateCareerApplicationStatusMutation,
  useDeleteCareerApplicationMutation,
  useGetCareerStatsQuery,
  useGetResumeDownloadUrlMutation,
} = careerApiSlice;