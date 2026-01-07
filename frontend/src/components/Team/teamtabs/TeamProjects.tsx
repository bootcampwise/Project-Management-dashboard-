import React from "react";
import { motion } from "framer-motion";
import { listContainerVariants, listItemVariants } from "../../../utils/motion";
import { Badge } from "../../ui";
import { format } from "date-fns";
import type { TeamProjectsProps } from "../../../types";

const TeamProjects: React.FC<TeamProjectsProps> = ({
  projects,
  teamMembers,
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  if (!projects || projects.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        No projects found for this team.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      <div className="grid grid-cols-[2fr_1fr_1.5fr_1fr_1fr_1.5fr] gap-4 px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
        <div>Name</div>
        <div>Status</div>
        <div>Task progress</div>
        <div>Due date</div>
        <div>Priority</div>
        <div>Members</div>
      </div>

      <motion.div
        key={projects.map((p) => p.id).join("-")}
        className="divide-y divide-gray-100 dark:divide-gray-700"
        variants={listContainerVariants}
        initial="hidden"
        animate="show"
      >
        {projects.map((project) => {
          let statusDisplay = project.status || "On track";
          if (statusDisplay === "ACTIVE") statusDisplay = "On track";
          if (statusDisplay === "ON_HOLD") statusDisplay = "On hold";
          if (statusDisplay === "COMPLETED") statusDisplay = "Completed";

          const completed = project.completedTasks || 0;
          const total = project.totalTasks || 0;
          const progress =
            total > 0 ? Math.round((completed / total) * 100) : 0;

          const priority = project.priority || "MEDIUM";

          return (
            <motion.div
              key={project.id}
              className="grid grid-cols-[2fr_1fr_1.5fr_1fr_1fr_1.5fr] gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer items-center text-sm transition-colors"
              variants={listItemVariants}
            >
              <div className="min-w-0">
                <span className="text-gray-700 dark:text-gray-200 font-medium truncate text-[15px]">
                  {project.name}
                </span>
              </div>

              <div>
                <Badge
                  variant="default"
                  className={`
                                        gap-2 px-3 py-1 rounded-full font-medium border-0
                                        ${
                                          statusDisplay === "On track"
                                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                            : statusDisplay === "At risk"
                                              ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
                                              : statusDisplay === "On hold"
                                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                                                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                        }
                                    `}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full 
                                        ${
                                          statusDisplay === "On track"
                                            ? "bg-green-600 dark:bg-green-400"
                                            : statusDisplay === "At risk"
                                              ? "bg-orange-600 dark:bg-orange-400"
                                              : statusDisplay === "On hold"
                                                ? "bg-blue-600 dark:bg-blue-400"
                                                : "bg-gray-500 dark:bg-gray-400"
                                        }
                                    `}
                  />
                  {statusDisplay}
                </Badge>
              </div>

              <div>
                <div className="flex items-center gap-3 w-full max-w-[180px]">
                  <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium min-w-[30px]">
                    {progress}%
                  </span>
                </div>
              </div>

              <div>
                <div className="text-gray-500 dark:text-gray-400 text-[13px]">
                  {formatDate(project.endDate)}
                </div>
              </div>

              <div>
                <span
                  className={`
                                    px-3 py-1 rounded text-xs font-medium
                                    ${
                                      priority === "HIGH" ||
                                      priority === "URGENT"
                                        ? "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                                        : priority === "MEDIUM"
                                          ? "bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                                          : "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                                    }
                                `}
                >
                  {priority.charAt(0) + priority.slice(1).toLowerCase()}
                </span>
              </div>

              <div>
                <div className="flex -space-x-2">
                  {(() => {
                    const membersToShow =
                      project.members && project.members.length > 0
                        ? project.members
                        : teamMembers || [];
                    return membersToShow.slice(0, 5).map((member, i) => (
                      <div
                        key={member.id || i}
                        className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 overflow-hidden relative"
                        title={member.name}
                      >
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-600 dark:text-gray-300 font-medium">
                            {member.name.charAt(0)}
                          </div>
                        )}
                      </div>
                    ));
                  })()}
                  {(() => {
                    const membersToShow =
                      project.members && project.members.length > 0
                        ? project.members
                        : teamMembers || [];
                    return (
                      membersToShow.length > 5 && (
                        <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 font-medium">
                          +{membersToShow.length - 5}
                        </div>
                      )
                    );
                  })()}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default TeamProjects;
