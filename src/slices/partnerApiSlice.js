import { apiSlice } from './apiSlice';
import { API_ENDPOINTS } from "../constants";

export const partnerApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPartners: builder.query({
      query: () => ({
        url: API_ENDPOINTS.PARTNERS.GET_ALL,
      }),
      providesTags: ['Partner'],
    }),
    createPartner: builder.mutation({
      query: (data) => ({
        url: API_ENDPOINTS.PARTNERS.CREATE,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Partner'],
    }),
    updatePartner: builder.mutation({
      query: (data) => ({
        url: API_ENDPOINTS.PARTNERS.UPDATE(data._id),
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Partner'],
    }),
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