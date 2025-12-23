import React, { useState } from 'react';
import { format, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, ChevronDown, Loader2, Trash2, Pencil } from 'lucide-react';
import { useCalendarView } from '../../hooks/useCalendarView';
import AddEventModal from './AddEventModal';
import type { CalendarEventApi } from '../../lib/calendarApi';

interface CalendarViewProps {
  projectId?: string;
}

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

  // State for editing
  const [editingEvent, setEditingEvent] = useState<CalendarEventApi | null>(null);

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return isSameDay(eventDate, day);
    });
  };

  // Format time from ISO string
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return format(date, 'h:mm a');
  };

  return (
    <div className="flex flex-col h-full bg-white font-sans text-sm">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-gray-700 flex items-center gap-2">
            {viewMode === 'month' ? format(currentDate, 'MMMM yyyy') : format(currentDate, 'd MMMM yyyy')}
            {viewMode === 'month' && <ChevronDown size={14} className="text-gray-400" />}
          </h2>
          {isLoading && <Loader2 size={16} className="animate-spin text-blue-500" />}
        </div>

        <div className="flex items-center gap-4">
          {/* View Toggle (Always Visible) */}
          <div className="flex items-center bg-white rounded border border-gray-200 p-0.5 shadow-sm">
            <button
              onClick={handleMonthClick}
              className={`px-3 py-1 text-xs font-medium rounded shadow-sm ${viewMode === 'month' ? 'bg-gray-50 text-gray-600 border border-gray-200' : 'text-gray-500 hover:text-gray-700 border border-transparent'}`}
            >
              Month
            </button>
            <button
              onClick={handleTodayClick}
              className={`px-3 py-1 text-xs font-medium rounded ${viewMode === 'day' ? 'bg-gray-50 text-gray-600 border border-gray-200 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 border border-transparent'}`}
            >
              Today
            </button>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-1 text-gray-400">
            <button onClick={handlePrev} className="p-1 hover:text-gray-600 hover:bg-gray-100 rounded">
              <ChevronLeft size={16} />
            </button>
            <button onClick={handleNext} className="p-1 hover:text-gray-600 hover:bg-gray-100 rounded">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Content Switcher */}
      {viewMode === 'month' ? (
        // Month Grid
        <div className="flex-1 flex flex-col p-8 overflow-y-auto">
          {/* Days Header */}
          <div className="grid grid-cols-7 mb-4">
            {weekDays.map(day => (
              <div key={day} className="text-center text-xs font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Days Cells */}
          <div className="grid grid-cols-7 gap-y-12">
            {calendarDays.map((day) => {
              const dayEvents = getEventsForDay(day);
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={day.toISOString()}
                  onClick={() => { setCurrentDate(day); setViewMode('day'); }}
                  className="min-h-[100px] relative px-1 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg"
                >
                  {/* Date Number */}
                  <div className={`text-[11px] text-right mb-2 pr-2 ${isToday ? '' : 'text-gray-500'}`}>
                    {isToday ? (
                      <span className="bg-blue-500 text-white w-5 h-5 flex items-center justify-center rounded-full ml-auto">
                        {format(day, 'd')}
                      </span>
                    ) : (
                      format(day, 'd')
                    )}
                  </div>

                  {/* Events */}
                  <div className="flex flex-col gap-1">
                    {dayEvents.slice(0, 3).map(event => (
                      <div
                        key={event.id}
                        className={`text-[10px] px-2 py-1.5 rounded-md truncate font-medium flex items-center ${getColorClass(getEventTypeColor(event.type))} shadow-sm`}
                        title={event.title}
                      >
                        <span className="truncate">{event.title}</span>
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-[10px] text-gray-500 pl-2">
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
        // Day View (Simple List)
        <div className="flex-1 p-8 overflow-y-auto bg-white">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
            Events for {format(currentDate, 'MMMM d, yyyy')}
          </h3>

          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 size={24} className="animate-spin text-blue-500" />
            </div>
          ) : getEventsForDay(currentDate).length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p>No events scheduled for this day.</p>
              <button className="mt-4 text-blue-600 hover:underline text-sm">Add an event</button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 max-w-2xl">
              {getEventsForDay(currentDate).map(event => (
                <div
                  key={event.id}
                  className={`p-4 rounded-lg border border-gray-100 shadow-sm flex items-center justify-between ${getColorClass(getEventTypeColor(event.type)).replace('border-l-[3px]', 'border-l-4')}`}
                >
                  <div className="flex items-center gap-4">
                    {/* Event type indicator */}
                    <div className="w-5 h-5 rounded-full border-2 border-current opacity-40"></div>
                    <div>
                      <span className="font-medium text-base">{event.title}</span>
                      {event.description && (
                        <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs opacity-70 font-medium px-2 py-1 bg-white/50 rounded">
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
                      className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                      title="Edit event"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteEvent(event.id, event.title);
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
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

      {/* Edit Event Modal */}
      <AddEventModal
        isOpen={!!editingEvent}
        onClose={() => setEditingEvent(null)}
        projectId={projectId}
        event={editingEvent}
        onUpdate={() => {
          refreshEvents();
          setEditingEvent(null);
        }}
      />
    </div>
  );
};

export default CalendarView;

