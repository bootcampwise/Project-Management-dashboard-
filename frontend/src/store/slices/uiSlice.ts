import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { UiState } from "../../types";

const initialState: UiState = {
  sidebarOpen: window.innerWidth >= 768,
  isSettingsOpen: false,
  sidebarSections: {
    mobileApp: true,
    diadora: true,
  },
  theme: "light",
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
    toggleSettings: (state) => {
      state.isSettingsOpen = !state.isSettingsOpen;
    },
    setSettingsOpen: (state, action: PayloadAction<boolean>) => {
      state.isSettingsOpen = action.payload;
    },
    toggleSidebarSection: (
      state,
      action: PayloadAction<keyof UiState["sidebarSections"]>
    ) => {
      state.sidebarSections[action.payload] =
        !state.sidebarSections[action.payload];
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleSettings,
  setSettingsOpen,
  toggleSidebarSection,
  setTheme,
} = uiSlice.actions;

export default uiSlice.reducer;
