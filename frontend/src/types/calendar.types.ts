export interface CalendarTask {
  id: number | string;
  title: string;
  time?: string;
  color: string;
  category?: string;
  date?: Date;
}

export interface CalendarEvent {
  id?: string;
  eventType: string;
  title?: string;
  date: string;
  startTime: string;
  endTime: string;
  description?: string;
  projectId?: string;
}

export type ScheduleCalendarTab = "Events" | "Meetings" | "Holidays";

export type EventType =
  | "MEETING"
  | "DEADLINE"
  | "EVENT"
  | "HOLIDAY"
  | "REMINDER";

export interface CalendarEventApi {
  id: string;
  title: string;
  type: EventType;
  start: string;
  end?: string;
  description?: string;
  projectId?: string;
  createdAt: string;
}

export interface CreateEventPayload {
  title: string;
  type: EventType;
  start: string;
  end?: string;
  description?: string;
  projectId?: string;
}

export interface UpdateEventPayload {
  title?: string;
  type?: EventType;
  start?: string;
  end?: string;
  description?: string;
}

export interface CalendarViewProps {
  projectId?: string;
}

export interface TimelineViewProps {
  projectId?: string;
  projectIds?: string[];
}

export interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (event: CalendarEvent) => void;
  onUpdate?: (event: CalendarEvent) => void;
  projectId?: string;
  event?: {
    id: string;
    title: string;
    type: string;
    start: string;
    end?: string;
    description?: string;
  } | null;
}

export interface UseAddEventModalProps {
  onClose: () => void;
  onAdd?: (event: CalendarEvent) => void;
  onUpdate?: (event: CalendarEvent) => void;
  projectId?: string;
  event?: {
    id: string;
    title: string;
    type: string;
    start: string;
    end?: string;
    description?: string;
  } | null;
}

export interface UseTimelineViewProps {
  projectId?: string;
  projectIds?: string[];
}

export interface UseCalendarViewProps {
  projectId?: string;
}
