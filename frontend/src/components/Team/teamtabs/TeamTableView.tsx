import React from 'react';
import { useTeamTableView } from '../../../hooks/teams/useTeamTableView';
import type { TeamTableViewProps, Project } from '../../../types';


const TeamTableView: React.FC<TeamTableViewProps> = ({ projectId }) => {
  const {
    projects,
    isLoading,
    activeProject,
    filteredProjects,
    getStatusColor,
    getPriorityColor,
    formatDate,
    navigate
  } = useTeamTableView(projectId);

  if (isLoading && filteredProjects.length === 0) {
    return <div className="p-8 text-center text-gray-500">Loading projects...</div>;
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Table Header */}
      <div className="grid grid-cols-[2fr_1fr_1.5fr_1fr_1fr_2fr] gap-4 px-4 py-3 text-xs font-semibold text-gray-500 border-b border-gray-200 bg-gray-50">
        <div>Name</div>
        <div>Status</div>
        <div>Task progress</div>
        <div>Due date</div>
        <div>Priority</div>
        <div>Members</div>
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-gray-100">
        {projectId && activeProject ? (
          // Show teams for the active project
          // Show teams for the active project
          // Show teams for the active project
          (activeProject.teams || []).map((team: NonNullable<Project['teams']>[number]) => {
            const status = team.status || "On track";
            const priority = team.priority || "Medium";
            const progress = team.progress || 0;

            return (
              <div key={team.id} className="grid grid-cols-[2fr_1fr_1.5fr_1fr_1fr_2fr] gap-4 px-4 py-3 hover:bg-gray-50 cursor-pointer items-center text-sm transition-colors border-b border-gray-100 last:border-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-700 font-medium truncate">
                      {team.name}
                    </span>
                  </div>
                </div>
                <div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status === "On track"
                      ? "bg-green-100 text-green-800"
                      : status === "At risk"
                        ? "bg-orange-100 text-orange-800"
                        : status === "On hold"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${status === "On track"
                      ? "bg-green-600"
                      : status === "At risk"
                        ? "bg-orange-600"
                        : status === "On hold"
                          ? "bg-blue-600"
                          : "bg-gray-500"
                      }`}></span>
                    {status}
                  </span>
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
                    {formatDate(team.endDate || activeProject.endDate)}
                  </div>
                </div>
                <div>
                  <span
                    className={`px-2.5 py-0.5 rounded text-xs font-medium ${priority === "High"
                      ? "bg-red-100 text-red-800"
                      : priority === "Medium"
                        ? "bg-orange-100 text-orange-800"
                        : priority === "Low"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                  >
                    {priority}
                  </span>
                </div>
                <div>
                  <div className="flex -space-x-2">
                    {(team.members || []).slice(0, 4).map((member: { id: string; name: string; avatar?: string }, i: number) => (
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
              </div>
            );
          })
        ) : (
          filteredProjects.map((project) => {
            const statusColor = getStatusColor(project.status);
            const priorityColor = getPriorityColor(project.priority);
            const progress = project.progress || 0;

            return (
              <div
                key={project.id}
                onClick={() => navigate(`/project/${project.id}`)}
                className="grid grid-cols-[2fr_1fr_1.5fr_1fr_1fr_2fr] gap-4 px-4 py-4 hover:bg-gray-50 cursor-pointer items-center text-sm transition-colors"
              >
                {/* Name */}
                <div className="min-w-0">
                  <div className="font-medium text-gray-800 truncate">
                    {project.name}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusColor.bg} ${statusColor.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusColor.dot}`}></span>
                    {project.status || 'Active'}
                  </span>
                </div>

                {/* Task Progress */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 font-medium min-w-[32px]">
                    {progress}%
                  </span>
                </div>

                {/* Due Date */}
                <div className="text-gray-600 text-xs">
                  {formatDate(project.endDate)}
                </div>

                {/* Priority */}
                <div>
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${priorityColor.bg} ${priorityColor.text}`}>
                    {project.priority || 'Medium'}
                  </span>
                </div>

                {/* Members */}
                <div className="flex items-center -space-x-2">
                  {/* Direct Members */}
                  {(project.members || []).slice(0, 5).map((member, idx) => (
                    <div
                      key={`m-${idx}`}
                      className="w-7 h-7 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600 relative group"
                      title={member.name}
                    >
                      {member.avatar ? (
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        member.name.charAt(0).toUpperCase()
                      )}
                    </div>
                  ))}

                  {/* Team Members (via Teams) */}
                  {(project.teams || []).flatMap(team => team.members || []).map((member, idx) => (
                    <div
                      key={`tm-${idx}`}
                      className="w-7 h-7 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600 relative group"
                      title="Team Member"
                    >
                      {member.avatar ? (
                        <img
                          src={member.avatar}
                          alt="Member"
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-[10px]">TM</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
        {projects.length === 0 && !isLoading && !projectId && (
          <div className="p-8 text-center text-gray-500">No projects found. Create one to get started!</div>
        )}

        {/* Empty State for Specific Project's Teams */}
        {projectId && activeProject && (!activeProject.teams || activeProject.teams.length === 0) && (
          <div className="p-8 text-center text-gray-500">No teams found for this project. Create a team to get started!</div>
        )}
      </div>
    </div>
  );
};

export default TeamTableView;
