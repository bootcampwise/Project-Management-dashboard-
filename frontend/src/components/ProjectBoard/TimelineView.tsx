import React, { useState } from "react";
import { format } from "date-fns";
import { Loader2, X, Pencil } from "lucide-react";
import { useTimelineView } from "../../pages/projectboard/hooks/useTimelineView";
import AddEventModal from "./AddEventModal";
import type { CalendarEvent } from "../../store/api/calendarApiSlice";
import type { TimelineViewProps } from "../../types";

const TimelineView: React.FC<TimelineViewProps> = ({
  projectId,
  projectIds,
}) => {
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
  } = useTimelineView({ projectId, projectIds });

  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const groupEventsIntoRows = () => {
    const rows: (typeof events)[] = [];

    events.forEach((event) => {
      const position = getEventGridPosition(event);
      if (!position) return;

      let placed = false;
      for (const row of rows) {
        const overlaps = row.some((rowEvent) => {
          const rowPos = getEventGridPosition(rowEvent);
          if (!rowPos) return false;
          return !(
            position.colStart >= rowPos.colStart + rowPos.colSpan ||
            position.colStart + position.colSpan <= rowPos.colStart
          );
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
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 font-sans text-sm h-full flex flex-col p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
          Timeline
          {isLoading && (
            <Loader2 size={14} className="animate-spin text-blue-500" />
          )}
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {format(currentDate, "MMMM d, yyyy")}
        </span>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="flex bg-gray-50 dark:bg-gray-700/50 rounded-lg py-2 mb-4">
          {dayHours.map((hour) => (
            <div
              key={hour}
              className="flex-1 text-center text-xs font-medium text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-600 last:border-0"
            >
              {hour}
            </div>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={20} className="animate-spin text-blue-500" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-8 text-gray-400 dark:text-gray-500">
            <p className="text-sm">No events scheduled for today.</p>
          </div>
        ) : (
          <div className="space-y-3 overflow-y-auto max-h-[180px]">
            {eventRows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="grid gap-2"
                style={{
                  gridTemplateColumns: `repeat(${dayHours.length}, 1fr)`,
                }}
              >
                {row.map((event) => {
                  const position = getEventGridPosition(event);
                  if (!position) return null;

                  const colorClass = getColorClasses(
                    getEventTypeColor(event.type),
                  );

                  return (
                    <div
                      key={event.id}
                      className={`rounded-md px-2 py-1.5 shadow-sm ${colorClass} relative group cursor-pointer`}
                      style={{
                        gridColumnStart: position.colStart,
                        gridColumnEnd: `span ${position.colSpan}`,
                      }}
                      title={event.description || event.title}
                      onClick={() => setEditingEvent(event)}
                    >
                      <div className="absolute top-1 right-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingEvent(event);
                          }}
                          className="p-0.5 text-gray-500 dark:text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
                          title="Edit event"
                        >
                          <Pencil size={10} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteEvent(event.id, event.title);
                          }}
                          className="p-0.5 text-gray-500 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                          title="Delete event"
                        >
                          <X size={10} />
                        </button>
                      </div>
                      <h4 className="font-medium text-gray-700 dark:text-gray-200 text-[11px] leading-tight truncate pr-6">
                        {event.title}
                      </h4>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400">
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
