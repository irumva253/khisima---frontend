import { apiSlice } from './apiSlice';

const CAREERS_URL = '/api/careers';

export const careerApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Submit career application (Public)
    submitCareerApplication: builder.mutation({
      query: (formData) => ({
        url: `${CAREERS_URL}/apply`,
        method: 'POST',
        body: formData,
        // Don't set Content-Type header, let browser handle it for FormData
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
          url: `${CAREERS_URL}/applications?${queryParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['CareerApplication'],
    }),

    // Get application by ID (Admin)
    getCareerApplicationById: builder.query({
      query: (id) => ({
        url: `${CAREERS_URL}/applications/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'CareerApplication', id }],
    }),

    // Update application status (Admin)
    updateCareerApplicationStatus: builder.mutation({
      query: ({ id, ...statusData }) => ({
        url: `${CAREERS_URL}/applications/${id}/status`,
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
        url: `${CAREERS_URL}/applications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CareerApplication', 'CareerStats'],
    }),

    // Get application statistics (Admin)
    getCareerStats: builder.query({
      query: () => ({
        url: `${CAREERS_URL}/stats`,
        method: 'GET',
      }),
      providesTags: ['CareerStats'],
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
} = careerApiSlice;