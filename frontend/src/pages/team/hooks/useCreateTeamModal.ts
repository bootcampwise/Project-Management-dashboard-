import { useState, useEffect, useRef } from "react";
import {
  useGetTeamMembersQuery,
  useGetTeamsQuery,
  useCreateTeamMutation,
  useUpdateTeamMutation,
} from "../../../store/api/teamApiSlice";
import { useGetProjectsQuery } from "../../../store/api/projectApiSlice";
import type { Team, TeamMember } from "../../../types";
import { showToast, getErrorMessage } from "../../../components/ui";

export const useCreateTeamModal = (
  isOpen: boolean,
  onClose: () => void,
  teamToEdit?: Team | null,
) => {
  const { data: members = [], isLoading: isMembersLoading } =
    useGetTeamMembersQuery(undefined, { skip: !isOpen });
  const { data: projects = [], isLoading: isProjectsLoading } =
    useGetProjectsQuery(undefined, { skip: !isOpen });
  const { refetch: refetchTeams } = useGetTeamsQuery();
  const { refetch: refetchProjects } = useGetProjectsQuery();
  const [createTeam] = useCreateTeamMutation();
  const [updateTeam] = useUpdateTeamMutation();

  const [teamName, setTeamName] = useState("");
  const [membersInput, setMembersInput] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<TeamMember[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const projectDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        projectDropdownRef.current &&
        !projectDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProjectDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isEditing = !!teamToEdit;

  useEffect(() => {
    if (isOpen) {
      if (teamToEdit) {
        setTeamName(teamToEdit.name);
        setSelectedMembers(teamToEdit.members || []);
        setSelectedProjectIds(teamToEdit.projects?.map((p) => p.id) || []);
      } else {
        setTeamName("");
        setSelectedMembers([]);
        setSelectedProjectIds([]);
      }
    }
  }, [isOpen, teamToEdit]);

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(membersInput.trim().toLowerCase()) ||
      member.email.toLowerCase().includes(membersInput.trim().toLowerCase()),
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
        selectedProjectIds.filter((id) => id !== projectId),
      );
    } else {
      setSelectedProjectIds([...selectedProjectIds, projectId]);
    }
  };

  const handleCreateOrUpdateTeam = async () => {
    if (!teamName.trim()) {
      showToast.error("Please enter a team name");
      return;
    }

    try {
      setIsSubmitting(true);

      if (isEditing && teamToEdit) {
        await updateTeam({
          id: teamToEdit.id,
          data: {
            name: teamName,
            memberIds: selectedMembers.map((m) => String(m.id)),
            projectIds: selectedProjectIds,
          },
        }).unwrap();
        showToast.success("Team updated successfully!");
      } else {
        await createTeam({
          name: teamName,
          memberIds: selectedMembers.map((m) => String(m.id)),
          projectIds: selectedProjectIds,
        }).unwrap();
        showToast.success("Team created successfully!");
      }
      refetchTeams();
      refetchProjects();
      onClose();
      if (!isEditing) {
        setTeamName("");
        setSelectedMembers([]);
        setSelectedProjectIds([]);
      }
    } catch (error) {
      showToast.error(
        `Failed to ${isEditing ? "update" : "create"} team. ${getErrorMessage(
          error,
        )}`,
      );
    } finally {
      setIsSubmitting(false);
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
    projects,
    isProjectsLoading,
    selectedProjectIds,
    isProjectDropdownOpen,
    setIsProjectDropdownOpen,
    projectDropdownRef,
    handleProjectToggle,
    isSubmitting,
    handleCreateOrUpdateTeam,
    isEditing,
  };
};
