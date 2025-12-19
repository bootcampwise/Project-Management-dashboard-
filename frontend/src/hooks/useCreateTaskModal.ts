import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { CreateTaskPayload, Project } from "../types";
import type { RootState } from "../store";
import {
  setProjects,
  setLoading,
  setError,
} from "../store/slices/projectSlice";
import { apiClient } from "../lib/apiClient";
import toast from "react-hot-toast";

interface UseCreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate?: (taskData: CreateTaskPayload) => void | Promise<void>;
  initialStatus?: string;
}

export const useCreateTaskModal = ({
  isOpen,
  onClose,
  onCreate,
  initialStatus,
}: UseCreateTaskModalProps) => {
  const dispatch = useDispatch();
  const { projects, isLoading } = useSelector(
    (state: RootState) => state.project
  );

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState(initialStatus || "IN_PROGRESS");
  const [priority, setPriority] = useState("MEDIUM");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Assignee Logic
  const [assigneeIds, setAssigneeIds] = useState<string[]>([]);
  const [assigneeSearch, setAssigneeSearch] = useState("");
  const [allUsers, setAllUsers] = useState<
    { id: string; name: string; avatar?: string }[]
  >([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  // Aggregate members from project.members and project.teams.members
  const uniqueMembers = React.useMemo(() => {
    // If we have fetched all users, use them
    if (allUsers.length > 0) {
      return allUsers;
    }

    const allMembers: { id: string; name: string; avatar?: string }[] = [];

    // Add direct project members
    if (selectedProject?.members) {
      allMembers.push(...selectedProject.members);
    }

    // Add team members
    if (selectedProject?.teams) {
      selectedProject.teams.forEach((team) => {
        if (team.members) {
          allMembers.push(...team.members);
        }
      });
    }

    // Deduplicate by ID
    const uniqueMap = new Map();
    allMembers.forEach((m) => {
      if (!uniqueMap.has(m.id)) {
        uniqueMap.set(m.id, m);
      }
    });

    return Array.from(uniqueMap.values());
  }, [selectedProject, allUsers]);

  const filteredMembers = uniqueMembers.filter((member) =>
    (member.name || "").toLowerCase().includes(assigneeSearch.toLowerCase())
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch projects and users when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          dispatch(setLoading(true));

          // Fetch Projects
          const projectsResponse = await apiClient.get<Project[]>("/projects");
          dispatch(setProjects(projectsResponse));
          if (projectsResponse.length > 0 && !selectedProjectId) {
            setSelectedProjectId(projectsResponse[0].id);
          }

          // Fetch All Users for Assignee dropdown
          const usersResponse = await apiClient.get<
            { id: string; name: string; avatar?: string }[]
          >("/users");
          setAllUsers(usersResponse);
        } catch (err: unknown) {
          if (err instanceof Error) {
            dispatch(setError(err.message));
          } else {
            dispatch(setError("An unknown error occurred"));
          }
        } finally {
          dispatch(setLoading(false));
        }
      };
      fetchData();
    }
  }, [isOpen, dispatch]);

  // Update status when initialStatus changes or modal re-opens
  useEffect(() => {
    if (isOpen && initialStatus) {
      setStatus(initialStatus);
    }
  }, [isOpen, initialStatus]);

  // Clear assignees when project changes
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
        : [...prev, memberId]
    );
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      toast.error("Please enter a task title");
      return;
    }

    setIsSubmitting(true);
    console.log("[useCreateTaskModal] Starting task creation for:", title);

    if (!selectedProjectId && projects.length > 0) {
      // Fallback if somehow not set
      setSelectedProjectId(projects[0].id);
    }

    // Prepare payload for the API
    // We EXCLUDE attachments for now because the backend doesn't support them
    // and sending File objects via JSON causes issues.
    const payload: any = {
      title,
      status,
      priority,
      tags,
      description,
      projectId: selectedProjectId || projects[0]?.id,
      dueDate,
      assigneeIds,
    };

    console.log("Payload prepared:", payload);

    try {
      if (onCreate) {
        await onCreate(payload);
      }
      onClose();

      // Reset form
      setTitle("");
      setStatus("IN_PROGRESS");
      setPriority("MEDIUM");
      setTags([]);
      setTagInput("");
      setDescription("");
      setAttachments([]);
      setSelectedProjectId(projects.length > 0 ? projects[0].id : "");
      setDueDate("");
      setAssigneeIds([]);
      setAssigneeSearch("");
    } catch (error) {
      console.error("Error in onCreate:", error);
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
  };
};
