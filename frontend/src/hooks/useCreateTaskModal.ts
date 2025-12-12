import React, { useState, useRef, useEffect } from "react";
import type { CreateTaskPayload } from "../types";

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
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState(initialStatus || "In Progress");
  const [priority, setPriority] = useState("Medium");
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
    const newTask: CreateTaskPayload = {
      title,
      status,
      priority,
      tags: tags.split(",").map((t) => t.trim()),
      description,
      attachments,
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
    fileInputRef,
    handleFileChange,
    handleCreate,
    removeAttachment,
  };
};
