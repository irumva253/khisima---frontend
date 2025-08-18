import { apiSlice } from "./apiSlice";
import { API_ENDPOINTS } from "../constants";

export const serviceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getServices: builder.query({
      query: () => API_ENDPOINTS.SERVICES.GET_ALL,
    }),
    getService: builder.query({
      query: (id) => API_ENDPOINTS.SERVICES.GET_BY_ID(id),
    }),
    createService: builder.mutation({
      query: (data) => ({
        url: API_ENDPOINTS.SERVICES.CREATE,
        method: "POST",
        body: data,
      }),
    }),
    updateService: builder.mutation({
      query: ({ id, ...data }) => ({
        url: API_ENDPOINTS.SERVICES.UPDATE(id),
        method: "PUT",
        body: data,
      }),
    }),
    deleteService: builder.mutation({
      query: (id) => ({
        url: API_ENDPOINTS.SERVICES.DELETE(id),
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetServicesQuery,
  useGetServiceQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = serviceApiSlice;
