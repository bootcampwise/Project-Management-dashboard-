import { useState, useEffect, useMemo } from "react";
import type { Task, Attachment, UseTaskDetailModalProps } from "../../../types";
import { useGetTeamMembersQuery } from "../../../store/api/teamApiSlice";
import { useGetSessionQuery } from "../../../store/api/authApiSlice";
import {
  useLazyGetTaskQuery,
  useGetTasksQuery,
  useDeleteTaskMutation,
  useAddSubtaskMutation,
  useDeleteSubtaskMutation,
  useToggleSubtaskMutation,
  useAssignSubtaskMutation,
  useAddCommentMutation,
  useAddTagMutation,
  useAddAttachmentMutation,
} from "../../../store/api/taskApiSlice";
import {
  useUploadFileMutation,
  useLazyDownloadFileQuery,
} from "../../../store/api/storageApiSlice";
import { showToast } from "../../../components/ui";

export const useTaskDetailModal = ({
  isOpen,
  onClose,
  task: initialTask,
  onEdit,
}: UseTaskDetailModalProps) => {
  // Get user from RTK Query
  const { data: user } = useGetSessionQuery();

  // Get tasks from RTK Query (for fetching updated task data)
  const { data: tasks = [] } = useGetTasksQuery();

  // ============================================
  // RTK QUERY HOOKS
  // ============================================
  const { data: teamMembers = [] } = useGetTeamMembersQuery();
  const [getTask] = useLazyGetTaskQuery();
  const { refetch: refetchTasks } = useGetTasksQuery();

  // Mutations
  const [deleteTaskMutation] = useDeleteTaskMutation();
  const [addSubtask] = useAddSubtaskMutation();
  const [deleteSubtask] = useDeleteSubtaskMutation();
  const [toggleSubtask] = useToggleSubtaskMutation();
  const [assignSubtask] = useAssignSubtaskMutation();
  const [addComment] = useAddCommentMutation();
  const [addTag] = useAddTagMutation();
  const [addAttachment] = useAddAttachmentMutation();
  const [uploadFile] = useUploadFileMutation();
  const [downloadFile] = useLazyDownloadFileQuery();

  // ============================================
  // STATE
  // ============================================

  // Get the latest task data from Redux, falling back to the initial prop
  const task =
    tasks.find((t) => String(t.id) === String(initialTask?.id)) || initialTask;

  const [newSubtask, setNewSubtask] = useState("");
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [assigningSubtaskId, setAssigningSubtaskId] = useState<string | null>(
    null
  );
  const [subtaskAssigneeSearch, setSubtaskAssigneeSearch] = useState("");

  // ============================================
  // EFFECTS
  // ============================================

  // Get task details when modal opens
  useEffect(() => {
    if (isOpen && initialTask?.id) {
      getTask(String(initialTask.id));
    }
  }, [isOpen, initialTask?.id, getTask]);

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

  // ============================================
  // HANDLERS
  // ============================================

  const handleEditTask = () => {
    if (task && onEdit) {
      onEdit(task);
    }
  };

  const deleteTask = async () => {
    if (!task) return;
    try {
      await deleteTaskMutation(String(task.id)).unwrap();
      refetchTasks();
      showToast.success("Task deleted successfully");
      onClose();
    } catch (error) {
      console.error("Failed to delete task:", error);
      showToast.error("Failed to delete task");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !task) return;

    const toastId = showToast.loading("Uploading attachment...");
    try {
      // 1. Upload to storage using RTK Query
      if (!user?.id) throw new Error("Authentication required");

      const fileName = `${Date.now()}-${file.name.replace(
        /[^a-zA-Z0-9.-]/g,
        "_"
      )}`;
      const filePath = `${user.id}/${fileName}`;

      const uploadResult = await uploadFile({
        bucket: "attachments",
        path: filePath,
        file,
      }).unwrap();

      // 2. Save attachment metadata via RTK Query
      await addAttachment({
        taskId: String(task.id),
        name: file.name,
        url: uploadResult.path,
        type: file.type,
        size: file.size,
      }).unwrap();

      getTask(String(task.id));
      showToast.success("Attachment uploaded", { id: toastId });
    } catch (error: unknown) {
      console.error("Failed to upload attachment:", error);
      const message =
        error instanceof Error ? error.message : "Failed to upload attachment";
      showToast.error(message, { id: toastId });
    }
  };

  const handleAddSubtask = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newSubtask.trim() && task) {
      try {
        await addSubtask({
          taskId: String(task.id),
          title: newSubtask,
        }).unwrap();
        setNewSubtask("");
        getTask(String(task.id));
        showToast.success("Subtask added");
      } catch (error) {
        console.error("Failed to add subtask:", error);
        showToast.error("Failed to add subtask");
      }
    }
  };

  const handleDeleteSubtask = async (subtaskId: string) => {
    if (!task) return;
    try {
      await deleteSubtask({
        taskId: String(task.id),
        subtaskId,
      }).unwrap();
      getTask(String(task.id));
      showToast.success("Subtask deleted");
    } catch (error) {
      console.error("Failed to delete subtask:", error);
      showToast.error("Failed to delete subtask");
    }
  };

  const handleAssignSubtask = async (
    subtaskId: string,
    assigneeId: string,
    _action: "add" | "remove"
  ) => {
    if (!task) return;
    try {
      await assignSubtask({
        taskId: String(task.id),
        subtaskId,
        userId: assigneeId,
      }).unwrap();
      getTask(String(task.id));
      showToast.success("Subtask assignee updated");
    } catch (error) {
      console.error("Failed to assign subtask:", error);
      showToast.error("Failed to update subtask assignees");
    }
  };

  const handleToggleSubtask = async (subtaskId: string, completed: boolean) => {
    if (!task) return;
    try {
      await toggleSubtask({
        taskId: String(task.id),
        subtaskId,
        completed,
      }).unwrap();
      getTask(String(task.id));
    } catch (error) {
      console.error("Failed to toggle subtask:", error);
      showToast.error("Failed to update subtask");
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !task || isSubmitting || !user) return;

    setIsSubmitting(true);
    try {
      await addComment({
        taskId: String(task.id),
        content: newComment,
        userId: user.id,
      }).unwrap();
      setNewComment("");
      getTask(String(task.id));
      showToast.success("Comment added");
    } catch (error) {
      console.error("Failed to add comment:", error);
      showToast.error("Failed to add comment");
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

        await addTag({
          taskId: String(task.id),
          tags: [...currentTags, tagInput.trim()],
        }).unwrap();
        setTagInput("");
        setIsAddingTag(false);
        getTask(String(task.id));
        showToast.success("Tag added");
      } catch (error) {
        console.error("Failed to add tag:", error);
        showToast.error("Failed to add tag");
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

      // Get public URL using RTK Query
      const url = await downloadFile({
        bucket: "attachments",
        path: attachment.url,
      }).unwrap();

      if (url) {
        const link = document.createElement("a");
        link.href = url;
        link.download = attachment.name;
        document.body.appendChild(link);
        link.click();
        link.remove();
        showToast.success("Download started");
      }
    } catch (error) {
      console.error("Download failed:", error);
      showToast.error("Failed to download file");
    }
  };

  // ============================================
  // RETURN
  // ============================================

  return {
    task,
    user,
    newSubtask,
    setNewSubtask,
    newComment,
    setNewComment,
    isSubmitting,
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
