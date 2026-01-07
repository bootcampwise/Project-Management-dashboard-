import React, { useState } from "react";
import { format, isSameDay } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Loader2,
  Trash2,
  Pencil,
} from "lucide-react";
import { useCalendarView } from "../../pages/projectboard/hooks/useCalendarView";
import AddEventModal from "./AddEventModal";
import type { CalendarEvent } from "../../store/api/calendarApiSlice";
import type { CalendarViewProps } from "../../types";

const CalendarView: React.FC<CalendarViewProps> = ({ projectId }) => {
  const {
    viewMode,
    setViewMode,
    currentDate,
    setCurrentDate,
    handleNext,
    handlePrev,
    handleTodayClick,
    handleMonthClick,
    calendarDays,
    weekDays,
    getColorClass,
    getEventTypeColor,
    events,
    isLoading,
    deleteEvent,
    refreshEvents,
  } = useCalendarView({ projectId });

  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddEvent = () => {
    setEditingEvent(null);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingEvent(null);
  };

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.start);
      return isSameDay(eventDate, day);
    });
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return format(date, "h:mm a");
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 font-sans text-sm">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
            {viewMode === "month"
              ? format(currentDate, "MMMM yyyy")
              : format(currentDate, "d MMMM yyyy")}
            {viewMode === "month" && (
              <ChevronDown
                size={14}
                className="text-gray-400 dark:text-gray-500"
              />
            )}
          </h2>
          {isLoading && (
            <Loader2 size={16} className="animate-spin text-blue-500" />
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600 p-0.5 shadow-sm">
            <button
              onClick={handleMonthClick}
              className={`px-3 py-1 text-xs font-medium rounded shadow-sm ${viewMode === "month" ? "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border border-transparent"}`}
            >
              Month
            </button>
            <button
              onClick={handleTodayClick}
              className={`px-3 py-1 text-xs font-medium rounded ${viewMode === "day" ? "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-transparent"}`}
            >
              Today
            </button>
          </div>

          <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500">
            <button
              onClick={handlePrev}
              className="p-1 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNext}
              className="p-1 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {viewMode === "month" ? (
        <div className="flex-1 flex flex-col p-8 overflow-y-auto">
          <div className="grid grid-cols-7 mb-4">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-12">
            {calendarDays.map((day) => {
              const dayEvents = getEventsForDay(day);
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={day.toISOString()}
                  onClick={() => {
                    setCurrentDate(day);
                    setViewMode("day");
                  }}
                  className="min-h-[100px] relative px-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-lg"
                >
                  <div
                    className={`text-[11px] text-right mb-2 pr-2 ${isToday ? "" : "text-gray-500 dark:text-gray-400"}`}
                  >
                    {isToday ? (
                      <span className="bg-blue-500 text-white w-5 h-5 flex items-center justify-center rounded-full ml-auto">
                        {format(day, "d")}
                      </span>
                    ) : (
                      format(day, "d")
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className={`text-[10px] px-2 py-1.5 rounded-md truncate font-medium flex items-center ${getColorClass(getEventTypeColor(event.type))} shadow-sm`}
                        title={event.title}
                      >
                        <span className="truncate">{event.title}</span>
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-[10px] text-gray-500 dark:text-gray-400 pl-2">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex-1 p-8 overflow-y-auto bg-white dark:bg-gray-900">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
            Events for {format(currentDate, "MMMM d, yyyy")}
          </h3>

          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 size={24} className="animate-spin text-blue-500" />
            </div>
          ) : getEventsForDay(currentDate).length === 0 ? (
            <div className="text-center py-10 text-gray-400 dark:text-gray-500">
              <p>No events scheduled for this day.</p>
              <button
                onClick={handleAddEvent}
                className="mt-4 text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                Add an event
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 max-w-2xl">
              {getEventsForDay(currentDate).map((event) => (
                <div
                  key={event.id}
                  className={`p-4 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between ${getColorClass(getEventTypeColor(event.type)).replace("border-l-[3px]", "border-l-4")}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-5 h-5 rounded-full border-2 border-current opacity-40"></div>
                    <div>
                      <span className="font-medium text-base text-gray-900 dark:text-white">
                        {event.title}
                      </span>
                      {event.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs opacity-70 font-medium px-2 py-1 bg-white/50 dark:bg-gray-800/50 rounded">
                      {formatTime(event.start)}
                      {event.end && ` - ${formatTime(event.end)}`}
                    </span>
                    <span className="text-xs uppercase opacity-60 font-medium">
                      {event.type}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingEvent(event);
                      }}
                      className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors"
                      title="Edit event"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteEvent(event.id, event.title);
                      }}
                      className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors"
                      title="Delete event"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <AddEventModal
        isOpen={isAddModalOpen || !!editingEvent}
        onClose={handleCloseModal}
        projectId={projectId}
        event={editingEvent}
        onAdd={() => {
          refreshEvents();
          handleCloseModal();
        }}
        onUpdate={() => {
          refreshEvents();
          handleCloseModal();
        }}
      />
    </div>
  );
};

export default CalendarView;
