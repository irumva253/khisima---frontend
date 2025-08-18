import { apiSlice } from "./apiSlice";
import { API_ENDPOINTS } from "../constants";

export const serviceCategoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getServiceCategories: builder.query({
      query: () => API_ENDPOINTS.SERVICE_CATEGORIES.GET_ALL,
    }),
    getServiceCategory: builder.query({
      query: (id) => API_ENDPOINTS.SERVICE_CATEGORIES.GET_BY_ID(id),
    }),
    createServiceCategory: builder.mutation({
      query: (data) => ({
        url: API_ENDPOINTS.SERVICE_CATEGORIES.CREATE,
        method: "POST",
        body: data,
      }),
    }),
    updateServiceCategory: builder.mutation({
      query: ({ id, ...data }) => ({
        url: API_ENDPOINTS.SERVICE_CATEGORIES.UPDATE(id),
        method: "PUT",
        body: data,
      }),
    }),
    deleteServiceCategory: builder.mutation({
      query: (id) => ({
        url: API_ENDPOINTS.SERVICE_CATEGORIES.DELETE(id),
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetServiceCategoriesQuery,
  useGetServiceCategoryQuery,
  useCreateServiceCategoryMutation,
  useUpdateServiceCategoryMutation,
  useDeleteServiceCategoryMutation,
} = serviceCategoryApiSlice;
