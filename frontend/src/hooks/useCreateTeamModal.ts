import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchTeamMembers } from "../store/slices/teamSlice";
import type { TeamMember } from "../types";

export const useCreateTeamModal = (isOpen: boolean) => {
  const dispatch = useAppDispatch();
  const { members, isLoading } = useAppSelector((state) => state.team);

  const [teamName, setTeamName] = useState("");
  const [membersInput, setMembersInput] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<TeamMember[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchTeamMembers());
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

  return {
    teamName,
    setTeamName,
    membersInput,
    setMembersInput,
    selectedMembers,
    setSelectedMembers,
    showSuggestions,
    setShowSuggestions,
    isLoading,
    filteredMembers,
    toggleMemberSelection,
  };
};
