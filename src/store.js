import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './slices/apiSlice';
import { uploadApi } from './slices/uploadApiSlice';

import authReducer from './slices/authSlice';

const preloadedState = {
  auth: {
    userInfo: localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null,
  },
};

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [uploadApi.reducerPath]: uploadApi.reducer,
    
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for FormData submissions
        ignoredActions: [
          'api/executeMutation/pending',
          'api/executeMutation/fulfilled',
          'api/executeMutation/rejected',
          'uploadApi/executeMutation/pending',
          'uploadApi/executeMutation/fulfilled',
          'uploadApi/executeMutation/rejected',
        ],
        // Ignore these paths in actions and state
        ignoredPaths: [
          'api.mutations', 
          'api.queries',
          'uploadApi.mutations',
          'uploadApi.queries'
        ],
        ignoredActionPaths: [
          'meta.baseQueryMeta.request', 
          'meta.baseQueryMeta.response',
          'meta.arg.originalArgs', // This is key for FormData
          'payload'
        ],
      },
    }).concat(apiSlice.middleware, uploadApi.middleware),
   
  preloadedState,
  devTools: true,
});

export default store;