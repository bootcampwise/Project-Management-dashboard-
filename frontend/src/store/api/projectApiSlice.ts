import { apiSlice } from "./apiSlice";
import type { Project, CreateProjectPayload, TeamFile } from "../../types";

export const projectApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<Project[], void>({
      query: () => "/projects",
      keepUnusedDataFor: 120,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Project" as const, id })),
              { type: "Project", id: "LIST" },
            ]
          : [{ type: "Project", id: "LIST" }],
    }),

    createProject: builder.mutation<Project, CreateProjectPayload>({
      query: (newProject) => ({
        url: "/projects",
        method: "POST",
        body: newProject,
      }),
      invalidatesTags: [
        { type: "Project", id: "LIST" },
        { type: "Team", id: "LIST" },
        { type: "Team", id: "ALL_LIST" },
      ],
    }),

    deleteProject: builder.mutation<string, string>({
      query: (projectId) => ({
        url: `/projects/${projectId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, projectId) => [
        { type: "Project", id: projectId },
      ],
    }),

    updateProject: builder.mutation<
      Project,
      { id: string; data: Partial<Project> }
    >({
      query: ({ id, data }) => ({
        url: `/projects/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Project", id },
        { type: "Project", id: "LIST" },
      ],
    }),

    getProjectAttachments: builder.query<TeamFile[], string>({
      query: (projectId) => `/projects/${projectId}/attachments`,
      keepUnusedDataFor: 180,
      providesTags: (result, _error, projectId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "ProjectFile" as const, id })),
              { type: "ProjectFile", id: `LIST-${projectId}` },
            ]
          : [{ type: "ProjectFile", id: `LIST-${projectId}` }],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useUpdateProjectMutation,
  useGetProjectAttachmentsQuery,
  useLazyGetProjectAttachmentsQuery,
} = projectApiSlice;
