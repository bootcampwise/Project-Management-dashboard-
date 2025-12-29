import React, { useState } from 'react';
import { format } from 'date-fns';
import { Loader2, X, Pencil } from 'lucide-react';
import { useTimelineView } from "../../pages/projectboard/hooks/useTimelineView";
import AddEventModal from './AddEventModal';
import type { CalendarEvent } from '../../store/api/calendarApiSlice';
import type { TimelineViewProps } from '../../types';

const TimelineView: React.FC<TimelineViewProps> = ({ projectId }) => {
  const {
    events,
    isLoading,
    currentDate,
    dayHours,
    getEventGridPosition,
    getEventTypeColor,
    getColorClasses,
    formatEventTime,
    deleteEvent,
    refreshEvents,
  } = useTimelineView({ projectId });

  // State for editing
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  // Group events into rows to handle overlapping
  const groupEventsIntoRows = () => {
    const rows: typeof events[] = [];

    events.forEach(event => {
      const position = getEventGridPosition(event);
      if (!position) return;

      // Try to find a row where this event doesn't overlap
      let placed = false;
      for (const row of rows) {
        const overlaps = row.some(rowEvent => {
          const rowPos = getEventGridPosition(rowEvent);
          if (!rowPos) return false;
          // Check for overlap
          return !(position.colStart >= rowPos.colStart + rowPos.colSpan ||
            position.colStart + position.colSpan <= rowPos.colStart);
        });

        if (!overlaps) {
          row.push(event);
          placed = true;
          break;
        }
      }

      if (!placed) {
        rows.push([event]);
      }
    });

    return rows;
  };

  const eventRows = groupEventsIntoRows();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 font-sans text-sm h-full flex flex-col p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
          Timeline
          {isLoading && <Loader2 size={16} className="animate-spin text-blue-500" />}
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">{format(currentDate, 'MMMM d, yyyy')}</span>
      </div>

      {/* Timeline Content */}
      <div className="flex-1">
        {/* Time Header */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg py-2 mb-6">
          {dayHours.map(hour => (
            <div key={hour} className="flex-1 text-center text-xs font-medium text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700 last:border-0">
              {hour}
            </div>
          ))}
        </div>

        {/* Timeline Rows */}
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 size={24} className="animate-spin text-blue-500" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-10 text-gray-400 dark:text-gray-500">
            <p>No events scheduled for today.</p>
            <p className="text-sm mt-1">Click "Add" to create an event</p>
          </div>
        ) : (
          <div className="space-y-4">
            {eventRows.map((row, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-10 gap-3">
                {row.map(event => {
                  const position = getEventGridPosition(event);
                  if (!position) return null;

                  const colorClass = getColorClasses(getEventTypeColor(event.type));

                  return (
                    <div
                      key={event.id}
                      className={`rounded-md p-2 shadow-sm ${colorClass} relative group cursor-pointer`}
                      style={{
                        gridColumnStart: position.colStart,
                        gridColumnEnd: `span ${position.colSpan} `,
                      }}
                      title={event.description || event.title}
                      onClick={() => setEditingEvent(event)}
                    >
                      {/* Action buttons - appear on hover */}
                      <div className="absolute top-1 right-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingEvent(event);
                          }}
                          className="p-0.5 text-gray-400 dark:text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
                          title="Edit event"
                        >
                          <Pencil size={10} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteEvent(event.id, event.title);
                          }}
                          className="p-0.5 text-gray-400 dark:text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                          title="Delete event"
                        >
                          <X size={10} />
                        </button>
                      </div>
                      <h4 className="font-medium text-gray-700 dark:text-gray-200 text-[11px] leading-tight mb-0.5 truncate pr-6">
                        {event.title}
                      </h4>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500">
                        {formatEventTime(event.start, event.end)}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

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

export default TimelineView;

