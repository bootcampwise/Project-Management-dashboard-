import { apiSlice } from "./apiSlice";
import { supabase } from "../../lib/supabase";
import type {
  UploadFileParams,
  DeleteFileParams,
  UploadResult,
} from "../../types";

// ============================================
// STORAGE API ENDPOINTS
// ============================================
// Handles all file storage operations via Supabase storage

export const storageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Upload a file to Supabase storage
    uploadFile: builder.mutation<UploadResult, UploadFileParams>({
      queryFn: async ({ bucket, path, file }) => {
        try {
          const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(path, file, { upsert: true });

          if (uploadError) throw uploadError;

          const {
            data: { publicUrl },
          } = supabase.storage.from(bucket).getPublicUrl(path);

          return { data: { path, publicUrl } };
        } catch (err: unknown) {
          const message =
            err instanceof Error ? err.message : "File upload failed";
          return { error: { status: 500, data: message } };
        }
      },
      invalidatesTags: (_result, _error, { bucket }) => {
        if (bucket === "avatars") return ["User"];
        if (bucket === "attachments") return ["Task"];
        return [];
      },
    }),

    // Delete a file from storage
    deleteFile: builder.mutation<void, DeleteFileParams>({
      queryFn: async ({ bucket, path }) => {
        try {
          const { error } = await supabase.storage.from(bucket).remove([path]);
          if (error) throw error;
          return { data: undefined };
        } catch (err: unknown) {
          const message =
            err instanceof Error ? err.message : "File deletion failed";
          return { error: { status: 500, data: message } };
        }
      },
    }),

    // Get public URL for a file (lazy query for on-demand fetching)
    downloadFile: builder.query<string, { bucket: string; path: string }>({
      queryFn: async ({ bucket, path }) => {
        try {
          const { data } = supabase.storage.from(bucket).getPublicUrl(path);
          return { data: data.publicUrl };
        } catch (err: unknown) {
          const message =
            err instanceof Error ? err.message : "Download failed";
          return { error: { status: 500, data: message } };
        }
      },
    }),
  }),
});

export const {
  useUploadFileMutation,
  useDeleteFileMutation,
  useLazyDownloadFileQuery,
} = storageApiSlice;
