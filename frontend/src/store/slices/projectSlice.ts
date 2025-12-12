import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ProjectState {
  activeTab: string;
  isCreateModalOpen: boolean;
  isTeamModalOpen: boolean;
  isTemplateLibraryOpen: boolean;
}

const initialState: ProjectState = {
  activeTab: "Board",
  isCreateModalOpen: false,
  isTeamModalOpen: false,
  isTemplateLibraryOpen: false,
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
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
});

export const {
  setActiveTab,
  setCreateModalOpen,
  setTeamModalOpen,
  setTemplateLibraryOpen,
} = projectSlice.actions;

export default projectSlice.reducer;
