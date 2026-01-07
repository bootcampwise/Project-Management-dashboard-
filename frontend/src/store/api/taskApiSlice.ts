import { apiSlice } from "./apiSlice";
import type { Task, CreateTaskPayload, SubTask } from "../../types";

export const taskApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], void>({
      query: () => "/tasks",
      keepUnusedDataFor: 60,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Task" as const, id })),
              { type: "Task", id: "LIST" },
            ]
          : [{ type: "Task", id: "LIST" }],
    }),

    getTask: builder.query<Task, string>({
      query: (taskId) => `/tasks/${taskId}`,
      providesTags: (_result, _error, taskId) => [{ type: "Task", id: taskId }],
    }),

    createTask: builder.mutation<Task, CreateTaskPayload>({
      query: (newTask) => ({
        url: "/tasks",
        method: "POST",
        body: newTask,
      }),
      invalidatesTags: ["Task"],
    }),

    updateTask: builder.mutation<
      Task,
      { id: string; data: Partial<CreateTaskPayload> }
    >({
      query: ({ id, data }) => ({
        url: `/tasks/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Task", id }],
    }),

    updateTaskStatus: builder.mutation<
      Task,
      { id: string; status: Task["status"] }
    >({
      query: ({ id, status }) => ({
        url: `/tasks/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      async onQueryStarted({ id, status }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          taskApiSlice.util.updateQueryData("getTasks", undefined, (draft) => {
            const task = draft.find((t) => t.id === id);
            if (task) {
              task.status = status;
            }
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: "Task", id }],
    }),

    deleteTask: builder.mutation<void, string>({
      query: (taskId) => ({
        url: `/tasks/${taskId}`,
        method: "DELETE",
      }),

      invalidatesTags: [{ type: "Task", id: "LIST" }, "Team", "Project"],
    }),

    addSubTask: builder.mutation<SubTask, { taskId: string; title: string }>({
      query: ({ taskId, title }) => ({
        url: `/tasks/${taskId}/subtasks`,
        method: "POST",
        body: { title },
      }),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: "Task", id: taskId },
      ],
    }),

    deleteSubTask: builder.mutation<
      void,
      { taskId: string; subtaskId: string }
    >({
      query: ({ taskId, subtaskId }) => ({
        url: `/tasks/${taskId}/subtasks/${subtaskId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: "Task", id: taskId },
      ],
    }),

    toggleSubTask: builder.mutation<
      SubTask,
      { taskId: string; subtaskId: string; completed: boolean }
    >({
      query: ({ taskId, subtaskId, completed }) => ({
        url: `/tasks/${taskId}/subtasks/${subtaskId}/toggle`,
        method: "PATCH",
        body: { completed },
      }),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: "Task", id: taskId },
      ],
    }),

    assignSubTask: builder.mutation<
      SubTask,
      { taskId: string; subtaskId: string; userId: string }
    >({
      query: ({ taskId, subtaskId, userId }) => ({
        url: `/tasks/${taskId}/subtasks/${subtaskId}/assign`,
        method: "PATCH",
        body: { userId },
      }),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: "Task", id: taskId },
      ],
    }),

    addComment: builder.mutation<
      unknown,
      { taskId: string; content: string; userId: string }
    >({
      query: ({ taskId, content, userId }) => ({
        url: "/comments",
        method: "POST",
        body: { taskId, content, userId },
      }),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: "Task", id: taskId },
      ],
    }),

    addTag: builder.mutation<Task, { taskId: string; tags: string[] }>({
      query: ({ taskId, tags }) => ({
        url: `/tasks/${taskId}`,
        method: "PATCH",
        body: { tags },
      }),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: "Task", id: taskId },
      ],
    }),

    addAttachment: builder.mutation<
      unknown,
      {
        taskId: string;
        name: string;
        url: string;
        type: string;
        size: number;
      }
    >({
      query: (data) => ({
        url: "/attachments",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: "Task", id: taskId },
      ],
    }),

    deleteAttachment: builder.mutation<void, string>({
      query: (attachmentId) => ({
        url: `/attachments/${attachmentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Task"],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskQuery,
  useLazyGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
  useDeleteTaskMutation,
  useAddSubTaskMutation,
  useDeleteSubTaskMutation,
  useToggleSubTaskMutation,
  useAssignSubTaskMutation,
  useAddCommentMutation,
  useAddTagMutation,
  useAddAttachmentMutation,
  useDeleteAttachmentMutation,
} = taskApiSlice;
