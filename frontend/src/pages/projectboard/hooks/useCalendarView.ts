import { useState, useEffect, useCallback } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  addDays,
  subDays,
} from "date-fns";
import {
  useLazyGetEventsByDateRangeQuery,
  useDeleteEventMutation,
  useUpdateEventMutation,
  type CalendarEvent,
  type UpdateEventPayload,
} from "../../../store/api/calendarApiSlice";
import { showToast, getErrorMessage } from "../../../components/ui";
import type { UseCalendarViewProps } from "../../../types";

export const useCalendarView = ({ projectId }: UseCalendarViewProps = {}) => {
  const [viewMode, setViewMode] = useState<"month" | "day">("month");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [fetchEvents, { isLoading }] = useLazyGetEventsByDateRangeQuery();
  const [deleteEventMutation] = useDeleteEventMutation();
  const [updateEventMutation] = useUpdateEventMutation();
  const loadEvents = useCallback(async () => {
    if (!projectId) return;

    try {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);

      const result = await fetchEvents({
        projectId,
        startDate: monthStart.toISOString(),
        endDate: monthEnd.toISOString(),
      }).unwrap();

      setEvents(result);
    } catch (error) {
      showToast.error(
        `Failed to fetch calendar events. ${getErrorMessage(error)}`,
      );
    }
  }, [projectId, currentDate, fetchEvents]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);
  const handleNext = () => {
    if (viewMode === "day") {
      setCurrentDate((d) => addDays(d, 1));
    } else {
      setCurrentDate((d) => addMonths(d, 1));
    }
  };

  const handlePrev = () => {
    if (viewMode === "day") {
      setCurrentDate((d) => subDays(d, 1));
    } else {
      setCurrentDate((d) => subMonths(d, 1));
    }
  };

  const handleTodayClick = () => {
    setCurrentDate(new Date());
    setViewMode("day");
  };

  const handleMonthClick = () => {
    setViewMode("month");
  };

  const handleDayClick = (day: Date) => {
    setCurrentDate(day);
    setViewMode("day");
  };

  const refreshEvents = () => {
    loadEvents();
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

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const getEventTypeColor = (type: string): string => {
    switch (type) {
      case "MEETING":
        return "blue";
      case "HOLIDAY":
        return "green";
      case "EVENT":
        return "pink";
      case "DEADLINE":
        return "yellow";
      case "REMINDER":
        return "teal";
      default:
        return "gray";
    }
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case "yellow":
        return "bg-orange-50 text-orange-700 border-l-[3px] border-orange-300";
      case "pink":
        return "bg-rose-50 text-rose-700 border-l-[3px] border-rose-300";
      case "blue":
        return "bg-blue-50 text-blue-700 border-l-[3px] border-blue-300";
      case "green":
        return "bg-emerald-50 text-emerald-700 border-l-[3px] border-emerald-300";
      case "teal":
        return "bg-teal-50 text-teal-700 border-l-[3px] border-teal-300";
      case "gray":
        return "bg-gray-100 text-gray-700 border-l-[3px] border-gray-400";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return {
    viewMode,
    setViewMode,
    currentDate,
    setCurrentDate,
    handleNext,
    handlePrev,
    handleTodayClick,
    handleMonthClick,
    handleDayClick,
    calendarDays,
    weekDays,
    getColorClass,
    getEventTypeColor,
    events,
    isLoading,
    refreshEvents,
    deleteEvent,
    updateEvent,
  };
};
