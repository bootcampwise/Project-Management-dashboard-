import { apiSlice } from "./apiSlice";

// ============================================
// CALENDAR TYPES
// ============================================

// Event types matching the backend
export type EventType =
  | "MEETING"
  | "DEADLINE"
  | "EVENT"
  | "HOLIDAY"
  | "REMINDER";

// Calendar event from API
export interface CalendarEvent {
  id: string;
  title: string;
  type: EventType;
  start: string; // ISO date string
  end?: string; // ISO date string
  description?: string;
  projectId?: string;
  createdAt: string;
}

// Payload for creating an event
export interface CreateEventPayload {
  title: string;
  type: EventType;
  start: string;
  end?: string;
  description?: string;
  projectId?: string;
}

// Payload for updating an event
export interface UpdateEventPayload {
  title?: string;
  type?: EventType;
  start?: string;
  end?: string;
  description?: string;
}

// ============================================
// CALENDAR API ENDPOINTS
// ============================================

export const calendarApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ----------------------------------------
    // GET EVENTS BY PROJECT
    // ----------------------------------------
    getProjectEvents: builder.query<CalendarEvent[], string>({
      query: (projectId) => `/calendar/project/${projectId}`,
      providesTags: (result, _error, projectId) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "CalendarEvent" as const,
                id,
              })),
              { type: "CalendarEvent", id: `PROJECT-${projectId}` },
            ]
          : [{ type: "CalendarEvent", id: `PROJECT-${projectId}` }],
    }),

    // ----------------------------------------
    // GET EVENTS BY DATE RANGE
    // ----------------------------------------
    getEventsByDateRange: builder.query<
      CalendarEvent[],
      { projectId: string; startDate: string; endDate: string }
    >({
      query: ({ projectId, startDate, endDate }) =>
        `/calendar/project/${projectId}/range?startDate=${startDate}&endDate=${endDate}`,
      providesTags: (_result, _error, { projectId }) => [
        { type: "CalendarEvent", id: `PROJECT-${projectId}` },
      ],
    }),

    // ----------------------------------------
    // GET TODAY'S EVENTS (for timeline)
    // ----------------------------------------
    getTodayEvents: builder.query<CalendarEvent[], string>({
      query: (projectId) => `/calendar/project/${projectId}/today`,
      providesTags: (_result, _error, projectId) => [
        { type: "CalendarEvent", id: `PROJECT-${projectId}` },
      ],
    }),

    // ----------------------------------------
    // GET SINGLE EVENT
    // ----------------------------------------
    getEvent: builder.query<CalendarEvent, string>({
      query: (eventId) => `/calendar/${eventId}`,
      providesTags: (_result, _error, eventId) => [
        { type: "CalendarEvent", id: eventId },
      ],
    }),

    // ----------------------------------------
    // CREATE EVENT
    // ----------------------------------------
    createEvent: builder.mutation<CalendarEvent, CreateEventPayload>({
      query: (event) => ({
        url: "/calendar",
        method: "POST",
        body: event,
      }),
      invalidatesTags: (_result, _error, { projectId }) => [
        { type: "CalendarEvent", id: `PROJECT-${projectId}` },
      ],
    }),

    // ----------------------------------------
    // UPDATE EVENT
    // ----------------------------------------
    updateEvent: builder.mutation<
      CalendarEvent,
      { id: string; data: UpdateEventPayload }
    >({
      query: ({ id, data }) => ({
        url: `/calendar/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "CalendarEvent", id },
      ],
    }),

    // ----------------------------------------
    // DELETE EVENT
    // ----------------------------------------
    deleteEvent: builder.mutation<void, string>({
      query: (eventId) => ({
        url: `/calendar/${eventId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CalendarEvent"],
    }),
  }),
});

// ============================================
// EXPORT HOOKS
// ============================================

export const {
  useGetProjectEventsQuery,
  useGetEventsByDateRangeQuery,
  useLazyGetEventsByDateRangeQuery,
  useGetTodayEventsQuery,
  useLazyGetTodayEventsQuery,
  useGetEventQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = calendarApiSlice;
