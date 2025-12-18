import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { apiClient } from "../../lib/apiClient";

import type { ProjectState, Project, CreateProjectPayload } from "../../types";

const initialState: ProjectState = {
  projects: [],
  isLoading: false,
  error: null,
  activeTab: "Board",
  isCreateModalOpen: false,
  isTeamModalOpen: false,
  isTemplateLibraryOpen: false,
};

export const fetchProjects = createAsyncThunk(
  "project/fetchProjects",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<Project[]>("/projects");
      return response;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch projects"
      );
    }
  }
);

export const createProject = createAsyncThunk(
  "project/createProject",
  async (payload: CreateProjectPayload, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<Project>("/projects", payload);
      return response;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to create project"
      );
    }
  }
);

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    setCreateModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isCreateModalOpen = action.payload;
    },
    setTeamModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isTeamModalOpen = action.payload;
    },
    setTemplateLibraryOpen: (state, action: PayloadAction<boolean>) => {
      state.isTemplateLibraryOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchProjects.fulfilled,
        (state, action: PayloadAction<Project[]>) => {
          state.isLoading = false;
          state.projects = action.payload;
        }
      )
      .addCase(fetchProjects.rejected, (state, action) => {})
      .addCase(createProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        createProject.fulfilled,
        (state, action: PayloadAction<Project>) => {
          state.isLoading = false;
          state.projects.push(action.payload);
        }
      )
      .addCase(createProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setProjects,
  setLoading,
  setError,
  setActiveTab,
  setCreateModalOpen,
  setTeamModalOpen,
  setTemplateLibraryOpen,
} = projectSlice.actions;

export default projectSlice.reducer;
