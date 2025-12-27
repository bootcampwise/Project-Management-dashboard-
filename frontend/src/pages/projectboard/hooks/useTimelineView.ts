import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import {
  useLazyGetTodayEventsQuery,
  useDeleteEventMutation,
  useUpdateEventMutation,
  type CalendarEvent,
  type UpdateEventPayload,
} from "../../../store/api/calendarApiSlice";
import { showToast, getErrorMessage } from "../../../components/ui";
import type { UseTimelineViewProps } from "../../../types";

export const useTimelineView = ({ projectId }: UseTimelineViewProps = {}) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate] = useState(new Date());

  // RTK Query hooks
  const [fetchTodayEvents, { isLoading }] = useLazyGetTodayEventsQuery();
  const [deleteEventMutation] = useDeleteEventMutation();
  const [updateEventMutation] = useUpdateEventMutation();

  // Day hours for the timeline (8:00 AM - 5:00 PM in 12-hour format)
  const dayHours = [
    "8 AM",
    "9 AM",
    "10 AM",
    "11 AM",
    "12 PM",
    "1 PM",
    "2 PM",
    "3 PM",
    "4 PM",
    "5 PM",
  ];

  // Fetch today's events
  const loadTodayEvents = useCallback(async () => {
    if (!projectId) return;

    try {
      const result = await fetchTodayEvents(projectId).unwrap();
      setEvents(result);
    } catch (error) {
      showToast.error(
        `Failed to fetch today's events. ${getErrorMessage(error)}`
      );
    }
  }, [projectId, fetchTodayEvents]);

  // Fetch events on mount and when projectId changes
  useEffect(() => {
    loadTodayEvents();
  }, [loadTodayEvents]);

  // Calculate the grid column position based on event start/end time
  const getEventGridPosition = (event: CalendarEvent) => {
    const startDate = new Date(event.start);
    const startHour = startDate.getHours();

    // Timeline starts at 8:00 (column 1)
    const colStart = Math.max(1, startHour - 7);

    // Calculate column span based on end time
    let colSpan = 1;
    if (event.end) {
      const endDate = new Date(event.end);
      const endHour = endDate.getHours();
      const endMinute = endDate.getMinutes();

      colSpan = endHour - startHour;
      if (endMinute > 0) {
        colSpan += 1;
      }
      colSpan = Math.max(1, colSpan);
    }

    const maxCol = 10;
    if (colStart > maxCol) return null;
    if (colStart < 1) return null;

    if (colStart + colSpan > maxCol + 1) {
      colSpan = maxCol - colStart + 1;
    }

    return { colStart, colSpan };
  };

  // Map event type to color
  const getEventTypeColor = (type: string): string => {
    switch (type) {
      case "MEETING":
        return "blue";
      case "HOLIDAY":
        return "green";
      case "EVENT":
        return "pink";
      case "DEADLINE":
        return "orange";
      case "REMINDER":
        return "cyan";
      default:
        return "gray";
    }
  };

  // Get Tailwind classes for event colors
  const getColorClasses = (color: string) => {
    switch (color) {
      case "orange":
        return "bg-orange-50 border-l-[3px] border-orange-400";
      case "green":
      case "emerald":
        return "bg-emerald-50 border-l-[3px] border-emerald-400";
      case "cyan":
        return "bg-cyan-50 border-l-[3px] border-cyan-400";
      case "rose":
      case "pink":
        return "bg-rose-50 border-l-[3px] border-rose-300";
      case "blue":
        return "bg-blue-50 border-l-[3px] border-blue-400";
      case "gray":
      default:
        return "bg-gray-100 border-l-[3px] border-gray-400";
    }
  };

  // Format time from ISO string
  const formatEventTime = (start: string, end?: string) => {
    const startDate = new Date(start);
    const startFormatted = format(startDate, "h:mm");

    if (end) {
      const endDate = new Date(end);
      const endFormatted = format(endDate, "h:mm");
      return `${startFormatted}-${endFormatted}`;
    }

    return startFormatted;
  };

  // Refresh events
  const refreshEvents = () => {
    loadTodayEvents();
  };

  // Delete an event with toast notification
  const deleteEvent = async (eventId: string, eventTitle: string) => {
    showToast.promise(
      deleteEventMutation(eventId)
        .unwrap()
        .then(() => {
          setEvents((prev) => prev.filter((e) => e.id !== eventId));
        }),
      {
        loading: `Deleting "${eventTitle}"...`,
        success: `Event "${eventTitle}" deleted!`,
        error: "Failed to delete event.",
      }
    );
  };

  // Update an event
  const updateEvent = async (eventId: string, data: UpdateEventPayload) => {
    try {
      const updatedEvent = await updateEventMutation({
        id: eventId,
        data,
      }).unwrap();

      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? { ...e, ...updatedEvent } : e))
      );
      showToast.success("Event updated successfully!");
      return updatedEvent;
    } catch (error) {
      showToast.error(`Failed to update event. ${getErrorMessage(error)}`);
      throw error;
    }
  };

  return {
    events,
    isLoading,
    currentDate,
    dayHours,
    getEventGridPosition,
    getEventTypeColor,
    getColorClasses,
    formatEventTime,
    refreshEvents,
    deleteEvent,
    updateEvent,
  };
};
