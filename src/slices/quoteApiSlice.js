/* eslint-disable no-unused-vars */
import { apiSlice } from './apiSlice';
import { API_ENDPOINTS } from '../constants';

export const quoteApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Submit Quote Request (Public)
    submitQuoteRequest: builder.mutation({
      query: (formData) => ({
        url: API_ENDPOINTS.QUOTES.CREATE,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Quote', 'QuoteStats']
    }),

    // Get All Quotes (Admin) - FIXED URL
    getQuotes: builder.query({
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
          url: `${API_ENDPOINTS.QUOTES.BASE}${queryStr ? `?${queryStr}` : ''}`
        };
      },
      providesTags: (result, error, params) => [
        'Quote',
        ...(result?.data || []).map(quote => ({ type: 'Quote', id: quote._id }))
      ],
      keepUnusedDataFor: 60
    }),

    // Get Single Quote (Admin) - FIXED URL
    getQuoteById: builder.query({
      query: (id) => ({
        url: API_ENDPOINTS.QUOTES.GET_BY_ID(id)
      }),
      providesTags: (result, error, id) => [{ type: 'Quote', id }],
      keepUnusedDataFor: 300
    }),

    // Update Quote (Admin) - FIXED URL
    updateQuote: builder.mutation({
      query: ({ id, updateData }) => ({
        url: API_ENDPOINTS.QUOTES.UPDATE(id),
        method: 'PUT',
        body: updateData
      }),
      invalidatesTags: (result, error, { id }) => [
        'Quote',
        { type: 'Quote', id },
        'QuoteStats'
      ],
      async onQueryStarted({ id, updateData }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          quoteApiSlice.util.updateQueryData('getQuoteById', id, (draft) => {
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

    // Delete Quote (Admin) - FIXED URL
    deleteQuote: builder.mutation({
      query: (id) => ({
        url: API_ENDPOINTS.QUOTES.DELETE(id),
        method: 'DELETE'
      }),
      invalidatesTags: ['Quote', 'QuoteStats'],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResults = [];
        
        patchResults.push(
          dispatch(
            quoteApiSlice.util.updateQueryData('getQuotes', undefined, (draft) => {
              if (draft.data) {
                draft.data = draft.data.filter(quote => quote._id !== id);
                if (draft.pagination) {
                  draft.pagination.totalQuotes -= 1;
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

    // Get Quote Statistics (Admin) - FIXED URL
    getQuoteStats: builder.query({
      query: () => ({
        url: API_ENDPOINTS.QUOTES.STATS
      }),
      providesTags: ['QuoteStats'],
      keepUnusedDataFor: 300
    }),

    // Bulk Update Quotes (Admin) - ADDED THIS ENDPOINT
    bulkUpdateQuotes: builder.mutation({
      query: ({ ids, updateData }) => ({
        url: `${API_ENDPOINTS.QUOTES.BASE}/bulk`,
        method: 'PUT',
        body: { ids, updateData }
      }),
      invalidatesTags: ['Quote', 'QuoteStats']
    }),

    // Add Communication (Admin) - ADDED THIS ENDPOINT
    addCommunication: builder.mutation({
      query: ({ quoteId, communicationData }) => ({
        url: `${API_ENDPOINTS.QUOTES.BASE}/${quoteId}/communications`,
        method: 'POST',
        body: communicationData
      }),
      invalidatesTags: (result, error, { quoteId }) => [
        { type: 'Quote', id: quoteId }
      ],
      async onQueryStarted({ quoteId, communicationData }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          quoteApiSlice.util.updateQueryData('getQuoteById', quoteId, (draft) => {
            if (draft.data && draft.data.communications) {
              draft.data.communications.push({
                ...communicationData,
                createdAt: new Date().toISOString(),
                _id: 'temp-' + Date.now()
              });
            }
          })
        );
        
        try {
          const { data } = await queryFulfilled;
          dispatch(
            quoteApiSlice.util.updateQueryData('getQuoteById', quoteId, (draft) => {
              if (draft.data && draft.data.communications) {
                draft.data.communications = draft.data.communications.filter(
                  comm => !comm._id.startsWith('temp-')
                );
                draft.data.communications.push(data.data);
              }
            })
          );
        } catch {
          patchResult.undo();
        }
      }
    }),

    // Export Quotes (Admin) - ADDED THIS ENDPOINT
    exportQuotes: builder.mutation({
      query: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return {
          url: `${API_ENDPOINTS.QUOTES.BASE}/export${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
          responseHandler: async (response) => {
            if (params.format === 'csv') {
              const blob = await response.blob();
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', `quotes-${Date.now()}.csv`);
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

    // Update Quote Status (Admin) - ADDED THIS ENDPOINT
    updateQuoteStatus: builder.mutation({
      query: ({ id, status, notes }) => ({
        url: `${API_ENDPOINTS.QUOTES.BASE}/${id}/status`,
        method: 'PATCH',
        body: { status, notes }
      }),
      invalidatesTags: (result, error, { id }) => [
        'Quote',
        { type: 'Quote', id },
        'QuoteStats'
      ],
      async onQueryStarted({ id, status, notes }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          quoteApiSlice.util.updateQueryData('getQuoteById', id, (draft) => {
            if (draft.data) {
              draft.data.status = status;
              if (notes) {
                draft.data.adminNotes = notes;
              }
              if (status === 'quoted') {
                draft.data.quotedAt = new Date().toISOString();
              }
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

    // Get Quotes by Status (Admin)
    getQuotesByStatus: builder.query({
      query: (status) => ({
        url: `${API_ENDPOINTS.QUOTES.BASE}?status=${status}&limit=50`
      }),
      providesTags: (result, error, status) => [
        { type: 'QuotesByStatus', id: status },
        'Quote'
      ],
      keepUnusedDataFor: 180
    }),

    // Get Recent Quotes (Admin)
    getRecentQuotes: builder.query({
      query: (limit = 10) => ({
        url: `${API_ENDPOINTS.QUOTES.BASE}?sortBy=createdAt&sortOrder=desc&limit=${limit}`
      }),
      providesTags: ['RecentQuotes'],
      keepUnusedDataFor: 180
    }),

    // Download Quote File (Admin) - ADDED THIS ENDPOINT
    downloadQuoteFile: builder.mutation({
  query: ({ quoteId, fileId }) => ({
    url: `${API_ENDPOINTS.QUOTES.BASE}/${quoteId}/files/${fileId}/download`,
    method: 'GET'
  }),
  // Remove the responseHandler since backend returns JSON with signed URL
}),

    // Get Overdue Quotes (Admin) - ADDED THIS ENDPOINT
    getOverdueQuotes: builder.query({
      query: () => ({
        url: `${API_ENDPOINTS.QUOTES.BASE}?overdue=true`
      }),
      providesTags: ['OverdueQuotes'],
      keepUnusedDataFor: 120
    })
  })
});

// Export hooks
export const {
  // Public hooks
  useSubmitQuoteRequestMutation,
  
  // Admin query hooks
  useGetQuotesQuery,
  useLazyGetQuotesQuery,
  useGetQuoteByIdQuery,
  useLazyGetQuoteByIdQuery,
  useGetQuoteStatsQuery,
  useLazyGetQuoteStatsQuery,
  useGetQuotesByStatusQuery,
  useLazyGetQuotesByStatusQuery,
  useGetRecentQuotesQuery,
  useLazyGetRecentQuotesQuery,
  useGetOverdueQuotesQuery,
  useLazyGetOverdueQuotesQuery,
  
  // Admin mutation hooks
  useUpdateQuoteMutation,
  useDeleteQuoteMutation,
  useBulkUpdateQuotesMutation,
  useAddCommunicationMutation,
  useExportQuotesMutation,
  useUpdateQuoteStatusMutation,
  useDownloadQuoteFileMutation
} = quoteApiSlice;

// Selectors for cached data
export const selectQuotesResult = (state, params) =>
  quoteApiSlice.endpoints.getQuotes.select(params)(state);

export const selectQuoteById = (state, id) =>
  quoteApiSlice.endpoints.getQuoteById.select(id)(state);

export const selectQuoteStats = (state) =>
  quoteApiSlice.endpoints.getQuoteStats.select()(state);

// Custom selectors with memoization
export const selectFilteredQuotes = (status, projectType) => (state) => {
  const quotesResult = selectQuotesResult(state, { status, projectType });
  return quotesResult?.data?.data || [];
};

export const selectQuotesByPriority = (priority) => (state) => {
  const quotesResult = selectQuotesResult(state, {});
  const quotes = quotesResult?.data?.data || [];
  return quotes.filter(quote => quote.priority === priority);
};

export const selectPendingQuotesCount = (state) => {
  const quotesResult = selectQuotesResult(state, { status: 'pending' });
  return quotesResult?.data?.pagination?.totalQuotes || 0;
};

// Helper functions for transforming data
export const transformQuoteForExport = (quote) => ({
  id: quote._id,
  reference: quote._id.toString().slice(-8).toUpperCase(),
  name: `${quote.firstName} ${quote.lastName}`,
  email: quote.email,
  company: quote.company || '',
  projectType: quote.projectType,
  sourceLanguage: quote.sourceLanguage,
  targetLanguages: quote.targetLanguages.join(', '),
  wordCount: quote.wordCount || '',
  estimatedCost: quote.estimatedCost || '',
  status: quote.status,
  priority: quote.priority,
  deadline: quote.deadline ? new Date(quote.deadline).toLocaleDateString() : '',
  createdAt: new Date(quote.createdAt).toLocaleDateString(),
  quotedAt: quote.quotedAt ? new Date(quote.quotedAt).toLocaleDateString() : '',
  ageInDays: Math.floor((Date.now() - new Date(quote.createdAt)) / (1000 * 60 * 60 * 24))
});

export const getQuoteStatusColor = (status) => {
  const colors = {
    pending: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    reviewing: 'text-blue-600 bg-blue-50 border-blue-200',
    quoted: 'text-green-600 bg-green-50 border-green-200',
    accepted: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    rejected: 'text-red-600 bg-red-50 border-red-200',
    completed: 'text-gray-600 bg-gray-50 border-gray-200',
    expired: 'text-orange-600 bg-orange-50 border-orange-200'
  };
  return colors[status] || colors.pending;
};

export const getQuotePriorityColor = (priority) => {
  const colors = {
    low: 'text-gray-600 bg-gray-50',
    normal: 'text-blue-600 bg-blue-50',
    high: 'text-orange-600 bg-orange-50',
    urgent: 'text-red-600 bg-red-50'
  };
  return colors[priority] || colors.normal;
};