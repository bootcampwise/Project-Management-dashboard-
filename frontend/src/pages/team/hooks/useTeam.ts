import { useState, useEffect, useRef } from "react";
import {
  useGetAllTeamsQuery,
  useDeleteTeamMutation,
} from "../../../store/api/teamApiSlice";
import { showToast, getErrorMessage } from "../../../components/ui";
import type { Team } from "../../../types";
import { useTeamFiles } from "./useTeamFiles";

export const useTeam = () => {
  // Data from RTK Query
  const { data: allTeams = [], isLoading: teamsLoading } =
    useGetAllTeamsQuery();
  const [deleteTeam] = useDeleteTeamMutation();

  // Local state
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [activeTab, setActiveTab] = useState("Teams");
  const [activeTeam, setActiveTeam] = useState<Team | null>(null);
  const [teamToEdit, setTeamToEdit] = useState<Team | null>(null);
  const [hasInitializedTeam, setHasInitializedTeam] = useState(false);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
  const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Set default team on load
  // We keep default selection logic, but ensure 'activeTeam' drives the tabs
  useEffect(() => {
    if (!teamsLoading && allTeams.length > 0 && !hasInitializedTeam) {
      setActiveTeam(allTeams[0]);
      setHasInitializedTeam(true);
    } else if (!teamsLoading && allTeams.length === 0 && !hasInitializedTeam) {
      setHasInitializedTeam(true);
    }
  }, [allTeams, teamsLoading, hasInitializedTeam]);

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

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Dynamic Tabs based on Active Team
  const tabs = activeTeam
    ? ["Projects", "Dashboard", "Members", "Files"]
    : ["Teams", "Dashboard", "Members", "Files"];

  // Reset to first tab when switching between All Teams (Teams tab) and Specific Team (Projects tab)
  useEffect(() => {
    if (activeTeam && activeTab === "Teams") {
      setActiveTab("Projects");
    } else if (!activeTeam && activeTab === "Projects") {
      setActiveTab("Teams");
    }
  }, [activeTeam, activeTab]);

  const handleSwitchTeam = (team: Team | null) => {
    setActiveTeam(team);
    // When switching team, useEffect above handles tab reset if needed
  };

  const handleOpenCreateTeamModal = () => {
    setTeamToEdit(null);
    setIsCreateTeamModalOpen(true);
  };

  const handleEditTeam = (team: Team) => {
    setTeamToEdit(team);
    setIsCreateTeamModalOpen(true);
  };

  const handleDeleteTeam = async (id: string) => {
    try {
      await deleteTeam(id).unwrap();
      showToast.success("Team deleted successfully");
      if (activeTeam?.id === id) {
        setActiveTeam(null);
      }
      setIsMenuDropdownOpen(false);
    } catch (error) {
      showToast.error(`Failed to delete team. ${getErrorMessage(error)}`);
    }
  };

  const handleToggleTeamFavorite = () => {
    showToast.success("Team added to favorites");
  };

  // Optimize: Only fetch files if we're on the Files tab OR have visited it before
  const [hasVisitedFilesTab, setHasVisitedFilesTab] = useState(false);

  useEffect(() => {
    if (activeTab === "Files") {
      setHasVisitedFilesTab(true);
    }
  }, [activeTab]);

  const teamFiles = useTeamFiles(
    activeTeam,
    allTeams,
    activeTab === "Files" || hasVisitedFilesTab
  );

  return {
    sidebarOpen,
    setSidebarOpen,
    activeTab,
    setActiveTab,
    isSearchOpen,
    setIsSearchOpen,
    isCreateTeamModalOpen,
    setIsCreateTeamModalOpen,
    handleOpenCreateTeamModal,
    handleEditTeam,
    teamToEdit,
    tabs,
    allTeams,
    activeTeam,
    teamsLoading,
    isMenuDropdownOpen,
    setIsMenuDropdownOpen,
    menuRef,
    handleSwitchTeam,
    handleDeleteTeam,
    handleToggleTeamFavorite,
    teamFiles, // Expose the file hook data
  };
};
