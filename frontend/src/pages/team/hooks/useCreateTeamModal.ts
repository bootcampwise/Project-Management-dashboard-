import { useState } from "react";
import {
  useGetTeamMembersQuery,
  useGetTeamsQuery,
  useCreateTeamMutation,
} from "../../../store/api/teamApiSlice";
import { useGetProjectsQuery } from "../../../store/api/projectApiSlice";
import type { TeamMember } from "../../../types";
import { showToast } from "../../../components/ui";

export const useCreateTeamModal = (isOpen: boolean, onClose: () => void) => {
  // RTK Query hooks
  const { data: members = [], isLoading: isMembersLoading } =
    useGetTeamMembersQuery(undefined, { skip: !isOpen });
  const { data: projects = [], isLoading: isProjectsLoading } =
    useGetProjectsQuery(undefined, { skip: !isOpen });
  const { refetch: refetchTeams } = useGetTeamsQuery();
  const { refetch: refetchProjects } = useGetProjectsQuery();
  const [createTeam] = useCreateTeamMutation();

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
      showToast.error("Please enter a team name");
      return;
    }

    try {
      setIsCreating(true);

      await createTeam({
        name: teamName,
        memberIds: selectedMembers.map((m) => String(m.id)),
        projectIds: selectedProjectIds,
      }).unwrap();

      showToast.success("Team created successfully!");

      // Refresh teams and projects lists
      refetchTeams();
      refetchProjects();
      onClose();

      // Reset form
      setTeamName("");
      setSelectedMembers([]);
      setSelectedProjectIds([]);
    } catch (error: unknown) {
      console.error("Failed to create team:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create team";
      showToast.error(errorMessage);
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
