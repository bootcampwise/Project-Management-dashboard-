import { useState, useEffect } from "react";
import type { CalendarEvent, UseAddEventModalProps } from "../../../types";
import { calendarApi, type EventType } from "../../../lib/calendarApi";
import toast from "react-hot-toast";
import { format } from "date-fns";

export const useAddEventModal = ({
  onClose,
  onAdd,
  onUpdate,
  projectId,
  event,
}: UseAddEventModalProps) => {
  const [title, setTitle] = useState("");
  const [eventType, setEventType] = useState("MEETING");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isEditMode = !!event;

  // Pre-fill form when editing
  useEffect(() => {
    if (event) {
      setTitle(event.title || "");
      setEventType(event.type || "MEETING");

      // Parse start date and time
      if (event.start) {
        const startDate = new Date(event.start);
        setDate(format(startDate, "yyyy-MM-dd"));
        setStartTime(format(startDate, "HH:mm"));
      }

      // Parse end time
      if (event.end) {
        const endDate = new Date(event.end);
        setEndTime(format(endDate, "HH:mm"));
      } else {
        setEndTime("");
      }

      setDescription(event.description || "");
    }
  }, [event]);

  const resetForm = () => {
    setTitle("");
    setEventType("MEETING");
    setDate("");
    setStartTime("");
    setEndTime("");
    setDescription("");
  };

  const handleSubmit = async () => {
    const isHoliday = eventType === "HOLIDAY";

    if (!title || !date) {
      toast.error("Please fill in required fields: Title and Date");
      return;
    }

    if (!isHoliday && !startTime) {
      toast.error("Please fill in Start Time for this event type");
      return;
    }

    setIsLoading(true);

    try {
      let startDateTime: string;
      let endDateTime: string | undefined;

      if (isHoliday && !startTime) {
        startDateTime = new Date(`${date}T00:00:00`).toISOString();
        endDateTime = new Date(`${date}T23:59:59`).toISOString();
      } else {
        startDateTime = new Date(`${date}T${startTime}:00`).toISOString();
        endDateTime = endTime
          ? new Date(`${date}T${endTime}:00`).toISOString()
          : undefined;
      }

      if (isEditMode && event) {
        // Update existing event
        await calendarApi.updateEvent(event.id, {
          title,
          type: eventType as EventType,
          start: startDateTime,
          end: endDateTime,
          description: description || undefined,
        });

        const updatedEvent: CalendarEvent = {
          id: event.id,
          eventType,
          title,
          date,
          startTime,
          endTime,
          description,
          projectId,
        };

        if (onUpdate) onUpdate(updatedEvent);
        toast.success(`Event "${title}" updated successfully!`);
      } else {
        // Create new event
        const createdEvent = await calendarApi.createEvent({
          title,
          type: eventType as EventType,
          start: startDateTime,
          end: endDateTime,
          description: description || undefined,
          projectId: projectId || undefined,
        });

        const newEvent: CalendarEvent = {
          id: createdEvent.id,
          eventType,
          title,
          date,
          startTime,
          endTime,
          description,
          projectId,
        };

        if (onAdd) onAdd(newEvent);
        toast.success(`Event "${title}" created successfully!`);
      }

      resetForm();
      onClose();
    } catch (error) {
      console.error("Failed to save event:", error);
      toast.error(
        isEditMode ? "Failed to update event." : "Failed to create event."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
  };
};
