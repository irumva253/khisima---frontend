/* eslint-disable no-unused-vars */
import { apiSlice } from './apiSlice';
import { API_ENDPOINTS } from '../constants';

export const resourceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get All Resources (Public)
    getResources: builder.query({
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
          url: `${API_ENDPOINTS.RESOURCES.BASE}${queryStr ? `?${queryStr}` : ''}`
        };
      },
      providesTags: (result, error, params) => [
        'Resource',
        ...(result?.data || []).map(resource => ({ type: 'Resource', id: resource._id }))
      ],
      keepUnusedDataFor: 60
    }),

    // Get Single Resource (Public)
    getResourceById: builder.query({
      query: (id) => ({
        url: API_ENDPOINTS.RESOURCES.GET_BY_ID(id)
      }),
      providesTags: (result, error, id) => [{ type: 'Resource', id }],
      keepUnusedDataFor: 300
    }),

    // Create Resource (Admin)
    createResource: builder.mutation({
      query: (resourceData) => ({
        url: API_ENDPOINTS.RESOURCES.CREATE,
        method: 'POST',
        body: resourceData,
      }),
      invalidatesTags: ['Resource', 'ResourceStats']
    }),

    // Update Resource (Admin)
    updateResource: builder.mutation({
      query: ({ id, updateData }) => ({
        url: API_ENDPOINTS.RESOURCES.UPDATE(id),
        method: 'PUT',
        body: updateData
      }),
      invalidatesTags: (result, error, { id }) => [
        'Resource',
        { type: 'Resource', id },
        'ResourceStats'
      ],
      async onQueryStarted({ id, updateData }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          resourceApiSlice.util.updateQueryData('getResourceById', id, (draft) => {
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

    // Delete Resource (Admin)
    deleteResource: builder.mutation({
      query: (id) => ({
        url: API_ENDPOINTS.RESOURCES.DELETE(id),
        method: 'DELETE'
      }),
      invalidatesTags: ['Resource', 'ResourceStats'],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResults = [];
        
        patchResults.push(
          dispatch(
            resourceApiSlice.util.updateQueryData('getResources', undefined, (draft) => {
              if (draft.data) {
                draft.data = draft.data.filter(resource => resource._id !== id);
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

    // Get Resource Statistics (Public)
    getResourceStats: builder.query({
      query: () => ({
        url: API_ENDPOINTS.RESOURCES.STATS
      }),
      providesTags: ['ResourceStats'],
      keepUnusedDataFor: 300
    }),

    // Bulk Update Resources (Admin)
    bulkUpdateResources: builder.mutation({
      query: ({ ids, updateData }) => ({
        url: `${API_ENDPOINTS.RESOURCES.BASE}/bulk`,
        method: 'PUT',
        body: { ids, updateData }
      }),
      invalidatesTags: ['Resource', 'ResourceStats']
    }),

    // Export Resources (Admin)
    exportResources: builder.mutation({
      query: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return {
          url: `${API_ENDPOINTS.RESOURCES.BASE}/export${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
          responseHandler: async (response) => {
            if (params.format === 'csv') {
              const blob = await response.blob();
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', `resources-${Date.now()}.csv`);
              document.body.appendChild(link);
              link.click();
              link.remove();
              window.URL.revokeObjectURL(url);
              return { success: true, message: 'Export downloaded successfully' };
            }
            return response.json();
          },
          cache: 'no-cache'
        };
      }
    }),

    // Update Resource Status (Admin)
    updateResourceStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `${API_ENDPOINTS.RESOURCES.BASE}/${id}/status`,
        method: 'PATCH',
        body: { status }
      }),
      invalidatesTags: (result, error, { id }) => [
        'Resource',
        { type: 'Resource', id },
        'ResourceStats'
      ],
      async onQueryStarted({ id, status }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          resourceApiSlice.util.updateQueryData('getResourceById', id, (draft) => {
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
    }),

    // Get Resources by Category (Public)
    getResourcesByCategory: builder.query({
      query: (category) => ({
        url: `${API_ENDPOINTS.RESOURCES.BASE}?category=${category}&status=published&limit=50`
      }),
      providesTags: (result, error, category) => [
        { type: 'ResourcesByCategory', id: category },
        'Resource'
      ],
      keepUnusedDataFor: 180
    }),

    // Get Featured Resources (Public)
    getFeaturedResources: builder.query({
      query: (limit = 10) => ({
        url: `${API_ENDPOINTS.RESOURCES.BASE}?isFeatured=true&status=published&limit=${limit}`
      }),
      providesTags: ['FeaturedResources'],
      keepUnusedDataFor: 180
    }),

    // Download Resource File (Public)
    downloadResourceFile: builder.mutation({
      query: ({ resourceId }) => ({
        url: `${API_ENDPOINTS.RESOURCES.BASE}/${resourceId}/download`,
        method: 'GET'
      }),
    }),

    // Increment Download Count
    incrementDownloadCount: builder.mutation({
      query: (id) => ({
        url: `${API_ENDPOINTS.RESOURCES.BASE}/${id}/download`,
        method: 'POST'
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Resource', id },
        'ResourceStats'
      ]
    })
  })
});

// Export hooks
export const {
  // Query hooks
  useGetResourcesQuery,
  useLazyGetResourcesQuery,
  useGetResourceByIdQuery,
  useLazyGetResourceByIdQuery,
  useGetResourceStatsQuery,
  useLazyGetResourceStatsQuery,
  useGetResourcesByCategoryQuery,
  useLazyGetResourcesByCategoryQuery,
  useGetFeaturedResourcesQuery,
  useLazyGetFeaturedResourcesQuery,
  
  // Mutation hooks
  useCreateResourceMutation,
  useUpdateResourceMutation,
  useDeleteResourceMutation,
  useBulkUpdateResourcesMutation,
  useExportResourcesMutation,
  useUpdateResourceStatusMutation,
  useDownloadResourceFileMutation,
  useIncrementDownloadCountMutation
} = resourceApiSlice;

// Selectors for cached data
export const selectResourcesResult = (state, params) =>
  resourceApiSlice.endpoints.getResources.select(params)(state);

export const selectResourceById = (state, id) =>
  resourceApiSlice.endpoints.getResourceById.select(id)(state);

export const selectResourceStats = (state) =>
  resourceApiSlice.endpoints.getResourceStats.select()(state);

// Custom selectors with memoization
export const selectFilteredResources = (category, type) => (state) => {
  const resourcesResult = selectResourcesResult(state, { category, type, status: 'published' });
  return resourcesResult?.data?.data || [];
};

export const selectResourcesByStatus = (status) => (state) => {
  const resourcesResult = selectResourcesResult(state, { status });
  return resourcesResult?.data?.data || [];
};

export const selectPublishedResourcesCount = (state) => {
  const resourcesResult = selectResourcesResult(state, { status: 'published' });
  return resourcesResult?.data?.pagination?.totalItems || 0;
};

// Helper functions for transforming data
export const transformResourceForExport = (resource) => ({
  id: resource._id,
  title: resource.title,
  author: resource.author,
  category: resource.category,
  type: resource.type,
  status: resource.status,
  isFeatured: resource.isFeatured ? 'Yes' : 'No',
  downloads: resource.downloads,
  rating: resource.rating,
  readTime: resource.readTime,
  tags: resource.tags.join(', '),
  createdAt: new Date(resource.createdAt).toLocaleDateString(),
  updatedAt: new Date(resource.updatedAt).toLocaleDateString()
});

export const getResourceStatusColor = (status) => {
  const colors = {
    draft: 'text-gray-600 bg-gray-50 border-gray-200',
    published: 'text-green-600 bg-green-50 border-green-200',
    archived: 'text-orange-600 bg-orange-50 border-orange-200'
  };
  return colors[status] || colors.draft;
};

export const getResourceCategoryColor = (category) => {
  const colors = {
    trends: 'text-blue-600 bg-blue-50',
    'ai-language': 'text-purple-600 bg-purple-50',
    linguistics: 'text-green-600 bg-green-50',
    'open-resources': 'text-orange-600 bg-orange-50'
  };
  return colors[category] || colors.trends;
};

export const getResourceTypeIcon = (type) => {
  const icons = {
    research: 'FileText',
    whitepaper: 'FileText',
    guide: 'BookOpen',
    data: 'TrendingUp',
    article: 'FileText',
    'case-study': 'FileText',
    technical: 'Cpu',
    paper: 'FileText',
    tools: 'Download',
    methodology: 'BookOpen',
    dataset: 'Download',
    software: 'Download',
    book: 'BookOpen',
    video: 'Video',
    audio: 'Headphones'
  };
  return icons[type] || 'FileText';
};