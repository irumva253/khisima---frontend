// src/features/partners/partnerApiSlice.js
import { apiSlice } from './apiSlice';
import { API_ENDPOINTS } from '../constants';

export const partnerApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET all partners
    getPartners: builder.query({
      query: () => API_ENDPOINTS.PARTNERS.GET_ALL,
      // Transform backend response to always return an array
      transformResponse: (response) => {
        console.log('Partners API response:', response);
        return Array.isArray(response) ? response : response.partners || [];
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
