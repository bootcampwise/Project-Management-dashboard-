import { apiSlice } from "./apiSlice";
import type {
  CustomField,
  CustomFieldValue,
  CreateCustomFieldPayload,
} from "../../types";

export const customFieldApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProjectCustomFields: builder.query<CustomField[], string>({
      query: (projectId) => `/custom-fields/project/${projectId}`,
      providesTags: (result, _error, projectId) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "CustomField" as const,
                id,
              })),
              { type: "CustomField", id: `PROJECT-${projectId}` },
            ]
          : [{ type: "CustomField", id: `PROJECT-${projectId}` }],
    }),

    getTaskCustomFieldValues: builder.query<CustomFieldValue[], string>({
      query: (taskId) => `/custom-fields/task/${taskId}`,
      providesTags: (_result, _error, taskId) => [
        { type: "CustomFieldValue", id: `TASK-${taskId}` },
      ],
    }),

    createCustomField: builder.mutation<CustomField, CreateCustomFieldPayload>({
      query: (body) => ({
        url: "/custom-fields",
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { projectId }) => [
        { type: "CustomField", id: `PROJECT-${projectId}` },
      ],
    }),

    updateCustomField: builder.mutation<
      CustomField,
      { id: string; name?: string; options?: string[] }
    >({
      query: ({ id, ...body }) => ({
        url: `/custom-fields/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "CustomField", id },
      ],
    }),

    deleteCustomField: builder.mutation<
      void,
      { id: string; projectId: string }
    >({
      query: ({ id }) => ({
        url: `/custom-fields/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { projectId }) => [
        { type: "CustomField", id: `PROJECT-${projectId}` },
      ],
    }),

    setCustomFieldValue: builder.mutation<
      CustomFieldValue,
      { fieldId: string; taskId: string; value: string }
    >({
      query: ({ fieldId, taskId, value }) => ({
        url: `/custom-fields/${fieldId}/task/${taskId}`,
        method: "PUT",
        body: { value },
      }),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: "CustomFieldValue", id: `TASK-${taskId}` },
      ],
    }),

    clearCustomFieldValue: builder.mutation<
      void,
      { fieldId: string; taskId: string }
    >({
      query: ({ fieldId, taskId }) => ({
        url: `/custom-fields/${fieldId}/task/${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: "CustomFieldValue", id: `TASK-${taskId}` },
      ],
    }),
  }),
});

export const {
  useGetProjectCustomFieldsQuery,
  useGetTaskCustomFieldValuesQuery,
  useCreateCustomFieldMutation,
  useUpdateCustomFieldMutation,
  useDeleteCustomFieldMutation,
  useSetCustomFieldValueMutation,
  useClearCustomFieldValueMutation,
} = customFieldApiSlice;
