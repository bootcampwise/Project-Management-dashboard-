import { useState, useEffect, useRef } from "react";
import { useAppSelector } from "../../../store/hooks";
import type { TeamFile } from "../../../types";
import {
  useGetProjectAttachmentsQuery,
  useLazyGetProjectAttachmentsQuery,
} from "../../../store/api/projectApiSlice";
import { useDeleteAttachmentMutation } from "../../../store/api/taskApiSlice";
import {
  useLazyDownloadFileQuery,
  useDeleteFileMutation,
} from "../../../store/api/storageApiSlice";
import { showToast } from "../../../components/ui";
import {
  getCachedFileUrl,
  setCachedFileUrl,
  clearCachedFileUrl,
} from "../../../utils/fileUrlCache";

export const useTeamFiles = () => {
  const { activeProject } = useAppSelector((state) => state.ui);

  // RTK Query hooks
  const { data: files = [], isLoading: queryLoading } =
    useGetProjectAttachmentsQuery(activeProject?.id ?? "", {
      skip: !activeProject?.id,
      // Use cached data immediately, refetch in background
      refetchOnMountOrArgChange: false,
    });

  // ⚡ Only show loading on INITIAL load (when no data exists)
  // Never show loading during background refetches - use cached data
  const isLoading = activeProject?.id
    ? queryLoading && files.length === 0
    : false;

  const [refetchFiles] = useLazyGetProjectAttachmentsQuery();
  const [deleteAttachment] = useDeleteAttachmentMutation();
  const [downloadFile] = useLazyDownloadFileQuery();
  const [deleteStorageFile] = useDeleteFileMutation();

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatSize = (bytes: number | string) => {
    if (typeof bytes === "string") return bytes;
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  // ============================================
  // OPTIMIZED: Get file URL with caching
  // ============================================
  const getFileUrl = async (file: TeamFile): Promise<string | null> => {
    const filePath = file.url || file.filePath;
    if (!filePath) return null;

    // If it's already a full URL, return it directly (no caching needed)
    if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
      return filePath;
    }

    const cleanPath = filePath.startsWith("/") ? filePath.slice(1) : filePath;

    // 1️⃣ Check cache first (instant!)
    const cachedUrl = getCachedFileUrl(cleanPath);
    if (cachedUrl) {
      return cachedUrl;
    }

    // 2️⃣ Not cached - generate signed URL
    try {
      const result = await downloadFile({
        bucket: "attachments",
        path: cleanPath,
      }).unwrap();

      if (result) {
        // 3️⃣ Store in cache for 5 minutes
        setCachedFileUrl(cleanPath, result, 300);
        return result;
      }
      return null;
    } catch {
      showToast.error("Failed to load file");
      return null;
    }
  };

  const handleFileClick = async (file: TeamFile) => {
    const fileUrl = await getFileUrl(file);
    if (fileUrl) {
      window.open(fileUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleMenuClick = (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === fileId ? null : fileId);
  };

  const handleDeleteFile = async (file: TeamFile) => {
    setDeletingId(file.id);
    try {
      // 1. Delete from Supabase storage using RTK Query
      const filePath = file.url || file.filePath;
      if (filePath && !filePath.startsWith("http")) {
        const cleanPath = filePath.startsWith("/")
          ? filePath.slice(1)
          : filePath;

        // Clear from URL cache first
        clearCachedFileUrl(cleanPath);

        await deleteStorageFile({
          bucket: "attachments",
          path: cleanPath,
        }).unwrap();
      }

      // 2. Delete from database via RTK Query
      await deleteAttachment(file.id).unwrap();

      // 3. Refresh the file list
      if (activeProject?.id) {
        refetchFiles(activeProject.id);
      }
      showToast.success("File deleted successfully");
    } catch (error) {
      console.error("Failed to delete file:", error);
      showToast.error("Failed to delete file");
    } finally {
      setDeletingId(null);
      setOpenMenuId(null);
    }
  };

  return {
    activeProject,
    files,
    isLoading,
    openMenuId,
    deletingId,
    menuRef,
    formatSize,
    getFileUrl,
    handleFileClick,
    handleMenuClick,
    handleDeleteFile,
    setOpenMenuId,
  };
};
