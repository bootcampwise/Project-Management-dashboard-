import { useState, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import type { Task, Attachment, UseTaskDetailModalProps } from "../../types";
import { getTaskDetails, fetchTasks } from "../../store/slices/taskSlice";
import { fetchTeamMembers } from "../../store/slices/teamSlice";
import { apiClient } from "../../lib/apiClient";
import { supabase } from "../../lib/supabase";
import { toast } from "react-hot-toast";

export const useTaskDetailModal = ({
  isOpen,
  onClose,
  task: initialTask,
  onEdit,
}: UseTaskDetailModalProps) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { tasks } = useAppSelector((state) => state.task);
  const { members: teamMembers } = useAppSelector((state) => state.team);

  // Get the latest task data from Redux, falling back to the initial prop
  const task =
    tasks.find((t) => String(t.id) === String(initialTask?.id)) || initialTask;

  const [newSubtask, setNewSubtask] = useState("");
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [assigningSubtaskId, setAssigningSubtaskId] = useState<string | null>(
    null
  );
  const [subtaskAssigneeSearch, setSubtaskAssigneeSearch] = useState("");

  // Fetch team members when modal opens
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchTeamMembers());
    }
  }, [isOpen, dispatch]);

  // Filter team members based on search query
  const filteredTeamMembers = useMemo(() => {
    if (!subtaskAssigneeSearch.trim()) {
      return teamMembers;
    }
    const searchLower = subtaskAssigneeSearch.toLowerCase();
    return teamMembers.filter(
      (member) =>
        member.name?.toLowerCase().includes(searchLower) ||
        member.email?.toLowerCase().includes(searchLower)
    );
  }, [teamMembers, subtaskAssigneeSearch]);

  // Refresh task details when modal opens
  useEffect(() => {
    if (isOpen && initialTask?.id) {
      dispatch(getTaskDetails(String(initialTask.id)));
    }
  }, [isOpen, initialTask?.id, dispatch]);

  const handleEditTask = () => {
    if (task && onEdit) {
      onEdit(task);
      setIsMenuOpen(false);
    }
  };

  const deleteTask = async () => {
    if (!task) return;
    try {
      await apiClient.delete(`/tasks/${task.id}`);
      dispatch(fetchTasks());
      toast.success("Task deleted successfully");
      onClose();
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast.error("Failed to delete task");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !task) return;

    const toastId = toast.loading("Uploading attachment...");
    try {
      // 1. Upload to Supabase
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      if (!currentUser) throw new Error("Authentication required");

      const fileName = `${Date.now()}-${file.name.replace(
        /[^a-zA-Z0-9.-]/g,
        "_"
      )}`;
      const filePath = `${currentUser.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("attachments")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Sync metadata with backend
      const attachmentData = {
        taskId: String(task.id),
        name: file.name,
        url: filePath,
        size: file.size,
        mimeType: file.type,
      };

      await apiClient.post("/attachments", attachmentData);

      dispatch(getTaskDetails(String(task.id)));
      toast.success("Attachment uploaded", { id: toastId });
    } catch (error: unknown) {
      console.error("Failed to upload attachment:", error);
      const message =
        error instanceof Error ? error.message : "Failed to upload attachment";
      toast.error(message, { id: toastId });
    }
  };

  const handleAddSubtask = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newSubtask.trim() && task) {
      try {
        await apiClient.post(`/tasks/${task.id}/subtasks`, {
          title: newSubtask,
        });
        setNewSubtask("");
        dispatch(getTaskDetails(String(task.id)));
        toast.success("Subtask added");
      } catch (error) {
        console.error("Failed to add subtask:", error);
        toast.error("Failed to add subtask");
      }
    }
  };

  const handleDeleteSubtask = async (subtaskId: string) => {
    if (!task) return;
    try {
      await apiClient.delete(`/tasks/${task.id}/subtasks/${subtaskId}`);
      dispatch(getTaskDetails(String(task.id)));
      toast.success("Subtask deleted");
    } catch (error) {
      console.error("Failed to delete subtask:", error);
      toast.error("Failed to delete subtask");
    }
  };

  const handleAssignSubtask = async (
    subtaskId: string,
    assigneeId: string,
    action: "add" | "remove"
  ) => {
    if (!task) return;
    try {
      await apiClient.patch(`/tasks/${task.id}/subtasks/${subtaskId}/assign`, {
        assigneeId,
        action,
      });
      dispatch(getTaskDetails(String(task.id)));
      // Don't close dropdown to allow assigning more people
      if (action === "add") {
        toast.success("Assignee added to subtask");
      } else {
        toast.success("Assignee removed from subtask");
      }
    } catch (error) {
      console.error("Failed to assign subtask:", error);
      toast.error("Failed to update subtask assignees");
    }
  };

  const handleToggleSubtask = async (subtaskId: string, completed: boolean) => {
    if (!task) return;
    try {
      await apiClient.patch(`/tasks/${task.id}/subtasks/${subtaskId}/toggle`, {
        completed,
      });
      dispatch(getTaskDetails(String(task.id)));
    } catch (error) {
      console.error("Failed to toggle subtask:", error);
      toast.error("Failed to update subtask");
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !task || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await apiClient.post(`/comments`, {
        taskId: String(task.id),
        content: newComment,
      });
      setNewComment("");
      dispatch(getTaskDetails(String(task.id)));
      toast.success("Comment added");
    } catch (error) {
      console.error("Failed to add comment:", error);
      toast.error("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTagSubmit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() && task) {
      try {
        const currentTags =
          task.tags?.map((t: NonNullable<Task["tags"]>[number]) => t.text) ||
          [];
        // Prevent duplicates
        if (currentTags.includes(tagInput.trim())) {
          setTagInput("");
          setIsAddingTag(false);
          return;
        }

        await apiClient.patch(`/tasks/${task.id}`, {
          tags: [...currentTags, tagInput.trim()],
        });
        setTagInput("");
        setIsAddingTag(false);
        dispatch(getTaskDetails(String(task.id)));
        toast.success("Tag added");
      } catch (error) {
        console.error("Failed to add tag:", error);
        toast.error("Failed to add tag");
      }
    } else if (e.key === "Escape") {
      setIsAddingTag(false);
    }
  };

  const handleDownload = async (
    e: React.MouseEvent,
    attachment: Attachment
  ) => {
    e.stopPropagation();
    try {
      if (attachment.url.startsWith("http")) {
        window.open(attachment.url, "_blank");
        return;
      }

      const { data, error } = await supabase.storage
        .from("attachments")
        .createSignedUrl(attachment.url, 60);

      if (error) {
        console.error("Error creating signed URL:", error);
        throw error;
      }

      if (data?.signedUrl) {
        const link = document.createElement("a");
        link.href = data.signedUrl;
        link.download = attachment.name;
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success("Download started");
      }
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download file");
    }
  };

  return {
    task,
    user,
    newSubtask,
    setNewSubtask,
    newComment,
    setNewComment,
    isSubmitting,
    isMenuOpen,
    setIsMenuOpen,
    isAddingTag,
    setIsAddingTag,
    tagInput,
    setTagInput,
    assigningSubtaskId,
    setAssigningSubtaskId,
    subtaskAssigneeSearch,
    setSubtaskAssigneeSearch,
    filteredTeamMembers,
    handleEditTask,
    deleteTask,
    handleFileChange,
    handleAddSubtask,
    handleDeleteSubtask,
    handleAssignSubtask,
    handleToggleSubtask,
    handleAddComment,
    handleTagSubmit,
    handleDownload,
  };
};
