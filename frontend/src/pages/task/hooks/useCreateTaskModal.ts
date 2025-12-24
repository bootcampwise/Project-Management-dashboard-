import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type {
  CreateTaskPayload,
  Project,
  UseCreateTaskModalProps,
} from "../../../types";
import type { RootState } from "../../../store";
import {
  setProjects,
  setLoading,
  setError,
} from "../../../store/slices/projectSlice";
import { apiClient } from "../../../lib/apiClient";
import { supabase } from "../../../lib/supabase";
import toast from "react-hot-toast";

export const useCreateTaskModal = ({
  isOpen,
  onClose,
  onCreate,
  onUpdate,
  initialStatus,
  task,
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

  // Populate state when task prop changes (Edit Mode)
  useEffect(() => {
    if (isOpen && task) {
      setTitle(task.name || task.title || ""); // Handle both name/title
      setStatus(task.status || initialStatus || "IN_PROGRESS");
      setPriority(task.priority || "MEDIUM");
      setTags(
        task.tags
          ? task.tags.map((t) => (typeof t === "string" ? t : t.text))
          : []
      );
      setDescription(task.description || "");
      // Attachments handled separately or just new ones? Usually users want to see existing and add new.
      // For simplicity, we assume this hook manages NEW attachments to upload. Existing ones are displayed in detail view.
      // If we want to allow deleting existing attachments in edit, we need more logic.
      // For now, let's keep attachments state for NEW files.
      setAttachments([]);

      if (typeof task.project === "string") {
        // Need to find project ID from name? Or maybe task.project is just ID sometimes?
        // If it's a string name, we might not find it easily if duplicates.
        const p = projects.find((p) => p.name === task.project);
        if (p) setSelectedProjectId(p.id);
      } else if (task.project?.id) {
        setSelectedProjectId(task.project.id);
      }

      setDueDate(task.dueDate || task.endDate || "");

      // Populate assignees
      if (task.assignees) {
        setAssigneeIds(task.assignees.map((a) => a.id));
      } else if (task.assignee) {
        // If legacy single assignee, try to find in members
        // This uses name, which is flaky. Better if task has assignee ID.
      }
    } else if (isOpen && !task) {
      // Reset if opening in Create Mode
      setTitle("");
      setStatus(initialStatus || "IN_PROGRESS");
      setPriority("MEDIUM");
      setTags([]);
      setTagInput("");
      setDescription("");
      setAttachments([]);
      setDueDate("");
      setAssigneeIds([]);
      if (projects.length > 0 && !selectedProjectId)
        setSelectedProjectId(projects[0].id);
    }
  }, [isOpen, task, projects, initialStatus]); // StartLine: 40 (Inserting after state declarations) -> Actually simpler to append separate useEffect.

  // NOTE: I am replacing the existing state usage lines with the above block combined? No, that's messy.
  // I will just add the useEffect.

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

  /* eslint-disable @typescript-eslint/no-unused-vars */
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

    try {
      // Upload files to Supabase first
      const uploadedAttachments: {
        name: string;
        filePath: string;
        size: number;
        mimeType: string;
      }[] = [];

      if (attachments.length > 0) {
        // Need user ID for path - assuming auth state is available or we can get it from supabase session
        // For now, we will use 'anonymous' if not found, but it should be protected by RLS anyway.
        // Best to use the actual user ID.
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          throw new Error("User not authenticated");
        }

        for (const file of attachments) {
          // Skip if it's already an uploaded attachment (checking if it has metadata structure)
          // But here attachments state is File[], so we assume new uploads.

          // const fileExt = file.name.split(".").pop();
          const fileName = `${Date.now()}-${file.name.replace(
            /[^a-zA-Z0-9.-]/g,
            "_"
          )}`;
          const filePath = `${user.id}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from("attachments")
            .upload(filePath, file);

          if (uploadError) {
            console.error("Supabase upload error:", uploadError);
            throw new Error(`Failed to upload ${file.name}`);
          }

          uploadedAttachments.push({
            name: file.name,
            filePath: filePath, // Store the path relative to bucket
            size: file.size,
            mimeType: file.type,
          });
        }
      }

      // Prepare payload for the API
      const payload: CreateTaskPayload = {
        title,
        status,
        priority,
        tags,
        description,
        projectId: selectedProjectId || projects[0]?.id,
        dueDate,
        assigneeIds,
        attachments: uploadedAttachments, // Send metadata
      };

      console.log("Payload prepared:", payload);

      if (task && onUpdate) {
        // Edit Mode
        await onUpdate(String(task.id), payload);
      } else if (onCreate) {
        // Create Mode
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
    } catch (error: unknown) {
      console.error("Error in onCreate:", error);
      const message =
        error instanceof Error ? error.message : "Failed to create task";
      toast.error(message);
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
