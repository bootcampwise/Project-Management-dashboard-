import { useState } from "react";
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

export const useCalendarView = () => {
  const [viewMode, setViewMode] = useState<"month" | "day">("month");
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2024, 9, 1)); // Oct 2024

  // Navigation Handlers
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
    setViewMode("day");
  };

  const handleMonthClick = () => {
    setViewMode("month");
  };

  const handleDayClick = (day: Date) => {
    setCurrentDate(day);
    setViewMode("day");
  };

  // Calendar calculations
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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
  };
};
