import React from "react";
import { motion } from "framer-motion";
import { listContainerVariants, listItemVariants } from "../../../utils/motion";
import { useTeamTableView } from "../../../pages/team/hooks/useTeamTableView";
import type { TeamTableViewProps, Team } from "../../../types";
import { Badge } from "../../ui";

const TeamTableView: React.FC<TeamTableViewProps> = ({
  filteredTeamId,
  sortBy = "newest",
}) => {
  const { allTeams, isLoading, formatDate } = useTeamTableView();

  let teamsToDisplay: Team[] = allTeams || [];

  if (filteredTeamId) {
    teamsToDisplay = teamsToDisplay.filter((t) => t.id === filteredTeamId);
  }

  teamsToDisplay = [...teamsToDisplay].sort((a, b) => {
    if (sortBy === "alpha") {
      return (a.name || "").localeCompare(b.name || "");
    }
    if (sortBy === "oldest") {
      return (
        new Date(a.createdAt || 0).getTime() -
        new Date(b.createdAt || 0).getTime()
      );
    }
    return (
      new Date(b.createdAt || 0).getTime() -
      new Date(a.createdAt || 0).getTime()
    );
  });

  if (isLoading && teamsToDisplay.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">Loading teams...</div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="grid grid-cols-[2fr_1fr_1.5fr_1fr_1fr_2fr] gap-4 px-4 py-3 text-xs font-semibold text-gray-500 border-b border-gray-200 bg-gray-50">
        <div>Name</div>
        <div>Status</div>
        <div>Task progress</div>
        <div>Due date</div>
        <div>Priority</div>
        <div>Members</div>
      </div>

      <motion.div
        className="divide-y divide-gray-100"
        variants={listContainerVariants}
        initial="hidden"
        animate="show"
      >
        {teamsToDisplay.length > 0 ? (
          teamsToDisplay.map((team) => {
            const status = team.status || "On track";
            const priority = team.priority || "Medium";
            const progress = team.progress || 0;

            return (
              <motion.div
                key={team.id}
                className="grid grid-cols-[2fr_1fr_1.5fr_1fr_1fr_2fr] gap-4 px-4 py-3 hover:bg-gray-50 cursor-pointer items-center text-sm transition-colors border-b border-gray-100 last:border-0"
                variants={listItemVariants}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-700 font-medium truncate">
                      {team.name}
                    </span>
                  </div>
                </div>
                <div>
                  <Badge
                    variant={
                      status === "On track"
                        ? "success"
                        : status === "At risk"
                          ? "warning"
                          : status === "On hold"
                            ? "primary"
                            : "default"
                    }
                    className="gap-1.5"
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        status === "On track"
                          ? "bg-green-600"
                          : status === "At risk"
                            ? "bg-orange-600"
                            : status === "On hold"
                              ? "bg-blue-600"
                              : "bg-gray-500"
                      }`}
                    />
                    {status}
                  </Badge>
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-blue-100 rounded-full overflow-hidden min-w-[60px]">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 font-normal">
                      {progress}%
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">
                    {formatDate(team.endDate)}
                  </div>
                </div>
                <div>
                  <Badge
                    variant={
                      priority === "High"
                        ? "danger"
                        : priority === "Medium"
                          ? "warning"
                          : priority === "Low"
                            ? "success"
                            : "default"
                    }
                  >
                    {priority}
                  </Badge>
                </div>
                <div>
                  <div className="flex -space-x-2">
                    {(team.members || [])
                      .slice(0, 4)
                      .map((member, i: number) => (
                        <div
                          key={i}
                          className="w-7 h-7 rounded-full border-2 border-white bg-gray-200 overflow-hidden flex items-center justify-center text-xs font-medium text-gray-600"
                          title={member.name}
                        >
                          {member.avatar ? (
                            <img
                              src={member.avatar}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            "U"
                          )}
                        </div>
                      ))}
                    {(team.members?.length || 0) > 4 && (
                      <div className="w-7 h-7 rounded-full border-2 border-white bg-gray-50 flex items-center justify-center text-[10px] font-medium text-gray-500">
                        +{(team.members?.length || 0) - 4}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="p-8 text-center text-gray-500">
            "No teams found. Create a team to get started!"
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TeamTableView;
