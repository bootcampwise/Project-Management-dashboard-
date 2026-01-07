import { createApi } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import axios from "axios";
import type { AxiosError } from "axios";
import { supabase } from "../../lib/supabase";
import type { ApiRequest, ApiError } from "../../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

async function getCachedAuthToken(): Promise<string | null> {
  const now = Date.now();

  if (cachedToken && now < tokenExpiry) {
    return cachedToken;
  }

  try {
    const { data: sessionData } = await supabase.auth.getSession();
    cachedToken = sessionData.session?.access_token || null;
    tokenExpiry = now + 30000;
    return cachedToken;
  } catch {
    cachedToken = null;
    tokenExpiry = 0;
    return null;
  }
}

export function clearAuthTokenCache(): void {
  cachedToken = null;
  tokenExpiry = 0;
}

const axiosBaseQuery = (): BaseQueryFn<ApiRequest, unknown, ApiError> => {
  return async (request) => {
    try {
      const token = await getCachedAuthToken();

      const isSimpleGet = typeof request === "string";

      const url = isSimpleGet ? request : request.url;
      const method = isSimpleGet ? "GET" : request.method || "GET";
      const data = isSimpleGet ? undefined : request.body;
      const params = isSimpleGet ? undefined : request.params;

      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const response = await api({ url, method, data, params, headers });

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

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  keepUnusedDataFor: 120,
  refetchOnFocus: true,
  refetchOnReconnect: true,

  tagTypes: [
    "User",
    "Project",
    "Task",
    "Team",
    "ProjectFile",
    "CalendarEvent",
    "Notification",
    "CustomField",
    "CustomFieldValue",
  ],
  endpoints: () => ({}),
});
