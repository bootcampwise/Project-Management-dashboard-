import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Project, Task, UiState } from "../types";

const getStoredTimeFormat = (): "12h" | "24h" => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("timeFormat");
    if (stored === "12h" || stored === "24h") {
      return stored;
    }
  }
  return "12h";
};

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
  timeFormat: getStoredTimeFormat(),
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleSidebarSection: (
      state,
      action: PayloadAction<keyof UiState["sidebarSections"]>,
    ) => {
      state.sidebarSections[action.payload] =
        !state.sidebarSections[action.payload];
    },

    setSettingsOpen: (state, action: PayloadAction<boolean>) => {
      state.isSettingsOpen = action.payload;
    },
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

    setSelectedTask: (state, action: PayloadAction<Task | null>) => {
      state.selectedTask = action.payload;
    },
    setActiveView: (state, action: PayloadAction<"kanban" | "list">) => {
      state.activeView = action.payload;
    },

    setTimeFormat: (state, action: PayloadAction<"12h" | "24h">) => {
      state.timeFormat = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("timeFormat", action.payload);
      }
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
  setTimeFormat,
} = uiSlice.actions;

export default uiSlice.reducer;
