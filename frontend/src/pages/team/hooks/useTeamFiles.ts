import { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { fetchProjectAttachments } from "../../../store/slices/projectSlice";
import type { TeamFile } from "../../../types";
import { supabase } from "../../../lib/supabase";
import { apiClient } from "../../../lib/apiClient";
import toast from "react-hot-toast";
import React from "react";

export const useTeamFiles = () => {
  const dispatch = useAppDispatch();
  const { activeProject, files, isLoading } = useAppSelector(
    (state) => state.project
  );
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeProject?.id) {
      // @ts-ignore
      dispatch(fetchProjectAttachments(activeProject.id));
    }
  }, [dispatch, activeProject?.id]);

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

  const getFileUrl = (file: TeamFile): string | null => {
    const url = file.url || file.filePath;
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    const cleanPath = url.startsWith("/") ? url.slice(1) : url;
    const { data } = supabase.storage
      .from("attachments")
      .getPublicUrl(cleanPath);
    return data?.publicUrl || null;
  };

  const handleFileClick = (file: TeamFile) => {
    const fileUrl = getFileUrl(file);
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
      // 1. Delete from Supabase storage
      const filePath = file.url || file.filePath;
      if (filePath && !filePath.startsWith("http")) {
        const cleanPath = filePath.startsWith("/")
          ? filePath.slice(1)
          : filePath;
        await supabase.storage.from("attachments").remove([cleanPath]);
      }

      // 2. Delete from database
      await apiClient.delete(`/attachments/${file.id}`);

      // 3. Refresh the file list
      if (activeProject?.id) {
        // @ts-ignore
        dispatch(fetchProjectAttachments(activeProject.id));
      }
      toast.success("File deleted successfully");
    } catch (error) {
      console.error("Failed to delete file:", error);
      toast.error("Failed to delete file");
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
    setOpenMenuId, // Needed for closing manually if needed
  };
};
