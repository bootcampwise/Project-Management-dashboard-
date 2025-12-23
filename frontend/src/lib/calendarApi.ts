import { apiClient } from "./apiClient";

// Types matching the backend CalendarEvent model
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
  start: string; // ISO date string
  end?: string; // ISO date string
  description?: string;
  projectId?: string;
  createdAt: string;
}

export interface CreateEventPayload {
  title: string;
  type: EventType;
  start: string; // ISO date string
  end?: string; // ISO date string
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

// Calendar API functions
export const calendarApi = {
  // Create a new event
  createEvent: async (data: CreateEventPayload): Promise<CalendarEventApi> => {
    return apiClient.post<CalendarEventApi>("/calendar", data);
  },

  // Get all events for a project
  getProjectEvents: async (projectId: string): Promise<CalendarEventApi[]> => {
    return apiClient.get<CalendarEventApi[]>(`/calendar/project/${projectId}`);
  },

  // Get events by date range (for calendar month/week view)
  getEventsByDateRange: async (
    projectId: string,
    startDate: string,
    endDate: string
  ): Promise<CalendarEventApi[]> => {
    const params = new URLSearchParams({ startDate, endDate });
    return apiClient.get<CalendarEventApi[]>(
      `/calendar/project/${projectId}/range?${params.toString()}`
    );
  },

  // Get today's events (for timeline view)
  getTodayEvents: async (projectId: string): Promise<CalendarEventApi[]> => {
    return apiClient.get<CalendarEventApi[]>(
      `/calendar/project/${projectId}/today`
    );
  },

  // Get a single event
  getEvent: async (id: string): Promise<CalendarEventApi> => {
    return apiClient.get<CalendarEventApi>(`/calendar/${id}`);
  },

  // Update an event
  updateEvent: async (
    id: string,
    data: UpdateEventPayload
  ): Promise<CalendarEventApi> => {
    return apiClient.patch<CalendarEventApi>(`/calendar/${id}`, data);
  },

  // Delete an event
  deleteEvent: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/calendar/${id}`);
  },
};
