import { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useGetAllTeamsQuery,
  useGetTeamsQuery,
  useDeleteTeamMutation,
  usePrefetchTeam,
} from "../../../store/api/teamApiSlice";
import { showToast, getErrorMessage } from "../../../components/ui";
import type { Team } from "../../../types";
import { useTeamFiles } from "./useTeamFiles";

export const useTeam = () => {
  const { data: allTeams = [], isLoading: teamsLoading } =
    useGetAllTeamsQuery();
  const { data: myTeams = [] } = useGetTeamsQuery();
  const [deleteTeam] = useDeleteTeamMutation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [activeTab, setActiveTab] = useState("Teams");
  const [teamToEdit, setTeamToEdit] = useState<Team | null>(null);
  const [hasInitializedTab, setHasInitializedTab] = useState(false);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
  const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const activeTeam = useMemo(() => {
    if (teamsLoading || allTeams.length === 0) {
      return null;
    }

    const teamIdFromUrl = searchParams.get("teamId");

    if (teamIdFromUrl) {
      const foundTeam = allTeams.find((t) => t.id === teamIdFromUrl);
      if (foundTeam) {
        return foundTeam;
      }
    }

    return null;
  }, [allTeams, teamsLoading, searchParams]);

  const prefetchTeamStats = usePrefetchTeam("getTeamStats");
  const prefetchMemberStats = usePrefetchTeam("getTeamMemberStats");
  const prefetchTeam = usePrefetchTeam("getTeam");

  useEffect(() => {
    if (activeTeam?.id) {
      prefetchTeamStats({ teamId: activeTeam.id });
      prefetchMemberStats(activeTeam.id);
      prefetchTeam(activeTeam.id);
    }
  }, [activeTeam?.id, prefetchTeamStats, prefetchMemberStats, prefetchTeam]);

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

  const tabs = activeTeam
    ? ["Projects", "Dashboard", "Members", "Files"]
    : ["Teams", "Dashboard", "Members", "Files"];
  useEffect(() => {
    if (activeTeam && activeTab === "Teams") {
      setActiveTab("Projects");
      setHasInitializedTab(true);
    } else if (!activeTeam && activeTab === "Projects") {
      setActiveTab("Teams");
      setHasInitializedTab(true);
    } else if (!hasInitializedTab && !teamsLoading) {
      if (activeTeam) {
        setActiveTab("Projects");
      } else {
        setActiveTab("Teams");
      }
      setHasInitializedTab(true);
    }
  }, [activeTeam, activeTab, hasInitializedTab, teamsLoading]);

  const handleSwitchTeam = (team: Team | null) => {
    if (team) {
      setSearchParams({ teamId: team.id });
    } else {
      setSearchParams({});
    }
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
        setSearchParams({});
      }
      setIsMenuDropdownOpen(false);
    } catch (error) {
      showToast.error(`Failed to delete team. ${getErrorMessage(error)}`);
    }
  };

  const handleToggleTeamFavorite = () => {
    showToast.success("Team added to favorites");
  };

  const [hasVisitedFilesTab, setHasVisitedFilesTab] = useState(false);

  useEffect(() => {
    if (activeTab === "Files") {
      setHasVisitedFilesTab(true);
    }
  }, [activeTab]);

  const teamFiles = useTeamFiles(
    activeTeam,
    allTeams,
    activeTab === "Files" || hasVisitedFilesTab,
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
    teamFiles,
    myTeams,
  };
};
