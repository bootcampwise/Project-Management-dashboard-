import { apiSlice } from "./apiSlice";
import type {
  EventType,
  CalendarEventApi,
  CreateEventPayload,
  UpdateEventPayload,
} from "../../types";

export type { EventType, CreateEventPayload, UpdateEventPayload };

export type CalendarEvent = CalendarEventApi;

export const calendarApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllEvents: builder.query<CalendarEvent[], void>({
      query: () => `/calendar`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "CalendarEvent" as const,
                id,
              })),
              { type: "CalendarEvent", id: "LIST" },
            ]
          : [{ type: "CalendarEvent", id: "LIST" }],
    }),

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

    getTodayEvents: builder.query<CalendarEvent[], string>({
      query: (projectId) => `/calendar/project/${projectId}/today`,
      providesTags: (_result, _error, projectId) => [
        { type: "CalendarEvent", id: `PROJECT-${projectId}` },
      ],
    }),

    getEvent: builder.query<CalendarEvent, string>({
      query: (eventId) => `/calendar/${eventId}`,
      providesTags: (_result, _error, eventId) => [
        { type: "CalendarEvent", id: eventId },
      ],
    }),

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

    deleteEvent: builder.mutation<void, string>({
      query: (eventId) => ({
        url: `/calendar/${eventId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CalendarEvent"],
    }),
  }),
});

export const {
  useGetAllEventsQuery,
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
