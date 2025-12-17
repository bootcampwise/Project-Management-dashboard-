import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { apiClient } from "../../lib/apiClient";
import type { TeamMember } from "../../types";

interface TeamState {
  members: TeamMember[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TeamState = {
  members: [],
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
      });
  },
});

export default teamSlice.reducer;
