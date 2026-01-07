import { useState, useMemo } from "react";
import type { ScheduleCalendarTab } from "../../../types";
import {
  useGetAllEventsQuery,
  useGetProjectEventsQuery,
} from "../../../store/api/calendarApiSlice";

export const useScheduleCalendar = (projectId?: string | "all") => {
  const [activeTab, setActiveTab] = useState<ScheduleCalendarTab>("Meetings");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const currentMonthIndex = currentDate.getMonth();

  const isAllProjects = projectId === "all" || !projectId;

  const { data: allEvents = [] } = useGetAllEventsQuery(undefined, {
    skip: !isAllProjects,
  });

  const { data: projectEvents = [] } = useGetProjectEventsQuery(
    projectId as string,
    {
      skip: isAllProjects,
    },
  );

  const events = isAllProjects ? allEvents : projectEvents;

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

  const dates = useMemo(() => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    const calendarDates = [];

    for (let i = 0; i < 14; i++) {
      const dateClone = new Date(startOfWeek);
      dateClone.setDate(startOfWeek.getDate() + i);

      const iDay = dateClone.getDate();
      const iMonth = dateClone.getMonth();
      const iYear = dateClone.getFullYear();

      const hasEvents = events.some((e) => {
        const eDate = new Date(e.start);
        return (
          eDate.getDate() === iDay &&
          eDate.getMonth() === iMonth &&
          eDate.getFullYear() === iYear
        );
      });

      const isSelected =
        selectedDate.getDate() === iDay &&
        selectedDate.getMonth() === iMonth &&
        selectedDate.getFullYear() === iYear;

      const isToday =
        new Date().getDate() === iDay &&
        new Date().getMonth() === iMonth &&
        new Date().getFullYear() === iYear;

      calendarDates.push({
        day: iDay,
        disabled: false,
        selected: isSelected,
        isToday: isToday,
        hasEvents: hasEvents,
        date: dateClone,
      });
    }

    return calendarDates;
  }, [currentDate, events, selectedDate]);

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
  };

  const currentMonthName = months[currentMonthIndex];

  const filteredEvents = useMemo(() => {
    const tabMapping: Record<ScheduleCalendarTab, string[]> = {
      Meetings: ["MEETING"],
      Events: ["EVENT", "DEADLINE", "REMINDER"],
      Holidays: ["HOLIDAY"],
    };

    const allowedTypes = tabMapping[activeTab];

    return events
      .filter((e) => {
        const eDate = new Date(e.start);
        const isSameDate =
          eDate.getDate() === selectedDate.getDate() &&
          eDate.getMonth() === selectedDate.getMonth() &&
          eDate.getFullYear() === selectedDate.getFullYear();

        const isTypeMatch = allowedTypes.includes(e.type);

        return isSameDate && isTypeMatch;
      })
      .sort(
        (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
      );
  }, [events, selectedDate, activeTab]);

  return {
    activeTab,
    setActiveTab,
    currentMonthIndex,
    currentMonthName,
    currentYear: currentDate.getFullYear(),
    months,
    days,
    dates,
    handlePrevMonth,
    handleNextMonth,
    handleSelectDate,
    selectedDate,
    filteredEvents,
  };
};
