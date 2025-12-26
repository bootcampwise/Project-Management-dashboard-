import { apiSlice } from "./apiSlice";
import type { Project, CreateProjectPayload, TeamFile } from "../../types";

// ============================================
// PROJECT API ENDPOINTS
// ============================================

export const projectApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ----------------------------------------
    // GET ALL PROJECTS
    // ----------------------------------------
    getProjects: builder.query<Project[], void>({
      query: () => "/projects",
      // Refetch if data is older than 30 seconds (balance freshness vs performance)
      keepUnusedDataFor: 120,
      // Cache tags: when any project changes, this list will refresh
      providesTags: (result) =>
        result
          ? [
              // Tag each project by its ID
              ...result.map(({ id }) => ({ type: "Project" as const, id })),
              // Also tag the whole list
              { type: "Project", id: "LIST" },
            ]
          : [{ type: "Project", id: "LIST" }],
    }),

    // ----------------------------------------
    // CREATE A NEW PROJECT
    // ----------------------------------------
    createProject: builder.mutation<Project, CreateProjectPayload>({
      query: (newProject) => ({
        url: "/projects",
        method: "POST",
        body: newProject,
      }),
      // After creating, refresh the project list AND team lists (since projects are assigned to teams)
      invalidatesTags: [
        { type: "Project", id: "LIST" },
        { type: "Team", id: "LIST" },
        { type: "Team", id: "ALL_LIST" },
      ],
    }),

    // ----------------------------------------
    // DELETE A PROJECT
    // ----------------------------------------
    deleteProject: builder.mutation<string, string>({
      query: (projectId) => ({
        url: `/projects/${projectId}`,
        method: "DELETE",
      }),
      // After deleting, refresh that specific project's cache
      invalidatesTags: (_result, _error, projectId) => [
        { type: "Project", id: projectId },
      ],
    }),

    // ----------------------------------------
    // GET PROJECT FILES/ATTACHMENTS
    // ----------------------------------------
    getProjectAttachments: builder.query<TeamFile[], string>({
      query: (projectId) => `/projects/${projectId}/attachments`,
      // Cache file metadata for 3 minutes (files don't change often)
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

// ============================================
// EXPORT HOOKS
// ============================================

export const {
  useGetProjectsQuery, // const { data: projects } = useGetProjectsQuery()
  useCreateProjectMutation, // const [createProject] = useCreateProjectMutation()
  useDeleteProjectMutation, // const [deleteProject] = useDeleteProjectMutation()
  useGetProjectAttachmentsQuery, // const { data: files } = useGetProjectAttachmentsQuery(projectId)
  useLazyGetProjectAttachmentsQuery,
} = projectApiSlice;
