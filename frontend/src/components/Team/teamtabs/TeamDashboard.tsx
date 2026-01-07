import React from "react";
import { ChevronDown } from "lucide-react";
import TeamOverviewChart from "./TeamOverviewChart";
import TopCompletedTasks from "./TopCompletedTasks";
import TimelineView from "../../projectBoard/TimelineView";
import TopEarning from "./TopEarning";
import { StatCard, Dropdown } from "../../ui";
import type { DropdownItem, TeamDashboardProps } from "../../../types";
import { useTeamDashboard } from "../../../pages/team/hooks/useTeamDashboard";

const TeamDashboard: React.FC<TeamDashboardProps> = ({ teamId }) => {
  const {
    selectedProjectId,
    setSelectedProjectId,
    team,
    memberStats,
    stats,
    isMemberLoading,
    isStatsLoading,
    selectedProjectLabel,
  } = useTeamDashboard(teamId);

  const dropdownItems: DropdownItem[] = React.useMemo(() => {
    const items: DropdownItem[] = [
      {
        key: "all",
        label: "All projects",
        onClick: () => setSelectedProjectId(""),
        className: !selectedProjectId
          ? "text-blue-600 font-medium bg-blue-50 dark:bg-blue-900/20"
          : "",
      },
    ];

    if (team?.projects) {
      team.projects.forEach((project) => {
        items.push({
          key: project.id,
          label: project.name,
          onClick: () => setSelectedProjectId(project.id),
          className:
            selectedProjectId === project.id
              ? "text-blue-600 font-medium bg-blue-50 dark:bg-blue-900/20"
              : "",
        });
      });
    }

    return items;
  }, [team?.projects, selectedProjectId, setSelectedProjectId]);

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-normal text-gray-600 dark:text-gray-400">
          Teamspace overview
        </h2>

        <Dropdown
          trigger={
            <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-md text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <span>{selectedProjectLabel}</span>
              <ChevronDown size={16} />
            </div>
          }
          items={dropdownItems}
          align="right"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Completed tasks"
          value={isStatsLoading ? "..." : (stats?.completedTasks ?? 0)}
          trend="positive"
          trendText="67.18%"
        />
        <StatCard
          title="Incompleted tasks"
          value={isStatsLoading ? "..." : (stats?.incompletedTasks ?? 0)}
          trend="negative"
          trendText="54.29%"
        />
        <StatCard
          title="Overdue tasks"
          value={isStatsLoading ? "..." : (stats?.overdueTasks ?? 0)}
          trendText="14.11%"
        />
        <StatCard
          title="Total income"
          value={
            isStatsLoading
              ? "..."
              : `$${(stats?.totalIncome ?? 0).toLocaleString()}`
          }
          trend="positive"
          trendText="21.18%"
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <TeamOverviewChart teamId={teamId} />
        <TopCompletedTasks
          members={memberStats || []}
          isLoading={isMemberLoading}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:flex-1 h-[320px]">
          <TimelineView projectIds={team?.projects?.map((p) => p.id)} />
        </div>
        <div className="w-full lg:w-[315px] h-[320px]">
          <TopEarning teamId={teamId} />
        </div>
      </div>
    </div>
  );
};

export default TeamDashboard;
