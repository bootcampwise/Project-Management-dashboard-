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

interface UseCreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate?: (taskData: CreateTaskPayload) => void;
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
  const [status, setStatus] = useState(initialStatus || "In Progress");
  const [priority, setPriority] = useState("Medium");
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [dueDate, setDueDate] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch projects when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchProjects = async () => {
        try {
          dispatch(setLoading(true));
          const response = await apiClient.get<Project[]>("/projects");
          dispatch(setProjects(response));
          if (response.length > 0 && !selectedProjectId) {
            setSelectedProjectId(response[0].id);
          }
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
      fetchProjects();
    }
  }, [isOpen, dispatch]);

  // Update status when initialStatus changes or modal re-opens
  useEffect(() => {
    if (isOpen && initialStatus) {
      setStatus(initialStatus);
    }
  }, [isOpen, initialStatus]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };

  const handleCreate = () => {
    if (!selectedProjectId && projects.length > 0) {
      // Fallback if somehow not set
      setSelectedProjectId(projects[0].id);
    }

    const newTask: CreateTaskPayload = {
      title,
      status,
      priority,
      tags: tags.split(",").map((t) => t.trim()),
      description,
      attachments,
      projectId: selectedProjectId,
      dueDate: dueDate || undefined,
    };
    console.log("Creating task:", newTask);
    if (onCreate) onCreate(newTask);
    onClose();
    // Reset form
    setTitle("");
    setStatus("In Progress");
    setPriority("Medium");
    setTags("");
    setDescription("");
    setAttachments([]);
    setSelectedProjectId(projects.length > 0 ? projects[0].id : "");
    setDueDate("");
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
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
    description,
    setDescription,
    attachments,
    selectedProjectId,
    setSelectedProjectId,
    projects,
    isLoading,
    fileInputRef,
    handleFileChange,
    handleCreate,
    removeAttachment,
    dueDate,
    setDueDate,
  };
};
