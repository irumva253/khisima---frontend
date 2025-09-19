/* eslint-disable no-unused-vars */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../constants';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.userInfo?.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Create a custom base query that strips non-serializable values
const serializableBaseQuery = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  if (result.meta?.request) {
    // Remove the non-serializable request object
    result.meta.request = undefined;
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: serializableBaseQuery,
  tagTypes: ['User', 'Auth', 'CareerApplication', 'AgentPresence', 'AgentRoom', 'AgentRoomMessages', 'AgentInbox'],
  endpoints: (builder) => ({}),
});