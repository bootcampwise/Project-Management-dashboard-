import { useState } from "react";
import type { ScheduleCalendarTab } from "../../../types";

export const useScheduleCalendar = () => {
  const [activeTab, setActiveTab] = useState<ScheduleCalendarTab>("Meetings");
  const [currentMonthIndex, setCurrentMonthIndex] = useState(7); // 7 = August (0-indexed)

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Mock dates - static for now
  const dates = [
    { day: 4, disabled: true },
    { day: 5, disabled: true },
    { day: 6, disabled: true },
    { day: 7, disabled: true },
    { day: 8, disabled: false },
    { day: 9, disabled: false },
    { day: 10, disabled: false, selected: true },
  ];

  const handlePrevMonth = () => {
    setCurrentMonthIndex((prev) => (prev - 1 + 12) % 12);
  };

  const handleNextMonth = () => {
    setCurrentMonthIndex((prev) => (prev + 1) % 12);
  };

  const currentMonthName = months[currentMonthIndex];

  return {
    activeTab,
    setActiveTab,
    currentMonthIndex,
    currentMonthName,
    months,
    days,
    dates,
    handlePrevMonth,
    handleNextMonth,
  };
};
