import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { fetchTeams } from "../../../store/slices/teamSlice";
import { toast } from "react-hot-toast";
import type { UseCreateProjectModalProps } from "../../../types";

export const useCreateProjectModal = ({
  isOpen,
  onClose,
  onCreate,
}: UseCreateProjectModalProps) => {
  const dispatch = useAppDispatch();
  const { teams } = useAppSelector((state) => state.team);

  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [privacy, setPrivacy] = useState<"public" | "private" | "team">(
    "public"
  );
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchTeams());
    }
  }, [isOpen, dispatch]);

  const handleCreate = async () => {
    if (!projectName.trim()) {
      toast.error("Please enter a project name");
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
      // Reset form
      setProjectName("");
      setDescription("");
      setDueDate("");
      setSelectedTeamId("");
      setPrivacy("public");
    } catch (error: unknown) {
      console.error("Failed to create project:", error);
      // Error handling usually done by parent or global handler, but we can toast
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
