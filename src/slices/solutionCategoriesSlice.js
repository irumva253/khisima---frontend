import { apiSlice } from "./apiSlice";
import { API_ENDPOINTS } from "../constants";

export const solutionCategoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSolutionCategories: builder.query({
      query: () => API_ENDPOINTS.SOLUTION_CATEGORIES.GET_ALL,
    }),
    getSolutionCategory: builder.query({
      query: (id) => API_ENDPOINTS.SOLUTION_CATEGORIES.GET_BY_ID(id),
    }),
    createSolutionCategory: builder.mutation({
      query: (data) => ({
        url: API_ENDPOINTS.SOLUTION_CATEGORIES.CREATE,
        method: "POST",
        body: data,
      }),
    }),
    updateSolutionCategory: builder.mutation({
      query: ({ id, ...data }) => ({
        url: API_ENDPOINTS.SOLUTION_CATEGORIES.UPDATE(id),
        method: "PUT",
        body: data,
      }),
    }),
    deleteSolutionCategory: builder.mutation({
      query: (id) => ({
        url: API_ENDPOINTS.SOLUTION_CATEGORIES.DELETE(id),
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetSolutionCategoriesQuery,
  useGetSolutionCategoryQuery,
  useCreateSolutionCategoryMutation,
  useUpdateSolutionCategoryMutation,
  useDeleteSolutionCategoryMutation,
} = solutionCategoryApiSlice;
