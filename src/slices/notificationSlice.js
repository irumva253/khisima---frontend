import { apiSlice } from './apiSlice';
import { API_ENDPOINTS } from '../constants';

export const notificationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Contact Form (Public)
    submitContactForm: builder.mutation({
      query: (contactData) => ({
        url: API_ENDPOINTS.NOTIFICATIONS.CONTACT,
        method: 'POST',
        body: contactData
      }),
      invalidatesTags: ['Notification']
    }),

    // Notifications CRUD (Admin)
    getNotifications: builder.query({
      query: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return { url: `${API_ENDPOINTS.NOTIFICATIONS.GET_ALL}?${queryString}` };
      },
      providesTags: ['Notification'],
      keepUnusedDataFor: 5
    }),

    getNotificationById: builder.query({
      query: (id) => ({
        url: API_ENDPOINTS.NOTIFICATIONS.GET_BY_ID(id)
      }),
      providesTags: (result, error, id) => [{ type: 'Notification', id }],
      keepUnusedDataFor: 5
    }),

    updateNotification: builder.mutation({
      query: ({ id, updateData }) => ({
        url: API_ENDPOINTS.NOTIFICATIONS.UPDATE(id),
        method: 'PUT',
        body: updateData
      }),
      invalidatesTags: (result, error, { id }) => [
        'Notification',
        { type: 'Notification', id }
      ]
    }),

    deleteNotification: builder.mutation({
      query: (id) => ({
        url: API_ENDPOINTS.NOTIFICATIONS.DELETE(id),
        method: 'DELETE'
      }),
      invalidatesTags: ['Notification']
    }),

    // Bulk Operations (Admin)
    bulkUpdateNotifications: builder.mutation({
      query: ({ ids, updateData }) => ({
        url: API_ENDPOINTS.NOTIFICATIONS.BULK_UPDATE,
        method: 'PUT',
        body: { ids, updateData }
      }),
      invalidatesTags: ['Notification']
    }),

    bulkDeleteNotifications: builder.mutation({
      query: (ids) => ({
        url: API_ENDPOINTS.NOTIFICATIONS.BULK_DELETE,
        method: 'DELETE',
        body: { ids }
      }),
      invalidatesTags: ['Notification']
    }),

    // Status Updates (Admin)
    markNotificationAsRead: builder.mutation({
      query: (id) => ({
        url: API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id),
        method: 'POST'
      }),
      invalidatesTags: (result, error, id) => [
        'Notification',
        { type: 'Notification', id }
      ]
    }),

    markNotificationAsResponded: builder.mutation({
      query: ({ id, responseNote }) => ({
        url: API_ENDPOINTS.NOTIFICATIONS.MARK_RESPONDED(id),
        method: 'POST',
        body: { responseNote }
      }),
      invalidatesTags: (result, error, { id }) => [
        'Notification',
        { type: 'Notification', id }
      ]
    }),

    // Dashboard & Export (Admin)
    getNotificationStats: builder.query({
      query: () => ({
        url: API_ENDPOINTS.NOTIFICATIONS.STATS
      }),
      providesTags: ['NotificationStats'],
      keepUnusedDataFor: 60
    }),

    exportNotifications: builder.mutation({
      query: (params = {}) => ({
        url: API_ENDPOINTS.NOTIFICATIONS.EXPORT,
        method: 'GET',
        params,
        responseHandler: async (response) => {
          if (params.format === 'csv') {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `notifications-${Date.now()}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            return { success: true };
          }
          return response.json();
        },
        cache: 'no-cache'
      })
    })
  })
});

export const {
  useSubmitContactFormMutation,
  useGetNotificationsQuery,
  useLazyGetNotificationsQuery,
  useGetNotificationByIdQuery,
  useLazyGetNotificationByIdQuery,
  useUpdateNotificationMutation,
  useDeleteNotificationMutation,
  useBulkUpdateNotificationsMutation,
  useBulkDeleteNotificationsMutation,
  useMarkNotificationAsReadMutation,
  useMarkNotificationAsRespondedMutation,
  useGetNotificationStatsQuery,
  useLazyGetNotificationStatsQuery,
  useExportNotificationsMutation
} = notificationApiSlice;