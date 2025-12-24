import { createApi } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import axios from "axios";
import type { AxiosError } from "axios";
import { supabase } from "../../lib/supabase";

// ============================================
// API CONFIGURATION
// ============================================

// The backend URL (from .env file or default to localhost)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create an axios instance with our base URL
const api = axios.create({
  baseURL: API_URL,
});

// ============================================
// CUSTOM AXIOS BASE QUERY
// ============================================

// This type defines what we can pass to our API calls
type ApiRequest =
  | string // Simple: just the URL for GET requests
  | {
      url: string;
      method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
      body?: unknown;
      params?: Record<string, unknown>;
    };

// Error type for API responses
interface ApiError {
  status?: number;
  data?: unknown;
}

/**
 * This function handles all API calls for RTK Query
 * It automatically adds the auth token from Supabase
 */
const axiosBaseQuery = (): BaseQueryFn<ApiRequest, unknown, ApiError> => {
  return async (request) => {
    try {
      // Step 1: Get the auth token from Supabase
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      // Step 2: Prepare the request
      // If request is a string, it's a simple GET request
      // If it's an object, use all the provided options
      const isSimpleGet = typeof request === "string";

      const url = isSimpleGet ? request : request.url;
      const method = isSimpleGet ? "GET" : request.method || "GET";
      const data = isSimpleGet ? undefined : request.body;
      const params = isSimpleGet ? undefined : request.params;

      // Step 3: Add auth header if we have a token
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // Step 4: Make the API call
      const response = await api({ url, method, data, params, headers });

      // Step 5: Return the data
      return { data: response.data };
    } catch (err) {
      // Handle errors
      const error = err as AxiosError;
      return {
        error: {
          status: error.response?.status,
          data: error.response?.data || error.message,
        },
      };
    }
  };
};

// ============================================
// CREATE THE API SLICE
// ============================================

/**
 * This is the main API slice for RTK Query
 * All our API endpoints will be added to this
 */
export const apiSlice = createApi({
  // Unique key for this API in Redux store
  reducerPath: "api",

  // Use our custom axios base query
  baseQuery: axiosBaseQuery(),

  // Tags for cache invalidation
  // When we update data, these tags tell RTK Query what to refresh
  tagTypes: ["User", "Project", "Task", "Team", "ProjectFile", "CalendarEvent"],

  // Endpoints will be injected from other files
  endpoints: () => ({}),
});
