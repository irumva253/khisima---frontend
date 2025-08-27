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
        ignoredPaths: ['api.mutations', 'api.queries'],
        ignoredActionPaths: ['meta.baseQueryMeta.request', 'meta.baseQueryMeta.response'],
      },
    }).concat(apiSlice.middleware, uploadApi.middleware), 
  preloadedState,
  devTools: true,
});

export default store;
