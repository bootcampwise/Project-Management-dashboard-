import React from "react";
import { X, Type } from "lucide-react";
import { IconButton, Select, Input, Textarea } from "../ui";
import type { AddEventModalProps } from "../../types";
import { useAddEventModal } from "../../pages/projectboard/hooks/useAddEventModal";

const AddEventModal: React.FC<AddEventModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  onUpdate,
  projectId,
  event,
}) => {
  const {
    title,
    setTitle,
    eventType,
    setEventType,
    date,
    setDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    description,
    setDescription,
    isLoading,
    isEditMode,
    handleSubmit,
  } = useAddEventModal({ onClose, onAdd, onUpdate, projectId, event });

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
            {isEditMode ? "Edit Event" : "Add Event in Calendar"}
          </h2>
          <IconButton
            icon={<X size={20} />}
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            disabled={isLoading}
          />
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          <Input
            type="text"
            label="Title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter event title"
            disabled={isLoading}
          />

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
              <Type size={16} className="text-gray-400 dark:text-gray-500" />
              Event Type
            </label>
            <Select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              disabled={isLoading}
              options={[
                { value: "MEETING", label: "Meeting" },
                { value: "HOLIDAY", label: "Holiday" },
                { value: "EVENT", label: "Event" },
                { value: "DEADLINE", label: "Deadline" },
                { value: "REMINDER", label: "Reminder" },
              ]}
            />
          </div>

          <Input
            type="date"
            label="Date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={isLoading}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="time"
              label="Start Time"
              required={eventType !== "HOLIDAY"}
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              disabled={isLoading}
            />
            <Input
              type="time"
              label="End Time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <Textarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Enter about your event or meeting etc"
            disabled={isLoading}
          />
        </div>

        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 rounded-b-xl flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-white dark:hover:bg-gray-700 border border-transparent hover:border-gray-200 dark:hover:border-gray-600 rounded-lg transition-all"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>{isEditMode ? "Saving..." : "Adding..."}</span>
              </>
            ) : (
              <span>{isEditMode ? "Save Changes" : "Add Event"}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEventModal;
