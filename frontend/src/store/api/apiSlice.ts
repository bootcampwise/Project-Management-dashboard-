import { createApi } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import axios from "axios";
import type { AxiosError } from "axios";
import { supabase } from "../../lib/supabase";
import type { ApiRequest, ApiError } from "../../types";

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
// AUTH TOKEN CACHING (30-second TTL for security)
// ============================================

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * Get cached auth token or fetch a new one.
 * Token is cached for 30 seconds max for security.
 */
async function getCachedAuthToken(): Promise<string | null> {
  const now = Date.now();

  // Return cached token if still valid
  if (cachedToken && now < tokenExpiry) {
    return cachedToken;
  }

  // Fetch new token
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    cachedToken = sessionData.session?.access_token || null;
    tokenExpiry = now + 30000; // 30 seconds TTL
    return cachedToken;
  } catch {
    cachedToken = null;
    tokenExpiry = 0;
    return null;
  }
}

/**
 * Clear the auth token cache (call on auth errors or logout)
 */
export function clearAuthTokenCache(): void {
  cachedToken = null;
  tokenExpiry = 0;
}

// ============================================
// CUSTOM AXIOS BASE QUERY
// ============================================

/**
 * This function handles all API calls for RTK Query
 * It uses cached auth token for better performance
 */
const axiosBaseQuery = (): BaseQueryFn<ApiRequest, unknown, ApiError> => {
  return async (request) => {
    try {
      // Step 1: Get the auth token (cached for 30s)
      const token = await getCachedAuthToken();

      // Step 2: Prepare the request
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
      // The backend wraps responses in { success, message, data }
      const responseData = response.data;

      if (
        responseData &&
        typeof responseData === "object" &&
        "data" in responseData
      ) {
        return { data: responseData.data };
      }

      return { data: responseData };
    } catch (err) {
      const error = err as AxiosError;

      // Clear token cache on 401 errors (token might be invalid/expired)
      if (error.response?.status === 401) {
        clearAuthTokenCache();
      }

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

  // ============================================
  // GLOBAL CACHE SETTINGS
  // ============================================
  // Keep unused data for 2 minutes (balance between memory and performance)
  keepUnusedDataFor: 120,

  // Refetch when window regains focus (keeps data fresh in collaborative apps)
  refetchOnFocus: true,

  // Refetch when internet reconnects
  refetchOnReconnect: true,

  // Tags for cache invalidation
  tagTypes: ["User", "Project", "Task", "Team", "ProjectFile", "CalendarEvent"],

  // Endpoints will be injected from other files
  endpoints: () => ({}),
});
