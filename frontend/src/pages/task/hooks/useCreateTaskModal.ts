import React, { useState, useRef, useEffect } from "react";
import type {
  CreateTaskPayload,
  UseCreateTaskModalProps,
} from "../../../types";
import { useGetProjectsQuery } from "../../../store/api/projectApiSlice";
import { useGetTeamMembersQuery } from "../../../store/api/teamApiSlice";
import { useGetSessionQuery } from "../../../store/api/authApiSlice";
import { useUploadFileMutation } from "../../../store/api/storageApiSlice";
import { showToast, getErrorMessage } from "../../../components/ui";

export const useCreateTaskModal = ({
  isOpen,
  onClose,
  onCreate,
  onUpdate,
  initialStatus,
  task,
}: UseCreateTaskModalProps) => {
  const { data: projects = [], isLoading } = useGetProjectsQuery();
  const { data: teamMembers = [] } = useGetTeamMembersQuery();
  const { data: user } = useGetSessionQuery();
  const [uploadFile] = useUploadFileMutation();

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState(initialStatus || "IN_PROGRESS");
  const [priority, setPriority] = useState("MEDIUM");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [actualCost, setActualCost] = useState<string>("15");

  useEffect(() => {
    if (isOpen && task) {
      setTitle(task.name || task.title || "");
      setStatus(task.status || initialStatus || "IN_PROGRESS");
      setPriority(task.priority || "MEDIUM");
      setTags(
        task.tags
          ? task.tags.map((t) => (typeof t === "string" ? t : t.text))
          : [],
      );
      setDescription(task.description || "");
      setAttachments([]);

      if (typeof task.project === "string") {
        const p = projects.find((p) => p.name === task.project);
        if (p) setSelectedProjectId(p.id);
      } else if (task.project?.id) {
        setSelectedProjectId(task.project.id);
      }

      setDueDate(task.dueDate || task.endDate || "");
      setActualCost(task.actualCost ? String(task.actualCost) : "15");

      if (task.assignees) {
        setAssigneeIds(task.assignees.map((a) => a.id));
      } else if (task.assignee) {
      }
    } else if (isOpen && !task) {
      setTitle("");
      setStatus(initialStatus || "IN_PROGRESS");
      setPriority("MEDIUM");
      setTags([]);
      setTagInput("");
      setDescription("");
      setAttachments([]);
      setDueDate("");
      setActualCost("15");
      setAssigneeIds([]);
      if (projects.length > 0 && !selectedProjectId)
        setSelectedProjectId(projects[0].id);
    }
  }, [isOpen, task, projects, initialStatus]);

  const [assigneeIds, setAssigneeIds] = useState<string[]>([]);
  const [assigneeSearch, setAssigneeSearch] = useState("");
  const [allUsers, setAllUsers] = useState<
    { id: string; name: string; avatar?: string }[]
  >([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  const uniqueMembers = React.useMemo(() => {
    if (allUsers.length > 0) {
      return allUsers;
    }

    const allMembers: { id: string; name: string; avatar?: string }[] = [];

    if (selectedProject?.members) {
      allMembers.push(...selectedProject.members);
    }

    if (selectedProject?.teams) {
      selectedProject.teams.forEach((team) => {
        if (team.members) {
          allMembers.push(...team.members);
        }
      });
    }

    const uniqueMap = new Map();
    allMembers.forEach((m) => {
      if (!uniqueMap.has(m.id)) {
        uniqueMap.set(m.id, m);
      }
    });

    return Array.from(uniqueMap.values());
  }, [selectedProject, allUsers]);

  const filteredMembers = uniqueMembers.filter((member) =>
    (member.name || "")
      .toLowerCase()
      .includes(assigneeSearch.trim().toLowerCase()),
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (teamMembers.length > 0) {
      setAllUsers(
        teamMembers.map((m) => ({
          id: String(m.id),
          name: m.name,
          avatar: m.avatar,
        })),
      );
    }
  }, [teamMembers]);

  useEffect(() => {
    if (isOpen && projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
  }, [isOpen, projects, selectedProjectId]);

  useEffect(() => {
    if (isOpen && initialStatus) {
      setStatus(initialStatus);
    }
  }, [isOpen, initialStatus]);

  useEffect(() => {
    setAssigneeIds([]);
    setAssigneeSearch("");
  }, [selectedProjectId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmedTag = tagInput.trim();
      if (trimmedTag && !tags.includes(trimmedTag)) {
        setTags([...tags, trimmedTag]);
        setTagInput("");
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleToggleAssignee = (memberId: string) => {
    setAssigneeIds((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId],
    );
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      showToast.error("Please enter a task title");
      return;
    }

    setIsSubmitting(true);

    if (!selectedProjectId && projects.length > 0) {
      setSelectedProjectId(projects[0].id);
    }

    try {
      const uploadedAttachments: {
        name: string;
        filePath: string;
        size: number;
        mimeType: string;
      }[] = [];

      if (attachments.length > 0) {
        if (!user?.id) {
          throw new Error("User not authenticated");
        }

        for (const file of attachments) {
          const fileName = `${Date.now()}-${file.name.replace(
            /[^a-zA-Z0-9.-]/g,
            "_",
          )}`;
          const filePath = `${user.id}/${fileName}`;

          await uploadFile({
            bucket: "attachments",
            path: filePath,
            file,
          }).unwrap();

          uploadedAttachments.push({
            name: file.name,
            filePath: filePath,
            size: file.size,
            mimeType: file.type,
          });
        }
      }

      const payload: CreateTaskPayload = {
        title,
        status,
        priority,
        tags,
        description,
        projectId: selectedProjectId || projects[0]?.id,
        dueDate,
        assigneeIds,
        actualCost: actualCost
          ? parseFloat(actualCost.replace(/[^0-9.]/g, ""))
          : 0,
        attachments: uploadedAttachments,
      };

      if (task && onUpdate) {
        await onUpdate(String(task.id), payload);
      } else if (onCreate) {
        await onCreate(payload);
      }
      onClose();

      setTitle("");
      setStatus("IN_PROGRESS");
      setPriority("MEDIUM");
      setTags([]);
      setTagInput("");
      setDescription("");
      setAttachments([]);
      setSelectedProjectId(projects.length > 0 ? projects[0].id : "");
      setDueDate("");
      setActualCost("15");
      setAssigneeIds([]);
      setAssigneeSearch("");
    } catch (error) {
      showToast.error(`Failed to save task. ${getErrorMessage(error)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeAttachment = (indexToRemove: number) => {
    setAttachments(attachments.filter((_, index) => index !== indexToRemove));
  };

  return {
    title,
    setTitle,
    status,
    setStatus,
    priority,
    setPriority,
    tags,
    setTags,
    tagInput,
    setTagInput,
    handleAddTag,
    handleRemoveTag,
    description,
    setDescription,
    attachments,
    selectedProjectId,
    setSelectedProjectId,
    projects,
    isLoading: isLoading || isSubmitting,
    isSubmitting,
    fileInputRef,
    handleFileChange,
    handleCreate,
    removeAttachment,
    dueDate,
    setDueDate,
    assigneeIds,
    setAssigneeIds,
    assigneeSearch,
    setAssigneeSearch,
    filteredMembers,
    handleToggleAssignee,
    uniqueMembers,
    actualCost,
    setActualCost,
  };
};
