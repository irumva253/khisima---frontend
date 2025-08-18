import { apiSlice } from "./apiSlice";
import { API_ENDPOINTS } from "../constants";

export const serviceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all services
    getServices: builder.query({
      query: () => API_ENDPOINTS.SERVICES.GET_ALL,
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: "Service", id: _id })),
              { type: "Service", id: "LIST" },
            ]
          : [{ type: "Service", id: "LIST" }],
    }),

    // Get a single service by ID
    getService: builder.query({
      query: (id) => API_ENDPOINTS.SERVICES.GET_BY_ID(id),
      providesTags: (result, error, id) => [{ type: "Service", id }],
    }),

    // Get services by category
    getServicesByCategory: builder.query({
      query: (categoryId) => API_ENDPOINTS.SERVICES.GET_BY_CATEGORY(categoryId),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: "Service", id: _id })),
              { type: "Service", id: "LIST" },
            ]
          : [{ type: "Service", id: "LIST" }],
    }),

    // Get all categories
    getServiceCategories: builder.query({
      query: () => API_ENDPOINTS.SERVICES.GET_CATEGORIES,
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({
                type: "ServiceCategory",
                id: _id,
              })),
              { type: "ServiceCategory", id: "LIST" },
            ]
          : [{ type: "ServiceCategory", id: "LIST" }],
    }),

    // Get single category by ID
    getServiceCategory: builder.query({
      query: (id) => API_ENDPOINTS.SERVICES.GET_CATEGORY_BY_ID(id),
      providesTags: (result, error, id) => [{ type: "ServiceCategory", id }],
    }),

    // Mutations
    createService: builder.mutation({
      query: (data) => ({
        url: API_ENDPOINTS.SERVICES.CREATE,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Service", id: "LIST" }],
    }),

    updateService: builder.mutation({
      query: ({ id, ...data }) => ({
        url: API_ENDPOINTS.SERVICES.UPDATE(id),
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Service", id }],
    }),

    deleteService: builder.mutation({
      query: (id) => ({
        url: API_ENDPOINTS.SERVICES.DELETE(id),
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Service", id }],
    }),
  }),
});

export const {
  useGetServicesQuery,
  useGetServiceQuery,
  useGetServicesByCategoryQuery,
  useGetServiceCategoriesQuery,
  useGetServiceCategoryQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = serviceApiSlice;
