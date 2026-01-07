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
import { useAppSelector } from "../../../store/hooks";

export const useTimelineView = ({
  projectId,
  projectIds,
}: UseTimelineViewProps = {}) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate] = useState(new Date());
  const timeFormat = useAppSelector((state) => state.ui.timeFormat);

  const [fetchTodayEvents, { isLoading }] = useLazyGetTodayEventsQuery();
  const [deleteEventMutation] = useDeleteEventMutation();
  const [updateEventMutation] = useUpdateEventMutation();

  const formatHourLabel = (hour: number): string => {
    if (timeFormat === "24h") {
      return `${hour.toString().padStart(2, "0")}:00`;
    }
    if (hour === 0 || hour === 24) return "12 AM";
    if (hour === 12) return "12 PM";
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  };

  const dayHours = (() => {
    const MAX_HOURS_DISPLAY = 10;

    let minHour = 8;
    let maxHour = 17;

    if (events.length > 0) {
      const eventHours: number[] = [];

      events.forEach((event) => {
        const startHour = new Date(event.start).getHours();
        eventHours.push(startHour);

        if (event.end) {
          const endHour = new Date(event.end).getHours();
          const endMinute = new Date(event.end).getMinutes();
          eventHours.push(endMinute > 0 ? endHour + 1 : endHour);
        }
      });

      const eventMinHour = Math.min(...eventHours);
      const eventMaxHour = Math.max(...eventHours);

      const eventSpan = eventMaxHour - eventMinHour;

      if (eventSpan >= MAX_HOURS_DISPLAY) {
        minHour = Math.max(0, eventMinHour - 1);
        maxHour = Math.min(24, eventMaxHour + 1);
      } else {
        const eventCenter = Math.floor((eventMinHour + eventMaxHour) / 2);
        const halfDisplay = Math.floor(MAX_HOURS_DISPLAY / 2);

        minHour = Math.max(0, eventCenter - halfDisplay);
        maxHour = minHour + MAX_HOURS_DISPLAY - 1;

        if (maxHour > 24) {
          maxHour = 24;
          minHour = maxHour - MAX_HOURS_DISPLAY + 1;
        }
        if (eventMinHour < minHour) {
          minHour = Math.max(0, eventMinHour - 1);
          maxHour = minHour + MAX_HOURS_DISPLAY - 1;
        }
        if (eventMaxHour > maxHour) {
          maxHour = Math.min(24, eventMaxHour + 1);
          minHour = maxHour - MAX_HOURS_DISPLAY + 1;
        }
      }
    }

    const hours: string[] = [];
    for (let h = minHour; h <= maxHour; h++) {
      hours.push(formatHourLabel(h));
    }
    return hours;
  })();

  const startingHour = (() => {
    if (dayHours.length === 0) return 8;
    const firstLabel = dayHours[0];
    if (timeFormat === "24h") {
      return parseInt(firstLabel.split(":")[0], 10);
    } else {
      const match = firstLabel.match(/(\d+)\s*(AM|PM)/i);
      if (!match) return 8;
      let hour = parseInt(match[1], 10);
      const period = match[2].toUpperCase();
      if (period === "PM" && hour !== 12) hour += 12;
      if (period === "AM" && hour === 12) hour = 0;
      return hour;
    }
  })();

  const loadTodayEvents = useCallback(async () => {
    const idsToFetch =
      projectIds && projectIds.length > 0
        ? projectIds
        : projectId
          ? [projectId]
          : [];

    if (idsToFetch.length === 0) return;

    try {
      const promises = idsToFetch.map((id) => fetchTodayEvents(id).unwrap());
      const results = await Promise.all(promises);

      const allEvents = results.flat();
      const uniqueEvents = allEvents.filter(
        (event, index, self) =>
          index === self.findIndex((e) => e.id === event.id),
      );

      uniqueEvents.sort(
        (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
      );

      setEvents(uniqueEvents);
    } catch (error) {
      showToast.error(
        `Failed to fetch today's events. ${getErrorMessage(error)}`,
      );
    }
  }, [projectId, projectIds, fetchTodayEvents]);

  useEffect(() => {
    loadTodayEvents();
  }, [loadTodayEvents]);

  const getEventGridPosition = (event: CalendarEvent) => {
    const startDate = new Date(event.start);
    const startHour = startDate.getHours();
    const colStart = Math.max(1, startHour - startingHour + 1);

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

    const maxCol = dayHours.length;
    if (colStart > maxCol) return null;
    if (colStart < 1) return null;

    if (colStart + colSpan > maxCol + 1) {
      colSpan = maxCol - colStart + 1;
    }

    return { colStart, colSpan };
  };

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

  const formatEventTime = (start: string, end?: string) => {
    const startDate = new Date(start);
    const timeFormatPattern = timeFormat === "24h" ? "HH:mm" : "h:mm";
    const startFormatted = format(startDate, timeFormatPattern);

    if (end) {
      const endDate = new Date(end);
      const endFormatted = format(endDate, timeFormatPattern);
      return `${startFormatted}-${endFormatted}`;
    }

    return startFormatted;
  };

  const refreshEvents = () => {
    loadTodayEvents();
  };
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
      },
    );
  };

  const updateEvent = async (eventId: string, data: UpdateEventPayload) => {
    try {
      const updatedEvent = await updateEventMutation({
        id: eventId,
        data,
      }).unwrap();

      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? { ...e, ...updatedEvent } : e)),
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
