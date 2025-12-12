import { useState } from "react";
import type { CalendarEvent } from "../types";

interface UseAddEventModalProps {
  onClose: () => void;
  onAdd?: (event: CalendarEvent) => void;
}

export const useAddEventModal = ({ onClose, onAdd }: UseAddEventModalProps) => {
  const [eventType, setEventType] = useState("Meeting");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    const newEvent: CalendarEvent = {
      eventType,
      date,
      startTime,
      endTime,
      description,
    };
    console.log("Adding event:", newEvent);
    if (onAdd) onAdd(newEvent);
    onClose();
    // Reset form
    setEventType("Meeting");
    setDate("");
    setStartTime("");
    setEndTime("");
    setDescription("");
  };

  return {
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
    handleSubmit,
  };
};
