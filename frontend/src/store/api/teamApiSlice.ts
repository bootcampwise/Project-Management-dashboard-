import { apiSlice } from "./apiSlice";
import type { TeamMember, Team, User } from "../../types";

// ============================================
// TEAM API ENDPOINTS
// ============================================

// Type for creating a new team
interface CreateTeamPayload {
  name: string;
  memberIds: string[];
  projectIds: string[];
}

// Type for updating a team
interface UpdateTeamPayload {
  name?: string;
  memberIds?: string[];
  projectIds?: string[];
}

export const teamApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ----------------------------------------
    // GET ALL TEAM MEMBERS (Users)
    // ----------------------------------------
    getTeamMembers: builder.query<TeamMember[], void>({
      query: () => "/users/",
      // Transform the API response to match our TeamMember type
      transformResponse: (users: User[]): TeamMember[] => {
        return users.map((user) => ({
          id: user.id,
          name: user.name || "Unknown",
          email: user.email,
          position: user.jobTitle || "Member",
          groups: user.department ? [user.department] : [],
          location: "Faisalabad",
          avatar: user.avatar || `https://i.pravatar.cc/150?u=${user.id}`,
        }));
      },
      providesTags: ["User"],
    }),

    // ----------------------------------------
    // GET ALL TEAMS (for current user)
    // ----------------------------------------
    getTeams: builder.query<Team[], void>({
      query: () => "/teams/my-teams",
      // Teams update infrequently - longer cache is fine
      keepUnusedDataFor: 180,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Team" as const, id })),
              { type: "Team", id: "LIST" },
            ]
          : [{ type: "Team", id: "LIST" }],
    }),

    // ----------------------------------------
    // GET ALL TEAMS (all teams in database)
    // ----------------------------------------
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

    // ----------------------------------------
    // CREATE A NEW TEAM
    // ----------------------------------------
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

    // ----------------------------------------
    // UPDATE A TEAM
    // ----------------------------------------
    updateTeam: builder.mutation<Team, { id: string; data: UpdateTeamPayload }>(
      {
        query: ({ id, data }) => ({
          url: `/teams/${id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: (result, error, { id }) => [
          { type: "Team", id },
          { type: "Team", id: "LIST" },
          { type: "Team", id: "ALL_LIST" },
        ],
      }
    ),

    // ----------------------------------------
    // DELETE A TEAM
    // ----------------------------------------
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
  }),
});

// ============================================
// EXPORT HOOKS
// ============================================

export const {
  useGetTeamMembersQuery, // const { data: members } = useGetTeamMembersQuery()
  useGetTeamsQuery, // const { data: teams } = useGetTeamsQuery() - user's teams
  useGetAllTeamsQuery, // const { data: allTeams } = useGetAllTeamsQuery() - all teams
  useCreateTeamMutation, // const [createTeam] = useCreateTeamMutation()
  useUpdateTeamMutation,
  useDeleteTeamMutation,
} = teamApiSlice;
