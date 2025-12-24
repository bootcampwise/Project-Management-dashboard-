import { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setActiveProject } from "../../../store/uiSlice";
import {
  useGetProjectsQuery,
  useDeleteProjectMutation,
} from "../../../store/api/projectApiSlice";
import { showToast } from "../../../components/ui";

export const useTeam = () => {
  const dispatch = useAppDispatch();

  // Data from RTK Query
  const { data: projects = [] } = useGetProjectsQuery();
  const [deleteProject] = useDeleteProjectMutation();

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

  // Set default active project if none selected
  useEffect(() => {
    if (!activeProject && projects.length > 0) {
      dispatch(setActiveProject(projects[0]));
    }
  }, [projects, activeProject, dispatch]);

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
    setIsProjectDropdownOpen(false);
    setIsMenuDropdownOpen(false);
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProject(id).unwrap();
      showToast.success("Project deleted successfully");
      setIsMenuDropdownOpen(false);
    } catch (error) {
      showToast.error("Failed to delete project");
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
