import { useState, useMemo } from "react";
import type { Task, Attachment, UseTaskDetailModalProps } from "../../../types";
import { useGetTeamMembersQuery } from "../../../store/api/teamApiSlice";
import { useGetSessionQuery } from "../../../store/api/authApiSlice";
import {
  useGetTaskQuery,
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
import { showToast, getErrorMessage } from "../../../components/ui";

export const useTaskDetailModal = ({
  isOpen,
  onClose,
  task: initialTask,
  onEdit,
}: UseTaskDetailModalProps) => {
  // Get user from RTK Query
  const { data: user } = useGetSessionQuery();

  // ============================================
  // RTK QUERY HOOKS
  // ============================================
  const { data: teamMembers = [] } = useGetTeamMembersQuery();

  // Use useGetTaskQuery to get real-time task data with comments
  // Skip if modal is closed or no task ID
  const { data: taskData, refetch: refetchTask } = useGetTaskQuery(
    String(initialTask?.id || ""),
    { skip: !isOpen || !initialTask?.id }
  );

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

  // Use the fetched task data, falling back to initial task
  const task = taskData || initialTask;

  // ============================================
  // STATE
  // ============================================
  const [newSubtask, setNewSubtask] = useState("");
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [assigningSubtaskId, setAssigningSubtaskId] = useState<string | null>(
    null
  );
  const [subtaskAssigneeSearch, setSubtaskAssigneeSearch] = useState("");

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
      showToast.success("Task deleted successfully");
      onClose();
    } catch (error) {
      showToast.error(`Failed to delete task. ${getErrorMessage(error)}`);
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

      refetchTask();
      showToast.success("Attachment uploaded", { id: toastId });
    } catch (error) {
      showToast.error(
        `Failed to upload attachment. ${getErrorMessage(error)}`,
        { id: toastId }
      );
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
        refetchTask();
        showToast.success("Subtask added");
      } catch (error) {
        showToast.error(`Failed to add subtask. ${getErrorMessage(error)}`);
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
      refetchTask();
      showToast.success("Subtask deleted");
    } catch (error) {
      showToast.error(`Failed to delete subtask. ${getErrorMessage(error)}`);
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
      refetchTask();
      showToast.success("Subtask assignee updated");
    } catch (error) {
      showToast.error(
        `Failed to update subtask assignees. ${getErrorMessage(error)}`
      );
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
      refetchTask();
    } catch (error) {
      showToast.error(`Failed to update subtask. ${getErrorMessage(error)}`);
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
      refetchTask();
      showToast.success("Comment added");
    } catch (error) {
      showToast.error(`Failed to add comment. ${getErrorMessage(error)}`);
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
        refetchTask();
        showToast.success("Tag added");
      } catch (error) {
        showToast.error(`Failed to add tag. ${getErrorMessage(error)}`);
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
      showToast.error(`Failed to download file. ${getErrorMessage(error)}`);
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
