import React, { useState, useRef, useEffect } from "react";
import { X, File as FileIcon, Upload, ChevronDown } from "lucide-react";
import { IconButton, Input, Select, Textarea, Tag } from "../ui";

import type { CreateTaskModalProps } from "../../types";

import { useCreateTaskModal } from "../../pages/task/hooks/useCreateTaskModal";

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  onUpdate,
  initialStatus,
  task,
}) => {
  const {
    title,
    setTitle,
    status,
    setStatus,
    priority,
    setPriority,
    tags,
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
    isLoading,
    fileInputRef,
    handleFileChange,
    handleCreate,
    removeAttachment,
    dueDate,
    setDueDate,
    assigneeIds,
    assigneeSearch,
    setAssigneeSearch,
    filteredMembers,
    handleToggleAssignee,
    uniqueMembers,
    actualCost,
    setActualCost,
  } = useCreateTaskModal({
    isOpen,
    onClose,
    onCreate,
    onUpdate,
    initialStatus,
    task,
  });

  const [isAssigneeDropdownOpen, setIsAssigneeDropdownOpen] = useState(false);
  const assigneeDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        assigneeDropdownRef.current &&
        !assigneeDropdownRef.current.contains(event.target as Node)
      ) {
        setIsAssigneeDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setIsAssigneeDropdownOpen(false);
      setAssigneeSearch("");
    }
  }, [isOpen, setAssigneeSearch]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg mx-4 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {task ? "Edit Task" : "Create New Task"}
          </h2>
          <IconButton
            icon={<X size={20} />}
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          />
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          <Select
            label="Select Project"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            disabled={isLoading || projects.length === 0}
            options={
              isLoading
                ? [{ value: "", label: "Loading projects..." }]
                : projects.length === 0
                  ? [{ value: "", label: "No projects found" }]
                  : projects.map((project) => ({
                      value: project.id,
                      label: project.name,
                    }))
            }
          />

          <Input
            type="text"
            label="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Redesign Homepage"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={[
                { value: "IN_PROGRESS", label: "In Progress" },
                { value: "BACKLOG", label: "Backlog" },
                { value: "QA", label: "QA" },
                { value: "COMPLETED", label: "Completed" },
                { value: "CANCELED", label: "Cancelled" },
                { value: "TODO", label: "To Do" },
                { value: "IN_REVIEW", label: "In Review" },
              ]}
            />

            <Select
              label="Priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              options={[
                { value: "LOW", label: "Low" },
                { value: "MEDIUM", label: "Medium" },
                { value: "HIGH", label: "High" },
                { value: "URGENT", label: "Urgent" },
              ]}
            />

            <Input
              type="date"
              label="Due Date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Task Income
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none">
                  <span className="text-sm font-medium">$</span>
                </div>
                <input
                  type="text"
                  value={actualCost}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d*\.?\d*$/.test(val)) {
                      setActualCost(val);
                    }
                  }}
                  placeholder="0.00"
                  className="w-full pl-7 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 dark:focus:ring-blue-900/50 transition-all placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Assignees
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {assigneeIds.length > 0 &&
                assigneeIds.map((id) => {
                  const member = uniqueMembers.find((m) => m.id === id);
                  if (!member) return null;
                  return (
                    <div
                      key={id}
                      className="flex items-center gap-1.5 pl-1 pr-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-full"
                    >
                      <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-[10px] overflow-hidden">
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          member.name?.[0] || "U"
                        )}
                      </div>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {member.name}
                      </span>
                      <button
                        onClick={() => handleToggleAssignee(id)}
                        className="ml-0.5 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  );
                })}
            </div>

            <div className="relative" ref={assigneeDropdownRef}>
              <button
                type="button"
                onClick={() =>
                  setIsAssigneeDropdownOpen(!isAssigneeDropdownOpen)
                }
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-left text-gray-500 dark:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 dark:focus:ring-blue-900/50 transition-all flex items-center justify-between"
              >
                <span>
                  {assigneeIds.length > 0
                    ? `${assigneeIds.length} assignee${assigneeIds.length > 1 ? "s" : ""} selected`
                    : "Select assignees..."}
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${isAssigneeDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isAssigneeDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-64 overflow-hidden">
                  <div className="p-2 border-b border-gray-100 dark:border-gray-700">
                    <input
                      type="text"
                      value={assigneeSearch}
                      onChange={(e) => setAssigneeSearch(e.target.value)}
                      placeholder="Search members..."
                      className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 placeholder-gray-400 dark:placeholder-gray-500"
                    />
                  </div>
                  <div className="overflow-y-auto max-h-48">
                    {filteredMembers.length > 0 ? (
                      filteredMembers.map((member) => {
                        const isSelected = assigneeIds.includes(member.id);
                        return (
                          <div
                            key={member.id}
                            onClick={() => handleToggleAssignee(member.id)}
                            className={`px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-between transition-colors ${
                              isSelected
                                ? "bg-blue-50/50 dark:bg-blue-900/20"
                                : ""
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs overflow-hidden">
                                {member.avatar ? (
                                  <img
                                    src={member.avatar}
                                    alt={member.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  member.name?.[0] || "U"
                                )}
                              </div>
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                {member.name}
                              </span>
                            </div>
                            {isSelected && (
                              <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                        No members found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Tags
            </label>
            <div className="space-y-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Type and press Enter to add tags..."
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 dark:focus:ring-blue-900/50 transition-all placeholder-gray-400 dark:placeholder-gray-500"
              />
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <Tag
                      key={index}
                      text={tag}
                      onRemove={() => handleRemoveTag(tag)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <Textarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Add detailed description..."
          />

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Attachments
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all group"
            >
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-500 dark:text-blue-400 mb-3 group-hover:scale-110 transition-transform">
                <Upload size={20} />
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Click to upload
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                SVG, PNG, JPG or GIF (max. 800x400px)
              </p>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                onChange={handleFileChange}
              />
            </div>

            {attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                {attachments.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600"
                  >
                    <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded flex items-center justify-center text-blue-500 dark:text-blue-400 border border-gray-200 dark:border-gray-600 shadow-sm">
                      <FileIcon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <button
                      onClick={() => removeAttachment(idx)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 rounded-b-xl flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-white dark:hover:bg-gray-700 border border-transparent hover:border-gray-200 dark:hover:border-gray-600 rounded-lg transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!title.trim() || isLoading}
            className={`px-5 py-2.5 text-sm font-medium text-white rounded-lg shadow-sm transition-all flex items-center gap-2 ${
              !title.trim() || isLoading
                ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 hover:shadow-md"
            } `}
          >
            {isLoading
              ? task
                ? "Updating..."
                : "Creating..."
              : task
                ? "Update Task"
                : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
