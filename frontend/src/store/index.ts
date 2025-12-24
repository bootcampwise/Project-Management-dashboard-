import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import uiReducer from "./uiSlice";

// ============================================
// REDUX STORE CONFIGURATION
// ============================================
// This is the main Redux store for the application.
//
// We use two types of state management:
// 1. RTK Query (apiSlice) - For all API data (users, projects, tasks, etc.)
// 2. UI Slice - For UI state (modals, sidebar, theme, active selections)
//
// Usage in components:
// - For API data: use hooks like useGetProjectsQuery(), useLoginMutation()
// - For UI state: use useAppSelector(state => state.ui.sidebarOpen)

export const store = configureStore({
  reducer: {
    // UI state (modals, sidebar, theme, active items)
    ui: uiReducer,

    // RTK Query API (handles all data fetching and caching)
    [apiSlice.reducerPath]: apiSlice.reducer,
  },

  // Add RTK Query middleware for caching, invalidation, etc.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

// ============================================
// TYPESCRIPT TYPES
// ============================================
// These types help with TypeScript autocompletion

// Type for the entire Redux state
export type RootState = ReturnType<typeof store.getState>;

// Type for dispatch function
export type AppDispatch = typeof store.dispatch;
