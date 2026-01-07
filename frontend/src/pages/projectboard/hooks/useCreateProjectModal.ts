import { useState } from "react";
import { useGetTeamsQuery } from "../../../store/api/teamApiSlice";
import { showToast } from "../../../components/ui";
import type { UseCreateProjectModalProps } from "../../../types";

export const useCreateProjectModal = ({
  isOpen: _isOpen,
  onClose,
  onCreate,
}: UseCreateProjectModalProps) => {
  const { data: teams = [] } = useGetTeamsQuery();

  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [privacy, setPrivacy] = useState<"public" | "private" | "team">(
    "public",
  );
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!projectName.trim()) {
      showToast.error("Please enter a project name");
      return;
    }

    try {
      setIsCreating(true);
      await onCreate({
        name: projectName,
        description,
        dueDate: dueDate || undefined,
        teamId: selectedTeamId || undefined,
        privacy,
      });
      onClose();
      setProjectName("");
      setDescription("");
      setDueDate("");
      setSelectedTeamId("");
      setPrivacy("public");
    } catch (error: unknown) {
      console.error("Failed to create project:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return {
    teams,
    projectName,
    setProjectName,
    description,
    setDescription,
    dueDate,
    setDueDate,
    selectedTeamId,
    setSelectedTeamId,
    privacy,
    setPrivacy,
    isCreating,
    handleCreate,
  };
};
