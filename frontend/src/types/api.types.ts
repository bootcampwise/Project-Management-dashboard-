export type ApiRequest =
  | string
  | {
      url: string;
      method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
      body?: unknown;
      params?: Record<string, unknown>;
    };

export interface ApiError {
  status?: number;
  data?: unknown;
}

export interface UploadFileParams {
  bucket: string;
  path: string;
  file: File;
}

export interface DeleteFileParams {
  bucket: string;
  path: string;
}

export interface UploadResult {
  path: string;
  publicUrl: string;
}

export type CacheItem = {
  url: string;
  expiresAt: number;
};
