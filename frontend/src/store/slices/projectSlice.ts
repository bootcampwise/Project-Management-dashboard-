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
  activeProject: null,
};

export const fetchProjects = createAsyncThunk(
  "project/fetchProjects",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<Project[]>("/projects");
      return response;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch projects"
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
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      return rejectWithValue(
        error.response?.data?.error || "Failed to create project"
      );
    }
  }
);

export const deleteProject = createAsyncThunk(
  "project/deleteProject",
  async (projectId: string, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/projects/${projectId}`);
      return projectId;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      return rejectWithValue(
        error.response?.data?.error || "Failed to delete project"
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
    setActiveProject: (state, action: PayloadAction<Project | null>) => {
      state.activeProject = action.payload;
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

          if (state.projects.length > 0) {
            if (!state.activeProject) {
              state.activeProject = state.projects[0];
            } else {
              // Refresh active project data to ensure nested fields (like teams) are up to date
              const updatedActive = state.projects.find(
                (p) => p.id === state.activeProject?.id
              );
              if (updatedActive) {
                state.activeProject = updatedActive;
              } else {
                // If active project was deleted/not found, switch to first available
                state.activeProject = state.projects[0];
              }
            }
          } else {
            state.activeProject = null;
          }
        }
      )
      .addCase(fetchProjects.rejected, () => {})
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
      })
      .addCase(deleteProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = state.projects.filter((p) => p.id !== action.payload);
        if (state.activeProject?.id === action.payload) {
          state.activeProject =
            state.projects.length > 0 ? state.projects[0] : null;
        }
      })
      .addCase(deleteProject.rejected, (state, action) => {
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
  setActiveProject,
} = projectSlice.actions;

export default projectSlice.reducer;
