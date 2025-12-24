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
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Team" as const, id })),
              { type: "Team", id: "LIST" },
            ]
          : [{ type: "Team", id: "LIST" }],
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
      invalidatesTags: [{ type: "Team", id: "LIST" }],
    }),
  }),
});

// ============================================
// EXPORT HOOKS
// ============================================

export const {
  useGetTeamMembersQuery, // const { data: members } = useGetTeamMembersQuery()
  useGetTeamsQuery, // const { data: teams } = useGetTeamsQuery()
  useCreateTeamMutation, // const [createTeam] = useCreateTeamMutation()
} = teamApiSlice;
