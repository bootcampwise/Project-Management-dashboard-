import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ScheduleCalendarTab, ScheduleCalendarProps } from "../../types";
import { useScheduleCalendar } from "../../pages/dashboard/hooks/useScheduleCalendar";

const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({ projectId }) => {
  const {
    activeTab,
    setActiveTab,
    currentMonthName,
    currentYear,
    days,
    dates,
    handlePrevMonth,
    handleNextMonth,
    handleSelectDate,
    filteredEvents,
  } = useScheduleCalendar(projectId);

  const formatTimeRange = (start: string, end?: string) => {
    const startTime = new Date(start).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
    const endTime = end
      ? new Date(end).toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        })
      : "";
    return endTime ? `${startTime} - ${endTime}` : startTime;
  };

  const getEventStyles = (type: string) => {
    switch (type) {
      case "MEETING":
        return {
          bg: "bg-purple-50 dark:bg-purple-900/20",
          text: "text-purple-600 dark:text-purple-300",
          time: "text-purple-400 dark:text-purple-400",
        };
      case "HOLIDAY":
        return {
          bg: "bg-amber-50 dark:bg-amber-900/20",
          text: "text-amber-600 dark:text-amber-300",
          time: "text-amber-400 dark:text-amber-400",
        };
      default:
        return {
          bg: "bg-blue-50 dark:bg-blue-900/20",
          text: "text-blue-600 dark:text-blue-300",
          time: "text-blue-400 dark:text-blue-400",
        };
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100/60 dark:border-gray-700/60 p-4 flex flex-col overflow-hidden w-full lg:w-[304px] h-[338px]">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Schedule
        </h3>
      </div>

      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-500 dark:text-gray-400 font-medium text-sm">
          {currentMonthName} {currentYear}
        </span>
        <div className="flex gap-1">
          <button
            onClick={handlePrevMonth}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="grid grid-cols-7 text-center mb-1">
          {days.map((day) => (
            <div
              key={day}
              className="text-[10px] text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 text-center gap-y-1">
          {dates.map((dateObj, index) => (
            <div
              key={index}
              className="flex items-center justify-center p-0.5 relative"
            >
              {dateObj.day > 0 ? (
                <>
                  <button
                    onClick={() =>
                      dateObj.date && handleSelectDate(dateObj.date)
                    }
                    className={`
                        w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium cursor-pointer transition-colors relative
                        ${
                          dateObj.selected
                            ? "bg-blue-600 text-white shadow-sm"
                            : dateObj.isToday
                              ? "bg-blue-50 text-blue-600 font-bold border border-blue-200"
                              : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }
                    `}
                  >
                    {dateObj.day}
                  </button>
                  {!dateObj.selected && dateObj.hasEvents && (
                    <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-blue-500"></span>
                  )}
                </>
              ) : (
                <span className="w-6 h-6"></span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700 p-1 rounded-lg flex mb-3 shrink-0">
        {(["Events", "Meetings", "Holidays"] as ScheduleCalendarTab[]).map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                flex-1 py-1 text-xs font-medium rounded-md transition-all duration-200
                ${
                  activeTab === tab
                    ? "text-blue-900 dark:text-blue-400 bg-white dark:bg-gray-800 shadow-sm"
                    : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                }
            `}
            >
              {tab}
            </button>
          ),
        )}
      </div>

      <div className="flex flex-col gap-2 min-h-0 overflow-y-auto pr-1">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => {
            const styles = getEventStyles(event.type);
            return (
              <div
                key={event.id}
                className={`p-2.5 rounded-lg flex items-center justify-between ${styles.bg}`}
              >
                <span
                  className={`font-semibold text-xs truncate max-w-[140px] ${styles.text}`}
                >
                  {event.title}
                </span>
                <span
                  className={`${styles.time} text-[10px] font-medium shrink-0`}
                >
                  {formatTimeRange(event.start, event.end)}
                </span>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500 text-xs py-4">
            <span>No {activeTab.toLowerCase()} scheduled</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleCalendar;
