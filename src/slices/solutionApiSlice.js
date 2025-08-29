import { apiSlice } from "./apiSlice";
import { API_ENDPOINTS } from "../constants";

export const solutionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all solutions
    getSolutions: builder.query({
      query: () => API_ENDPOINTS.SOLUTIONS.GET_ALL,
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: "Solution", id: _id })),
              { type: "Solution", id: "LIST" },
            ]
          : [{ type: "Solution", id: "LIST" }],
    }),

    // Get a single solution by ID
    getSolution: builder.query({
      query: (id) => API_ENDPOINTS.SOLUTIONS.GET_BY_ID(id),
      providesTags: (result, error, id) => [{ type: "Solution", id }],
    }),

    // Get solutions by category
    getSolutionsByCategory: builder.query({
      query: (categoryId) => API_ENDPOINTS.SOLUTIONS.GET_BY_CATEGORY(categoryId),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: "Solution", id: _id })),
              { type: "Solution", id: "LIST" },
            ]
          : [{ type: "Solution", id: "LIST" }],
    }),

    // Get all categories
    getSolutionCategories: builder.query({
      query: () => API_ENDPOINTS.SOLUTIONS.GET_CATEGORIES,
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({
                type: "SolutionCategory",
                id: _id,
              })),
              { type: "SolutionCategory", id: "LIST" },
            ]
          : [{ type: "SolutionCategory", id: "LIST" }],
    }),

    // Get single category by ID
    getSolutionCategory: builder.query({
      query: (id) => API_ENDPOINTS.SOLUTIONS.GET_CATEGORY_BY_ID(id),
      providesTags: (result, error, id) => [{ type: "SolutionCategory", id }],
    }),

    // Mutations
    createSolution: builder.mutation({
      query: (data) => ({
        url: API_ENDPOINTS.SOLUTIONS.CREATE,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Solution", id: "LIST" }],
    }),

    updateSolution: builder.mutation({
      query: ({ id, ...data }) => ({
        url: API_ENDPOINTS.SOLUTIONS.UPDATE(id),
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Solution", id }],
    }),

    deleteSolution: builder.mutation({
      query: (id) => ({
        url: API_ENDPOINTS.SOLUTIONS.DELETE(id),
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Solution", id }],
    }),
  }),
});

export const {
  useGetSolutionsQuery,
  useGetSolutionQuery,
  useGetSolutionsByCategoryQuery,
  useGetSolutionCategoriesQuery,
  useGetSolutionCategoryQuery,
  useCreateSolutionMutation,
  useUpdateSolutionMutation,
  useDeleteSolutionMutation,
} = solutionApiSlice;
