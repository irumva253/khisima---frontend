// src/slices/agentApiSlice.js
import { apiSlice } from './apiSlice';
import { API_ENDPOINTS } from '@/constants';

export const agentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    /* ---------------- Presence ---------------- */
    getPresence: builder.query({
      query: () => ({
        url: API_ENDPOINTS.AGENT.PRESENCE.GET,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['AgentPresence'],
    }),

    setPresence: builder.mutation({
      query: ({ online }) => ({
        url: API_ENDPOINTS.AGENT.PRESENCE.SET,
        method: 'PUT',
        body: { online: !!online },
        credentials: 'include',
      }),
      // broadcasted via sockets too, but keep cache in sync
      invalidatesTags: ['AgentPresence'],
    }),

    /* ---------------- Rooms ---------------- */
    getRooms: builder.query({
      query: ({ page = 1, limit = 50, search = '' } = {}) => ({
        url: API_ENDPOINTS.AGENT.ROOMS.LIST({ page, limit, search }),
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map((r) => ({ type: 'AgentRoom', id: r.roomId })),
              { type: 'AgentRoom', id: 'LIST' },
            ]
          : [{ type: 'AgentRoom', id: 'LIST' }],
    }),

    // ✅ NEW: REST history (socket-first, but this guarantees first message visible)
    getRoomMessages: builder.query({
      query: ({ roomId, page = 1, limit = 200 }) => ({
        url: API_ENDPOINTS.AGENT.ROOMS.MESSAGES(roomId, page, limit),
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: (result, error, arg) => [{ type: 'AgentRoomMessages', id: arg.roomId }],
    }),

    // ✅ NEW: forward transcript via email
    forwardTranscript: builder.mutation({
      query: ({ roomId, to, subject }) => ({
        url: API_ENDPOINTS.AGENT.ROOMS.FORWARD(roomId),
        method: 'POST',
        credentials: 'include',
        body: { to, subject },
      }),
    }),

    // ✅ NEW: delete a room (and its messages)
    deleteRoom: builder.mutation({
      query: ({ roomId }) => ({
        url: API_ENDPOINTS.AGENT.ROOMS.DELETE(roomId),
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'AgentRoom', id: arg.roomId },
        { type: 'AgentRoom', id: 'LIST' },
        { type: 'AgentRoomMessages', id: arg.roomId },
      ],
    }),

    /* ---------------- Inbox (offline capture) ---------------- */
    getInbox: builder.query({
      query: ({ page = 1, limit = 50, status = '' } = {}) => ({
        url: API_ENDPOINTS.AGENT.INBOX_LIST({ page, limit, status }),
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map((i) => ({ type: 'AgentInbox', id: i._id })),
              { type: 'AgentInbox', id: 'LIST' },
            ]
          : [{ type: 'AgentInbox', id: 'LIST' }],
    }),

    updateInboxStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: API_ENDPOINTS.AGENT.INBOX_UPDATE(id),
        method: 'PUT',
        credentials: 'include',
        body: { status },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'AgentInbox', id: arg.id },
        { type: 'AgentInbox', id: 'LIST' },
      ],
    }),

    // User capture
    createInbox: builder.mutation({
      query: ({ room, email, question }) => ({
        url: API_ENDPOINTS.AGENT.INBOX_CREATE,
        method: 'POST',
        credentials: 'include',
        body: { room, email, question },
      }),
      invalidatesTags: [{ type: 'AgentInbox', id: 'LIST' }],
    }),

    /* ---------------- Search API (auto-assist) ---------------- */
    searchAgent: builder.query({
      query: ({ q, room }) => ({
        url: API_ENDPOINTS.AGENT.SEARCH(q, room),
        method: 'GET',
        credentials: 'include',
      }),
    }),

  }),

  overrideExisting: false,
});

export const {
  useGetPresenceQuery,
  useSetPresenceMutation,

  useGetRoomsQuery,
  useGetRoomMessagesQuery,
  useForwardTranscriptMutation,
  useDeleteRoomMutation,

  useGetInboxQuery,
  useUpdateInboxStatusMutation,
  useCreateInboxMutation,

  useLazySearchAgentQuery,
} = agentApiSlice;
