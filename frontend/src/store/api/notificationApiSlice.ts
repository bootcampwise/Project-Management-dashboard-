import { apiSlice } from "./apiSlice";
import type { Notification } from "../../types";

export const notificationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<Notification[], void>({
      query: () => "/notifications",
      keepUnusedDataFor: 60,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "Notification" as const,
                id,
              })),
              { type: "Notification", id: "LIST" },
            ]
          : [{ type: "Notification", id: "LIST" }],
    }),

    markAsRead: builder.mutation<Notification, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Notification", id },
        { type: "Notification", id: "LIST" },
      ],
    }),

    markAllAsRead: builder.mutation<void, void>({
      query: () => ({
        url: "/notifications/read-all",
        method: "PATCH",
      }),
      invalidatesTags: [{ type: "Notification", id: "LIST" }],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} = notificationApiSlice;
