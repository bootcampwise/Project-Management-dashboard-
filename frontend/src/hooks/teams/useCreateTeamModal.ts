import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchTeamMembers,
  createTeam,
  fetchTeams,
} from "../../store/slices/teamSlice";
import { fetchProjects } from "../../store/slices/projectSlice";
import type { TeamMember } from "../../types";
import { toast } from "react-hot-toast";

export const useCreateTeamModal = (isOpen: boolean, onClose: () => void) => {
  const dispatch = useAppDispatch();
  const { members, isLoading: isMembersLoading } = useAppSelector(
    (state) => state.team
  );
  const { projects, isLoading: isProjectsLoading } = useAppSelector(
    (state) => state.project
  );

  // Form State
  const [teamName, setTeamName] = useState("");
  const [membersInput, setMembersInput] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<TeamMember[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Project Selection State
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);

  // Loading State for creation
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchTeamMembers());
      dispatch(fetchProjects());
    }
  }, [isOpen, dispatch]);

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(membersInput.toLowerCase()) ||
      member.email.toLowerCase().includes(membersInput.toLowerCase())
  );

  const toggleMemberSelection = (member: TeamMember) => {
    if (selectedMembers.find((m) => m.id === member.id)) {
      setSelectedMembers(selectedMembers.filter((m) => m.id !== member.id));
    } else {
      setSelectedMembers([...selectedMembers, member]);
    }
  };

  const handleProjectToggle = (projectId: string) => {
    if (selectedProjectIds.includes(projectId)) {
      setSelectedProjectIds(
        selectedProjectIds.filter((id) => id !== projectId)
      );
    } else {
      setSelectedProjectIds([...selectedProjectIds, projectId]);
    }
  };

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      toast.error("Please enter a team name");
      return;
    }

    try {
      setIsCreating(true);

      await dispatch(
        createTeam({
          name: teamName,
          memberIds: selectedMembers.map((m) => String(m.id)),
          projectIds: selectedProjectIds,
        })
      ).unwrap();

      toast.success("Team created successfully!");

      // Refresh teams list so it appears in other modals
      dispatch(fetchTeams());
      dispatch(fetchProjects());
      onClose();

      // Reset form
      setTeamName("");
      setSelectedMembers([]);
      setSelectedProjectIds([]);
    } catch (error: any) {
      console.error("Failed to create team:", error);
      toast.error(error.message || error || "Failed to create team");
    } finally {
      setIsCreating(false);
    }
  };

  return {
    teamName,
    setTeamName,
    membersInput,
    setMembersInput,
    selectedMembers,
    setSelectedMembers,
    showSuggestions,
    setShowSuggestions,
    isMembersLoading,
    filteredMembers,
    toggleMemberSelection,
    // Projects
    projects,
    isProjectsLoading,
    selectedProjectIds,
    isProjectDropdownOpen,
    setIsProjectDropdownOpen,
    handleProjectToggle,
    // Creation
    isCreating,
    handleCreateTeam,
  };
};
