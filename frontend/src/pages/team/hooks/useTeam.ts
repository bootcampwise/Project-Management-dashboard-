import { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setActiveProject } from "../../../store/uiSlice";
import {
  useGetProjectsQuery,
  useDeleteProjectMutation,
} from "../../../store/api/projectApiSlice";
import { useGetSessionQuery } from "../../../store/api/authApiSlice";
import { showToast, getErrorMessage } from "../../../components/ui";
import {
  saveLastProjectId,
  getLastProjectId,
} from "../../../utils/projectStorage";

export const useTeam = () => {
  const dispatch = useAppDispatch();

  // Data from RTK Query
  const { data: projects = [], isLoading: projectsLoading } =
    useGetProjectsQuery();
  const [deleteProject] = useDeleteProjectMutation();
  const { data: user, isLoading: sessionLoading } = useGetSessionQuery();

  // UI state from Redux
  const { activeProject } = useAppSelector((state) => state.ui);

  // Local state
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [activeTab, setActiveTab] = useState("Teams");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ============================================
  // PROJECT RESTORATION (CRITICAL FOR FAST UX)
  // ============================================
  useEffect(() => {
    // Wait for session and projects to be ready
    if (sessionLoading || projectsLoading || projects.length === 0) return;

    const userId = user?.id;

    // Priority 1: Restore from localStorage (user-specific)
    const lastProjectId = getLastProjectId(userId);
    if (lastProjectId && !activeProject) {
      const lastProject = projects.find((p) => p.id === lastProjectId);
      if (lastProject) {
        dispatch(setActiveProject(lastProject));
        return;
      }
    }

    // Priority 2: Default to first project (only if nothing else works)
    if (!activeProject) {
      dispatch(setActiveProject(projects[0]));
      saveLastProjectId(projects[0].id, userId);
    }
  }, [
    projects,
    projectsLoading,
    sessionLoading,
    user,
    activeProject,
    dispatch,
  ]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProjectDropdownOpen(false);
        setIsMenuDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSwitchProject = (p: (typeof projects)[0]) => {
    dispatch(setActiveProject(p));
    saveLastProjectId(p.id, user?.id); // Remember for next refresh (user-specific)
    setIsProjectDropdownOpen(false);
    setIsMenuDropdownOpen(false);
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProject(id).unwrap();
      showToast.success("Project deleted successfully");
      setIsMenuDropdownOpen(false);
    } catch (error) {
      showToast.error(`Failed to delete project. ${getErrorMessage(error)}`);
    }
  };

  const tabs = ["Teams", "Dashboard", "Members", "Files"];

  return {
    sidebarOpen,
    setSidebarOpen,
    activeTab,
    setActiveTab,
    isSearchOpen,
    setIsSearchOpen,
    isCreateTeamModalOpen,
    setIsCreateTeamModalOpen,
    tabs,
    projects,
    projectsLoading, // NEW: for loading state
    activeProject,
    isProjectDropdownOpen,
    setIsProjectDropdownOpen,
    isMenuDropdownOpen,
    setIsMenuDropdownOpen,
    menuRef,
    handleSwitchProject,
    handleDeleteProject,
  };
};
