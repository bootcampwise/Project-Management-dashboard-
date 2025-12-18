import { useAppDispatch, useAppSelector } from "../store/hooks";
import type { Task } from "../types";
import { Layout, Table, Calendar, List } from "lucide-react";
import {
  setActiveTab,
  setCreateModalOpen,
  setTeamModalOpen,
  setTemplateLibraryOpen,
} from "../store/slices/projectSlice";
import { setSidebarOpen } from "../store/slices/uiSlice";
import { setSelectedTask } from "../store/slices/taskSlice";
import type { CreateProjectPayload } from "../types";

export const useProjectBoard = () => {
  const dispatch = useAppDispatch();

  // Selectors
  const { sidebarOpen } = useAppSelector((state) => state.ui);
  const {
    activeTab,
    isCreateModalOpen,
    isTeamModalOpen,
    isTemplateLibraryOpen,
  } = useAppSelector((state) => state.project);
  const { selectedTask } = useAppSelector((state) => state.task); // Using taskSlice for selectedTask

  const tabs = [
    { id: "Board", icon: Layout },
    { id: "Table", icon: Table },
    { id: "Calendar", icon: Calendar },
    { id: "Timeline", icon: List },
    { id: "Dashboard", icon: Layout },
  ];

  const handleCreateProject = (data: CreateProjectPayload) => {
    console.log("Create Project Data:", data);
    dispatch(setCreateModalOpen(false));
    dispatch(setTeamModalOpen(true));
  };

  const handleOpenTemplateLibrary = () => {
    dispatch(setCreateModalOpen(false));
    dispatch(setTemplateLibraryOpen(true));
  };

  const handleSelectTemplate = () => {
    dispatch(setTemplateLibraryOpen(false));
    dispatch(setCreateModalOpen(true));
  };

  return {
    // States
    sidebarOpen,
    setSidebarOpen: (open: boolean) => dispatch(setSidebarOpen(open)),
    activeTab,
    setActiveTab: (tab: string) => dispatch(setActiveTab(tab)),
    isCreateModalOpen,
    setIsCreateModalOpen: (open: boolean) => dispatch(setCreateModalOpen(open)),
    isTeamModalOpen,
    setIsTeamModalOpen: (open: boolean) => dispatch(setTeamModalOpen(open)),
    isTemplateLibraryOpen,
    setIsTemplateLibraryOpen: (open: boolean) =>
      dispatch(setTemplateLibraryOpen(open)),
    selectedTask,
    setSelectedTask: (task: Task | null) => dispatch(setSelectedTask(task)),

    // Data
    tabs,

    // Handlers
    handleCreateProject,
    handleOpenTemplateLibrary,
    handleSelectTemplate,
  };
};
