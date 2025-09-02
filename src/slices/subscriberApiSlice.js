import { apiSlice } from './apiSlice';
import { API_ENDPOINTS } from '../constants';

export const subscriberApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSubscribers: builder.query({
      query: ({ page = 1, limit = 10, status, search } = {}) => ({
        url: API_ENDPOINTS.SUBSCRIBERS.GET_ALL,
        params: { page, limit, status, search }
      }),
      providesTags: ['Subscriber'],
    }),
    
    getSubscriberStats: builder.query({
      query: () => ({
        url: API_ENDPOINTS.SUBSCRIBERS.GET_STATS,
      }),
      providesTags: ['SubscriberStats'],
    }),
    
    createSubscriber: builder.mutation({
      query: (data) => ({
        url: API_ENDPOINTS.SUBSCRIBERS.CREATE,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Subscriber', 'SubscriberStats'],
    }),
    
    updateSubscriber: builder.mutation({
      query: (data) => ({
        url: API_ENDPOINTS.SUBSCRIBERS.UPDATE(data._id),
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Subscriber', 'SubscriberStats'],
    }),
    
    deleteSubscriber: builder.mutation({
      query: (id) => ({
        url: API_ENDPOINTS.SUBSCRIBERS.DELETE(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['Subscriber', 'SubscriberStats'],
    }),
    
    unsubscribeSubscriber: builder.mutation({
      query: (id) => ({
        url: API_ENDPOINTS.SUBSCRIBERS.UNSUBSCRIBE(id),
        method: 'PUT',
      }),
      invalidatesTags: ['Subscriber', 'SubscriberStats'],
    }),
    
    bulkOperations: builder.mutation({
      query: (data) => ({
        url: API_ENDPOINTS.SUBSCRIBERS.BULK,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Subscriber', 'SubscriberStats'],
    }),
    
    exportSubscribers: builder.query({
      query: ({ status, format = 'json' } = {}) => ({
        url: API_ENDPOINTS.SUBSCRIBERS.EXPORT,
        params: { status, format }
      }),
    }),
  }),
});

export const {
  useGetSubscribersQuery,
  useGetSubscriberStatsQuery,
  useCreateSubscriberMutation,
  useUpdateSubscriberMutation,
  useDeleteSubscriberMutation,
  useUnsubscribeSubscriberMutation,
  useBulkOperationsMutation,
  useExportSubscribersQuery,
} = subscriberApiSlice;