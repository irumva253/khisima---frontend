/* eslint-disable no-unused-vars */
import { apiSlice } from './apiSlice';
import { API_ENDPOINTS } from '../constants';

export const workplaceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get All Workplaces (Public)
    getWorkplaces: builder.query({
      query: (params = {}) => {
        const queryString = new URLSearchParams();
        
        // Add all parameters to query string
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            if (Array.isArray(value)) {
              value.forEach(v => queryString.append(key, v));
            } else {
              queryString.append(key, value);
            }
          }
        });
        
        const queryStr = queryString.toString();
        return {
          url: `${API_ENDPOINTS.WORKPLACES.BASE}${queryStr ? `?${queryStr}` : ''}`
        };
      },
      providesTags: (result, error, params) => [
        'Workplace',
        ...(result?.data || []).map(workplace => ({ type: 'Workplace', id: workplace._id }))
      ],
      keepUnusedDataFor: 60
    }),

    // Get Single Workplace (Public)
    getWorkplaceById: builder.query({
      query: (id) => ({
        url: API_ENDPOINTS.WORKPLACES.GET_BY_ID(id)
      }),
      providesTags: (result, error, id) => [{ type: 'Workplace', id }],
      keepUnusedDataFor: 300
    }),

    // Create Workplace (Admin)
    createWorkplace: builder.mutation({
      query: (workplaceData) => ({
        url: API_ENDPOINTS.WORKPLACES.CREATE,
        method: 'POST',
        body: workplaceData,
      }),
      invalidatesTags: ['Workplace', 'WorkplaceStats']
    }),

    // Update Workplace (Admin)
    updateWorkplace: builder.mutation({
      query: ({ id, updateData }) => ({
        url: API_ENDPOINTS.WORKPLACES.UPDATE(id),
        method: 'PUT',
        body: updateData
      }),
      invalidatesTags: (result, error, { id }) => [
        'Workplace',
        { type: 'Workplace', id },
        'WorkplaceStats'
      ],
      async onQueryStarted({ id, updateData }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          workplaceApiSlice.util.updateQueryData('getWorkplaceById', id, (draft) => {
            Object.assign(draft.data, updateData);
          })
        );
        
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      }
    }),

    // Delete Workplace (Admin)
    deleteWorkplace: builder.mutation({
      query: (id) => ({
        url: API_ENDPOINTS.WORKPLACES.DELETE(id),
        method: 'DELETE'
      }),
      invalidatesTags: ['Workplace', 'WorkplaceStats'],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResults = [];
        
        patchResults.push(
          dispatch(
            workplaceApiSlice.util.updateQueryData('getWorkplaces', undefined, (draft) => {
              if (draft.data) {
                draft.data = draft.data.filter(workplace => workplace._id !== id);
                if (draft.pagination) {
                  draft.pagination.totalItems -= 1;
                }
              }
            })
          )
        );
        
        try {
          await queryFulfilled;
        } catch {
          patchResults.forEach(patchResult => patchResult.undo());
        }
      }
    }),

    // Get Workplace Statistics (Public)
    getWorkplaceStats: builder.query({
      query: () => ({
        url: API_ENDPOINTS.WORKPLACES.STATS
      }),
      providesTags: ['WorkplaceStats'],
      keepUnusedDataFor: 300
    }),

    // Get Featured Workplaces (Public)
    getFeaturedWorkplaces: builder.query({
      query: (limit = 10) => ({
        url: `${API_ENDPOINTS.WORKPLACES.BASE}?isFeatured=true&status=active&limit=${limit}`
      }),
      providesTags: ['FeaturedWorkplaces'],
      keepUnusedDataFor: 180
    }),

    // Get Workplaces by Country (Public)
    getWorkplacesByCountry: builder.query({
      query: (country) => ({
        url: `${API_ENDPOINTS.WORKPLACES.BASE}?country=${country}&status=active&limit=50`
      }),
      providesTags: (result, error, country) => [
        { type: 'WorkplacesByCountry', id: country },
        'Workplace'
      ],
      keepUnusedDataFor: 180
    }),

    // Update Workplace Status (Admin)
    updateWorkplaceStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `${API_ENDPOINTS.WORKPLACES.BASE}/${id}/status`,
        method: 'PATCH',
        body: { status }
      }),
      invalidatesTags: (result, error, { id }) => [
        'Workplace',
        { type: 'Workplace', id },
        'WorkplaceStats'
      ],
      async onQueryStarted({ id, status }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          workplaceApiSlice.util.updateQueryData('getWorkplaceById', id, (draft) => {
            if (draft.data) {
              draft.data.status = status;
            }
          })
        );
        
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      }
    })
  })
});

// Export hooks
export const {
  useGetWorkplacesQuery,
  useLazyGetWorkplacesQuery,
  useGetWorkplaceByIdQuery,
  useLazyGetWorkplaceByIdQuery,
  useGetWorkplaceStatsQuery,
  useLazyGetWorkplaceStatsQuery,
  useGetFeaturedWorkplacesQuery,
  useLazyGetFeaturedWorkplacesQuery,
  useGetWorkplacesByCountryQuery,
  useLazyGetWorkplacesByCountryQuery,
  useCreateWorkplaceMutation,
  useUpdateWorkplaceMutation,
  useDeleteWorkplaceMutation,
  useUpdateWorkplaceStatusMutation
} = workplaceApiSlice;

// Selectors for cached data
export const selectWorkplacesResult = (state, params) =>
  workplaceApiSlice.endpoints.getWorkplaces.select(params)(state);

export const selectWorkplaceById = (state, id) =>
  workplaceApiSlice.endpoints.getWorkplaceById.select(id)(state);

export const selectWorkplaceStats = (state) =>
  workplaceApiSlice.endpoints.getWorkplaceStats.select()(state);

// Helper functions
export const getWorkplaceStatusColor = (status) => {
  const colors = {
    active: 'text-green-600 bg-green-50 border-green-200',
    inactive: 'text-gray-600 bg-gray-50 border-gray-200',
    under_maintenance: 'text-orange-600 bg-orange-50 border-orange-200'
  };
  return colors[status] || colors.active;
};

export const getWorkplaceRatingColor = (rating) => {
  if (rating >= 4.5) return 'text-green-600 bg-green-50';
  if (rating >= 4.0) return 'text-blue-600 bg-blue-50';
  if (rating >= 3.0) return 'text-yellow-600 bg-yellow-50';
  return 'text-red-600 bg-red-50';
};