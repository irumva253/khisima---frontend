import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './slices/apiSlice';
import authReducer from './slices/authSlice';

const preloadedState = {
  auth: {
    userInfo: localStorage.getItem('user') 
      ? JSON.parse(localStorage.getItem('user')) 
      : null,
  },
};

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these paths in the state
        ignoredPaths: ['api.mutations', 'api.queries'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.baseQueryMeta.request', 'meta.baseQueryMeta.response'],
      },
    }).concat(apiSlice.middleware),
  preloadedState,
  devTools: true,
});

export default store;