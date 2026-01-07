import { apiSlice } from "./apiSlice";
import type {
  TeamMember,
  Team,
  User,
  CreateTeamPayload,
  UpdateTeamPayload,
  TopEarningProject,
  YearlyOverviewData,
  TeamMemberStats,
  TeamStats,
} from "../../types";

export const teamApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTeamMembers: builder.query<TeamMember[], void>({
      query: () => "/users/",
      transformResponse: (users: User[]): TeamMember[] => {
        return users.map((user) => ({
          id: user.id,
          name: user.name || "Unknown",
          email: user.email,
          position: user.jobTitle || "Member",
          groups: user.department ? [user.department] : [],
          location: "Faisalabad",
          avatar: user.avatar || undefined,
        }));
      },
      providesTags: ["User"],
    }),

    getTeams: builder.query<Team[], void>({
      query: () => "/teams/my-teams",
      keepUnusedDataFor: 180,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Team" as const, id })),
              { type: "Team", id: "LIST" },
            ]
          : [{ type: "Team", id: "LIST" }],
    }),

    getAllTeams: builder.query<Team[], void>({
      query: () => "/teams/all",
      keepUnusedDataFor: 180,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Team" as const, id })),
              { type: "Team", id: "ALL_LIST" },
            ]
          : [{ type: "Team", id: "ALL_LIST" }],
    }),

    getTeam: builder.query<Team, string>({
      query: (id) => `/teams/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Team", id }],
    }),

    createTeam: builder.mutation<Team, CreateTeamPayload>({
      query: (newTeam) => ({
        url: "/teams",
        method: "POST",
        body: newTeam,
      }),
      invalidatesTags: [
        { type: "Team", id: "LIST" },
        { type: "Team", id: "ALL_LIST" },
      ],
    }),

    updateTeam: builder.mutation<Team, { id: string; data: UpdateTeamPayload }>(
      {
        query: ({ id, data }) => ({
          url: `/teams/${id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: (_result, _error, { id }) => [
          { type: "Team", id },
          { type: "Team", id: "LIST" },
          { type: "Team", id: "ALL_LIST" },
        ],
      },
    ),

    deleteTeam: builder.mutation<void, string>({
      query: (id) => ({
        url: `/teams/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Team", id: "LIST" },
        { type: "Team", id: "ALL_LIST" },
      ],
    }),

    getTeamMemberStats: builder.query<TeamMemberStats[], string>({
      query: (teamId) => `/teams/${teamId}/member-stats`,
      keepUnusedDataFor: 120,
      providesTags: (_result, _error, teamId) => [{ type: "Team", id: teamId }],
    }),

    getTeamStats: builder.query<
      TeamStats,
      { teamId: string; projectId?: string }
    >({
      query: ({ teamId, projectId }) => {
        let url = `/teams/${teamId}/stats`;
        if (projectId && projectId !== "all") {
          url += `?projectId=${projectId}`;
        }
        return url;
      },
      keepUnusedDataFor: 120,
      providesTags: (_result, _error, arg) => [
        { type: "Team", id: arg.teamId },
      ],
    }),

    getTopEarning: builder.query<
      TopEarningProject[],
      { teamId: string; range?: string }
    >({
      query: ({ teamId, range }) => {
        let url = `/teams/${teamId}/top-earning`;
        if (range) {
          url += `?range=${range}`;
        }
        return url;
      },
      providesTags: (_result, _error, arg) => [
        { type: "Team", id: arg.teamId },
      ],
    }),

    getYearlyOverview: builder.query<
      YearlyOverviewData[],
      { teamId: string; year: number }
    >({
      query: ({ teamId, year }) =>
        `/teams/${teamId}/income-overview?year=${year}`,
      providesTags: (_result, _error, arg) => [
        { type: "Team", id: arg.teamId },
      ],
    }),
  }),
});

export const {
  useGetTeamMembersQuery,
  useGetTeamsQuery,
  useGetTeamQuery,
  useGetAllTeamsQuery,
  useCreateTeamMutation,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
  useGetTeamMemberStatsQuery,
  useGetTeamStatsQuery,
  useGetTopEarningQuery,
  useGetYearlyOverviewQuery,
  usePrefetch: usePrefetchTeam,
} = teamApiSlice;
