import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Project, Task, UiState } from "../types";

// ============================================
// UI STATE - All UI-related state
// ============================================

const initialState: UiState = {
  sidebarOpen: typeof window !== "undefined" && window.innerWidth >= 768,
  sidebarSections: {
    mobileApp: true,
    diadora: true,
  },
  isSettingsOpen: false,
  isCreateProjectModalOpen: false,
  isTeamModalOpen: false,
  isTemplateLibraryOpen: false,
  activeProject: null,
  activeTab: "Board",
  selectedTask: null,
  activeView: "kanban",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    // Sidebar
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleSidebarSection: (
      state,
      action: PayloadAction<keyof UiState["sidebarSections"]>
    ) => {
      state.sidebarSections[action.payload] =
        !state.sidebarSections[action.payload];
    },

    // Settings
    setSettingsOpen: (state, action: PayloadAction<boolean>) => {
      state.isSettingsOpen = action.payload;
    },

    // Project UI
    setActiveProject: (state, action: PayloadAction<Project | null>) => {
      state.activeProject = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    setCreateProjectModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isCreateProjectModalOpen = action.payload;
    },
    setTeamModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isTeamModalOpen = action.payload;
    },
    setTemplateLibraryOpen: (state, action: PayloadAction<boolean>) => {
      state.isTemplateLibraryOpen = action.payload;
    },

    // Task UI
    setSelectedTask: (state, action: PayloadAction<Task | null>) => {
      state.selectedTask = action.payload;
    },
    setActiveView: (state, action: PayloadAction<"kanban" | "list">) => {
      state.activeView = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleSidebarSection,
  setSettingsOpen,
  setActiveProject,
  setActiveTab,
  setCreateProjectModalOpen,
  setTeamModalOpen,
  setTemplateLibraryOpen,
  setSelectedTask,
  setActiveView,
} = uiSlice.actions;

export default uiSlice.reducer;
