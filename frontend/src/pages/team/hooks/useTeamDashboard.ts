import { useState, useMemo } from "react";
import {
  useGetTeamMemberStatsQuery,
  useGetTeamStatsQuery,
  useGetTeamQuery,
} from "../../../store/api/teamApiSlice";

export const useTeamDashboard = (teamId?: string) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  const { data: team } = useGetTeamQuery(teamId || "", {
    skip: !teamId,
  });

  const { data: memberStats, isLoading: isMemberLoading } =
    useGetTeamMemberStatsQuery(teamId || "", { skip: !teamId });

  const { data: stats, isLoading: isStatsLoading } = useGetTeamStatsQuery(
    { teamId: teamId || "", projectId: selectedProjectId || undefined },
    { skip: !teamId },
  );

  const projectItems = useMemo(() => {
    const items = [
      {
        key: "",
        label: "All Projects",
        onClick: () => setSelectedProjectId(""),
      },
    ];

    team?.projects?.forEach((project) => {
      items.push({
        key: project.id,
        label: project.name,
        onClick: () => setSelectedProjectId(project.id),
      });
    });

    return items;
  }, [team?.projects]);

  const selectedProjectLabel = useMemo(() => {
    if (!selectedProjectId) return "All Projects";
    const project = team?.projects?.find((p) => p.id === selectedProjectId);
    return project?.name || "All Projects";
  }, [selectedProjectId, team?.projects]);

  return {
    selectedProjectId,
    setSelectedProjectId,
    team,
    memberStats,
    stats,
    isMemberLoading,
    isStatsLoading,
    projectItems,
    selectedProjectLabel,
  };
};
