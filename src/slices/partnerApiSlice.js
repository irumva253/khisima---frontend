// src/features/partners/partnerApiSlice.js
import { apiSlice } from './apiSlice';
import { API_ENDPOINTS } from '../constants';

export const partnerApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET all partners
    getPartners: builder.query({
      query: () => API_ENDPOINTS.PARTNERS.GET_ALL,
      // Enhanced transformResponse to handle different response formats
      transformResponse: (response) => {
        console.log('Partners API response:', response);
        
        // Handle different possible response formats
        if (Array.isArray(response)) {
          return response;
        } else if (response && Array.isArray(response.partners)) {
          return response.partners;
        } else if (response && response.data && Array.isArray(response.data)) {
          return response.data;
        } else {
          console.warn('Unexpected API response format:', response);
          return []; // Return empty array as fallback
        }
      },
      // Add error handling transform
      transformErrorResponse: (response) => {
        console.error('Partners API error:', response);
        return response;
      },
      providesTags: ['Partner'],
    }),

    // CREATE a new partner
    createPartner: builder.mutation({
      query: (data) => ({
        url: API_ENDPOINTS.PARTNERS.CREATE,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Partner'],
    }),

    // UPDATE an existing partner
    updatePartner: builder.mutation({
      query: (data) => ({
        url: API_ENDPOINTS.PARTNERS.UPDATE(data._id),
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Partner'],
    }),

    // DELETE a partner
    deletePartner: builder.mutation({
      query: (id) => ({
        url: API_ENDPOINTS.PARTNERS.DELETE(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['Partner'],
    }),
  }),
});

export const {
  useGetPartnersQuery,
  useCreatePartnerMutation,
  useUpdatePartnerMutation,
  useDeletePartnerMutation,
} = partnerApiSlice;
