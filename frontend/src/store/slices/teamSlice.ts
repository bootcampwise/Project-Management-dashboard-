import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { apiClient } from "../../lib/apiClient";
import type { TeamMember, TeamState, Team } from "../../types";

const initialState: TeamState = {
  members: [],
  teams: [],
  isLoading: false,
  error: null,
};

export const fetchTeamMembers = createAsyncThunk(
  "team/fetchTeamMembers",
  async (_, { rejectWithValue }) => {
    try {
      const users = await apiClient.get<any[]>("/users/");
      const mappedMembers: TeamMember[] = users.map((user) => ({
        id: user.id,
        name: user.name || "Unknown",
        email: user.email,
        position: user.jobTitle || "Member",
        groups: user.department ? [user.department] : [],
        location: user.location || "Faisalabad",
        avatar: user.avatar || `https://i.pravatar.cc/150?u=${user.id}`,
      }));
      return mappedMembers;
    } catch (err: unknown) {
      let message = "An unexpected error occurred";
      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === "string") {
        message = err;
      }
      return rejectWithValue(message);
    }
  }
);

export const fetchTeams = createAsyncThunk(
  "team/fetchTeams",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<Team[]>("/teams/my-teams");
      return response;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch teams"
      );
    }
  }
);

export const createTeam = createAsyncThunk(
  "team/createTeam",
  async (
    teamData: { name: string; memberIds: string[]; projectIds: string[] },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post<Team>("/teams", teamData);
      return response;
    } catch (err: any) {
      console.error("Create Team Error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to create team";
      return rejectWithValue(errorMessage);
    }
  }
);

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeamMembers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchTeamMembers.fulfilled,
        (state, action: PayloadAction<TeamMember[]>) => {
          state.isLoading = false;
          state.members = action.payload;
        }
      )
      .addCase(fetchTeamMembers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Teams
      .addCase(fetchTeams.fulfilled, (state, action: PayloadAction<Team[]>) => {
        state.teams = action.payload;
      })
      // Create Team
      .addCase(createTeam.fulfilled, (state, action: PayloadAction<Team>) => {
        state.teams.push(action.payload);
      });
  },
});

export default teamSlice.reducer;
