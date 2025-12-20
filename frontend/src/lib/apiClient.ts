import { supabase } from "./supabase";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

class ApiClient {
  // Get headers with Supabase access token
  private async getAuthHeaders(): Promise<HeadersInit> {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const token = session?.access_token;

    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // GET request
  async get<T>(endpoint: string): Promise<T> {
    const headers = await this.getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers,
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    const data = await res.json();
    return data.data || data;
  }

  // POST request
  async post<T>(endpoint: string, body?: object | FormData): Promise<T> {
    const headers = (await this.getAuthHeaders()) as Record<string, string>;

    let requestBody: BodyInit | undefined;
    if (body instanceof FormData) {
      delete headers["Content-Type"];
      requestBody = body;
    } else {
      requestBody = JSON.stringify(body);
    }

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: requestBody,
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    const data = await res.json();
    return data.data || data;
  }

  // PATCH request
  async patch<T>(endpoint: string, body?: object): Promise<T> {
    const headers = await this.getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(body),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    const data = await res.json();
    return data.data || data;
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    const headers = await this.getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers,
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    const data = await res.json();
    return data.data || data;
  }
}

export const apiClient = new ApiClient();
