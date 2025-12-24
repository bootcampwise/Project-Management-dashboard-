import { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  fetchProjects,
  setActiveProject,
  deleteProject,
} from "../../../store/slices/projectSlice";
import toast from "react-hot-toast";

export const useTeam = () => {
  const dispatch = useAppDispatch();
  // Initialize based on screen width
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [activeTab, setActiveTab] = useState("Teams");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);

  // Team Page specific states
  const { projects, activeProject } = useAppSelector((state) => state.project);
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

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
      await dispatch(deleteProject(id)).unwrap();
      toast.success("Project deleted successfully");
      setIsMenuDropdownOpen(false);
    } catch (error) {
      toast.error("Failed to delete project");
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
    // New exports
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
