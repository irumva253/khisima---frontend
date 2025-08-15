import { apiSlice } from './apiSlice';
import { API_ENDPOINTS } from '../constants';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: API_ENDPOINTS.USERS.LOGIN,
        method: 'POST',
        body: credentials
      }),
      invalidatesTags: ['Auth']
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: API_ENDPOINTS.USERS.REGISTER,
        method: 'POST',
        body: userData
      })
    }),
    logout: builder.mutation({
      query: () => ({
        url: API_ENDPOINTS.USERS.LOGOUT,
        method: 'POST'
      }),
      invalidatesTags: ['Auth']
    }),
    updateProfile: builder.mutation({
      query: (userData) => ({
        url: API_ENDPOINTS.USERS.PROFILE,
        method: 'PUT',
        body: userData
      }),
      invalidatesTags: ['Auth']
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: API_ENDPOINTS.USERS.FORGOT_PASSWORD,
        method: 'POST',
        body: { email }
      })
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: API_ENDPOINTS.USERS.RESET_PASSWORD,
        method: 'POST',
        body: data
      })
    }),
    getUsers: builder.query({
      query: () => ({
        url: API_ENDPOINTS.USERS.GET_ALL
      }),
      providesTags: ['User'],
      keepUnusedDataFor: 5
    }),
    getUserDetails: builder.query({
      query: (userId) => ({
        url: API_ENDPOINTS.USERS.GET_BY_ID(userId)
      }),
      keepUnusedDataFor: 5
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: API_ENDPOINTS.USERS.UPDATE(data.userId),
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['User']
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: API_ENDPOINTS.USERS.DELETE(userId),
        method: 'DELETE'
      }),
      invalidatesTags: ['User']
    })
  })
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useUpdateProfileMutation,
  useGetUsersQuery,
  useGetUserDetailsQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation
} = userApiSlice;
