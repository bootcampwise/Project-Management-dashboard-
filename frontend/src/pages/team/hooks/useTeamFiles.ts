import { useState, useEffect, useRef, useMemo } from "react";
import type { TeamFile, Team } from "../../../types";
import { useLazyGetProjectAttachmentsQuery } from "../../../store/api/projectApiSlice";
import { useDeleteAttachmentMutation } from "../../../store/api/taskApiSlice";
import {
  useLazyDownloadFileQuery,
  useDeleteFileMutation,
} from "../../../store/api/storageApiSlice";
import { showToast, getErrorMessage } from "../../../components/ui";
import {
  getCachedFileUrl,
  setCachedFileUrl,
  clearCachedFileUrl,
} from "../../../utils/fileUrlCache";

export const useTeamFiles = (
  activeTeam?: Team | null,
  allTeams: Team[] = [],
  enabled: boolean = true,
) => {
  const [allFiles, setAllFiles] = useState<TeamFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [fetchProjectAttachments] = useLazyGetProjectAttachmentsQuery();
  const [deleteAttachment] = useDeleteAttachmentMutation();
  const [downloadFile] = useLazyDownloadFileQuery();
  const [deleteStorageFile] = useDeleteFileMutation();

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const projectsToFetch = activeTeam
    ? activeTeam.projects
    : allTeams.flatMap((t) => t.projects || []);

  const projectIdsString =
    projectsToFetch
      ?.map((p) => p.id)
      .sort()
      .join(",") || "";

  useEffect(() => {
    if (!enabled) return;

    if (!projectsToFetch?.length) {
      setAllFiles([]);
      return;
    }

    const fetchFilesFromTeamProjects = async () => {
      setIsLoading(true);
      try {
        const projectIds = projectsToFetch.map((p) => p.id);
        const results = await Promise.all(
          projectIds.map((projectId) =>
            fetchProjectAttachments(projectId)
              .unwrap()
              .catch(() => []),
          ),
        );

        const combinedFiles = results.flat();

        setAllFiles(combinedFiles);
      } catch (error) {
        console.error("Error fetching team files:", error);
        setAllFiles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilesFromTeamProjects();
  }, [projectIdsString, fetchProjectAttachments, enabled]);

  const files = useMemo(() => {
    const taskAttachments = allFiles.filter((file) => {
      const filePath = file.url || file.filePath || "";

      if (filePath.includes("/avatars/") || filePath.startsWith("avatars/")) {
        return false;
      }

      if (!file.task) {
        return false;
      }
      return true;
    });

    if (!activeTeam) {
      return taskAttachments;
    }

    if (!activeTeam.memberIds?.length) {
      return taskAttachments;
    }

    return taskAttachments.filter(
      (file) => file.user?.id && activeTeam.memberIds.includes(file.user.id),
    );
  }, [allFiles, activeTeam]);

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

  const getFileUrl = async (file: TeamFile): Promise<string | null> => {
    const filePath = file.url || file.filePath;
    if (!filePath) return null;

    if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
      return filePath;
    }

    const cleanPath = filePath.startsWith("/") ? filePath.slice(1) : filePath;

    const cachedUrl = getCachedFileUrl(cleanPath);
    if (cachedUrl) {
      return cachedUrl;
    }
    try {
      const result = await downloadFile({
        bucket: "attachments",
        path: cleanPath,
      }).unwrap();

      if (result) {
        setCachedFileUrl(cleanPath, result, 300);
        return result;
      }
      return null;
    } catch (error) {
      showToast.error(`Failed to load file. ${getErrorMessage(error)}`);
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
      const filePath = file.url || file.filePath;
      if (filePath && !filePath.startsWith("http")) {
        const cleanPath = filePath.startsWith("/")
          ? filePath.slice(1)
          : filePath;

        clearCachedFileUrl(cleanPath);

        await deleteStorageFile({
          bucket: "attachments",
          path: cleanPath,
        }).unwrap();
      }

      await deleteAttachment(file.id).unwrap();

      setAllFiles((prev) => prev.filter((f) => f.id !== file.id));

      showToast.success("File deleted successfully");
    } catch (error) {
      showToast.error(`Failed to delete file. ${getErrorMessage(error)}`);
    } finally {
      setDeletingId(null);
      setOpenMenuId(null);
    }
  };

  return {
    activeTeam,
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
