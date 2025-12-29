import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ScheduleCalendarTab } from '../../types';
import { useScheduleCalendar } from '../../pages/dashboard/hooks/useScheduleCalendar';

const ScheduleCalendar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentMonthName,
    days,
    dates,
    handlePrevMonth,
    handleNextMonth,
  } = useScheduleCalendar();

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100/60 dark:border-gray-700/60 p-4 flex flex-col overflow-hidden w-full lg:w-[304px] h-[338px]"
    >
      {/* Title */}
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Schedule</h3>
      </div>

      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-500 dark:text-gray-400 font-medium text-sm">{currentMonthName} 2025</span>
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

      {/* Calendar Grid */}
      <div className="mb-4">
        <div className="grid grid-cols-7 text-center mb-1">
          {days.map((day) => (
            <div key={day} className="text-[10px] text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 text-center">
          {dates.map((dateObj, index) => (
            <div key={index} className="flex items-center justify-center p-0.5">
              <span
                className={`
                                    w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium cursor-pointer transition-colors
                                    ${dateObj.selected ? 'bg-[#004e76] text-white shadow-sm' : ''}
                                    ${dateObj.disabled ? 'text-gray-300 dark:text-gray-600' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}
                                `}
              >
                {dateObj.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-50 dark:bg-gray-700 p-1 rounded-lg flex mb-3 shrink-0">
        {(['Events', 'Meetings', 'Holidays'] as ScheduleCalendarTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
                            flex-1 py-1 text-xs font-medium rounded-md transition-all duration-200
                            ${activeTab === tab
                ? 'text-[#004e76] dark:text-blue-400 bg-white dark:bg-gray-800 shadow-sm'
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              }
                        `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Schedule List */}
      <div className="flex flex-col gap-2 min-h-0">
        {activeTab === 'Meetings' ? (
          <>
            <div
              className="p-2.5 rounded-lg flex items-center justify-between"
              style={{ backgroundColor: '#F4E9FE' }}
            >
              <span className="font-semibold text-[#8B5CF6] text-xs">Daily Standup</span>
              <span className="text-[#A78BFA] text-[10px] font-medium">9:30-10:00AM</span>
            </div>

            <div
              className="p-2.5 rounded-lg flex items-center justify-between"
              style={{ backgroundColor: '#F1F7FE' }}
            >
              <span className="font-semibold text-[#3B82F6] text-xs">Sync with Marketing</span>
              <span className="text-[#93C5FD] text-[10px] font-medium">10:30-11:00AM</span>
            </div>

            <div
              className="p-2.5 rounded-lg flex items-center justify-between"
              style={{ backgroundColor: '#FEF5E8' }}
            >
              <span className="font-semibold text-[#D97706] text-xs">Internal Review</span>
              <span className="text-[#FCD34D] text-[10px] font-medium">11:00-11:15AM</span>
            </div>
          </>
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
