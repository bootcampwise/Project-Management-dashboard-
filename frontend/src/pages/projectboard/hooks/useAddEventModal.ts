import { useState, useEffect } from "react";
import type { CalendarEvent, UseAddEventModalProps } from "../../../types";
import {
  useCreateEventMutation,
  useUpdateEventMutation,
  type EventType,
} from "../../../store/api/calendarApiSlice";
import { showToast, getErrorMessage } from "../../../components/ui";
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

  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();
  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();

  const isLoading = isCreating || isUpdating;
  const isEditMode = !!event;

  useEffect(() => {
    if (event) {
      setTitle(event.title || "");
      setEventType(event.type || "MEETING");
      if (event.start) {
        const startDate = new Date(event.start);
        setDate(format(startDate, "yyyy-MM-dd"));
        setStartTime(format(startDate, "HH:mm"));
      }

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
      showToast.error("Please fill in required fields: Title and Date");
      return;
    }

    if (!isHoliday && !startTime) {
      showToast.error("Please fill in Start Time for this event type");
      return;
    }

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
        await updateEvent({
          id: event.id,
          data: {
            title,
            type: eventType as EventType,
            start: startDateTime,
            end: endDateTime,
            description: description || undefined,
          },
        }).unwrap();

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
        showToast.success(`Event "${title}" updated successfully!`);
      } else {
        const createdEvent = await createEvent({
          title,
          type: eventType as EventType,
          start: startDateTime,
          end: endDateTime,
          description: description || undefined,
          projectId: projectId || undefined,
        }).unwrap();

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
        showToast.success(`Event "${title}" created successfully!`);
      }

      resetForm();
      onClose();
    } catch (error) {
      showToast.error(`Failed to save event. ${getErrorMessage(error)}`);
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
