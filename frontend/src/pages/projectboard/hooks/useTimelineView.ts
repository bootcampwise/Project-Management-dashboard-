import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { calendarApi, type CalendarEventApi } from "../../../lib/calendarApi";

interface UseTimelineViewProps {
  projectId?: string;
}

export const useTimelineView = ({ projectId }: UseTimelineViewProps = {}) => {
  const [events, setEvents] = useState<CalendarEventApi[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentDate] = useState(new Date());

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
  const fetchTodayEvents = useCallback(async () => {
    if (!projectId) return;

    setIsLoading(true);
    try {
      const fetchedEvents = await calendarApi.getTodayEvents(projectId);
      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Failed to fetch today's events:", error);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  // Fetch events on mount and when projectId changes
  useEffect(() => {
    fetchTodayEvents();
  }, [fetchTodayEvents]);

  // Calculate the grid column position based on event start/end time
  const getEventGridPosition = (event: CalendarEventApi) => {
    const startDate = new Date(event.start);
    const startHour = startDate.getHours();

    // Timeline starts at 8:00 (column 1)
    // Column mapping: 8:00=1, 9:00=2, 10:00=3, 11:00=4, 12:00=5, 13:00=6, 14:00=7, 15:00=8, 16:00=9, 17:00=10
    const colStart = Math.max(1, startHour - 7);

    // Calculate column span based on end time
    let colSpan = 1; // Default 1 hour
    if (event.end) {
      const endDate = new Date(event.end);
      const endHour = endDate.getHours();
      const endMinute = endDate.getMinutes();

      // Calculate how many columns the event spans
      // If event ends at 5:45, it should extend into the 5pm column
      // colSpan = endHour - startHour, but at least 1
      // Add 1 if there are minutes past the hour (e.g., 5:45 means it extends through 5pm column)
      colSpan = endHour - startHour;
      if (endMinute > 0) {
        colSpan += 1; // Event extends into the next hour
      }
      colSpan = Math.max(1, colSpan);
    }

    // Ensure we don't exceed the grid (10 columns for 8am-5pm)
    const maxCol = 10;
    if (colStart > maxCol) return null; // Event is after our timeline
    if (colStart < 1) return null; // Event is before our timeline

    // Limit colSpan so it doesn't go beyond the grid
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
    fetchTodayEvents();
  };

  // Delete an event with toast notification
  const deleteEvent = async (eventId: string, eventTitle: string) => {
    const toast = (await import("react-hot-toast")).default;

    toast.promise(
      calendarApi.deleteEvent(eventId).then(() => {
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
  const updateEvent = async (
    eventId: string,
    data: {
      title?: string;
      type?: string;
      start?: string;
      end?: string;
      description?: string;
    }
  ) => {
    const toast = (await import("react-hot-toast")).default;

    try {
      const updatedEvent = await calendarApi.updateEvent(
        eventId,
        data as Parameters<typeof calendarApi.updateEvent>[1]
      );
      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? { ...e, ...updatedEvent } : e))
      );
      toast.success("Event updated successfully!");
      return updatedEvent;
    } catch (error) {
      console.error("Failed to update event:", error);
      toast.error("Failed to update event.");
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
