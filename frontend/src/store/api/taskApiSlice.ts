import { apiSlice } from "./apiSlice";
import type { Task, CreateTaskPayload } from "../../types";

// ============================================
// SUBTASK TYPE
// ============================================

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  assigneeId?: string;
}

// ============================================
// TASK API ENDPOINTS
// ============================================

export const taskApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ----------------------------------------
    // GET ALL TASKS
    // ----------------------------------------
    getTasks: builder.query<Task[], void>({
      query: () => "/tasks",
      // Tasks are real-time critical - shorter cache
      keepUnusedDataFor: 60,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Task" as const, id })),
              { type: "Task", id: "LIST" },
            ]
          : [{ type: "Task", id: "LIST" }],
    }),

    // ----------------------------------------
    // GET SINGLE TASK BY ID
    // ----------------------------------------
    getTask: builder.query<Task, string>({
      query: (taskId) => `/tasks/${taskId}`,
      providesTags: (_result, _error, taskId) => [{ type: "Task", id: taskId }],
    }),

    // ----------------------------------------
    // CREATE A NEW TASK
    // ----------------------------------------
    createTask: builder.mutation<Task, CreateTaskPayload>({
      query: (newTask) => ({
        url: "/tasks",
        method: "POST",
        body: newTask,
      }),
      invalidatesTags: [{ type: "Task", id: "LIST" }],
    }),

    // ----------------------------------------
    // UPDATE A TASK
    // ----------------------------------------
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

    // ----------------------------------------
    // UPDATE TASK STATUS (for drag & drop)
    // ----------------------------------------
    updateTaskStatus: builder.mutation<Task, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/tasks/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Task", id }],
    }),

    // ----------------------------------------
    // DELETE A TASK
    // ----------------------------------------
    deleteTask: builder.mutation<void, string>({
      query: (taskId) => ({
        url: `/tasks/${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Task", id: "LIST" }],
    }),

    // ----------------------------------------
    // ADD SUBTASK
    // ----------------------------------------
    addSubtask: builder.mutation<Subtask, { taskId: string; title: string }>({
      query: ({ taskId, title }) => ({
        url: `/tasks/${taskId}/subtasks`,
        method: "POST",
        body: { title },
      }),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: "Task", id: taskId },
      ],
    }),

    // ----------------------------------------
    // DELETE SUBTASK
    // ----------------------------------------
    deleteSubtask: builder.mutation<
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

    // ----------------------------------------
    // TOGGLE SUBTASK COMPLETION
    // ----------------------------------------
    toggleSubtask: builder.mutation<
      Subtask,
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

    // ----------------------------------------
    // ASSIGN SUBTASK TO USER
    // ----------------------------------------
    assignSubtask: builder.mutation<
      Subtask,
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

    // ----------------------------------------
    // ADD COMMENT TO TASK
    // ----------------------------------------
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

    // ----------------------------------------
    // ADD TAG TO TASK
    // ----------------------------------------
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

    // ----------------------------------------
    // ADD ATTACHMENT TO TASK
    // ----------------------------------------
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

    // ----------------------------------------
    // DELETE ATTACHMENT
    // ----------------------------------------
    deleteAttachment: builder.mutation<void, string>({
      query: (attachmentId) => ({
        url: `/attachments/${attachmentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Task"],
    }),
  }),
});

// ============================================
// EXPORT HOOKS
// ============================================

export const {
  // Queries
  useGetTasksQuery,
  useLazyGetTaskQuery,
  // Basic mutations
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
  useDeleteTaskMutation,
  // Subtask mutations
  useAddSubtaskMutation,
  useDeleteSubtaskMutation,
  useToggleSubtaskMutation,
  useAssignSubtaskMutation,
  // Comment & Tag mutations
  useAddCommentMutation,
  useAddTagMutation,
  // Attachment mutations
  useAddAttachmentMutation,
  useDeleteAttachmentMutation,
} = taskApiSlice;
