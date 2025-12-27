import React from 'react';
import { Badge } from "../../ui";
import { format } from "date-fns";
import type { TeamProjectsProps } from "../../../types";

const TeamProjects: React.FC<TeamProjectsProps> = ({ projects, teamMembers }) => {

    const formatDate = (dateString?: string) => {
        if (!dateString) return "-";
        return format(new Date(dateString), "MMM dd, yyyy");
    };

    if (!projects || projects.length === 0) {
        return <div className="p-8 text-center text-gray-500">No projects found for this team.</div>;
    }

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Table Header */}
            <div className="grid grid-cols-[2fr_1fr_1.5fr_1fr_1fr_1.5fr] gap-4 px-6 py-4 text-xs font-semibold text-gray-500 bg-gray-50/50 border-b border-gray-100">
                <div>Name</div>
                <div>Status</div>
                <div>Task progress</div>
                <div>Due date</div>
                <div>Priority</div>
                <div>Members</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-gray-100">
                {projects.map((project) => {
                    // Normalize status for display matching the image
                    let statusDisplay = project.status || "On track";
                    // Map backend status to UI status if needed, or assume backend provides correct strings
                    // Example mapping (adjust as needed based on actual backend data):
                    if (statusDisplay === "ACTIVE") statusDisplay = "On track";
                    if (statusDisplay === "ON_HOLD") statusDisplay = "On hold";
                    if (statusDisplay === "COMPLETED") statusDisplay = "Completed";

                    const completed = project.completedTasks || 0;
                    const total = project.totalTasks || 0;
                    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

                    const priority = project.priority || "MEDIUM";

                    return (
                        <div key={project.id} className="grid grid-cols-[2fr_1fr_1.5fr_1fr_1fr_1.5fr] gap-4 px-6 py-4 hover:bg-gray-50 cursor-pointer items-center text-sm transition-colors">
                            <div className="min-w-0">
                                <span className="text-gray-700 font-medium truncate text-[15px]">
                                    {project.name}
                                </span>
                            </div>

                            {/* Status */}
                            <div>
                                <Badge
                                    variant="default"
                                    className={`
                                        gap-2 px-3 py-1 rounded-full font-medium border-0
                                        ${statusDisplay === "On track" ? "bg-green-100 text-green-700" :
                                            statusDisplay === "At risk" ? "bg-orange-100 text-orange-700" :
                                                statusDisplay === "On hold" ? "bg-blue-100 text-blue-700" :
                                                    "bg-gray-100 text-gray-700"}
                                    `}
                                >
                                    <span className={`w-1.5 h-1.5 rounded-full 
                                        ${statusDisplay === "On track" ? "bg-green-600" :
                                            statusDisplay === "At risk" ? "bg-orange-600" :
                                                statusDisplay === "On hold" ? "bg-blue-600" :
                                                    "bg-gray-500"}
                                    `} />
                                    {statusDisplay}
                                </Badge>
                            </div>

                            {/* Progress */}
                            <div>
                                <div className="flex items-center gap-3 w-full max-w-[180px]">
                                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 rounded-full"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <span className="text-xs text-gray-500 font-medium min-w-[30px]">
                                        {progress}%
                                    </span>
                                </div>
                            </div>

                            {/* Due Date */}
                            <div>
                                <div className="text-gray-500 text-[13px]">
                                    {formatDate(project.endDate)}
                                </div>
                            </div>

                            {/* Priority */}
                            <div>
                                <span className={`
                                    px-3 py-1 rounded text-xs font-medium
                                    ${priority === 'HIGH' || priority === 'URGENT' ? 'bg-red-50 text-red-600' :
                                        priority === 'MEDIUM' ? 'bg-orange-50 text-orange-600' :
                                            'bg-green-50 text-green-600'}
                                `}>
                                    {priority.charAt(0) + priority.slice(1).toLowerCase()}
                                </span>
                            </div>

                            {/* Members - prefer project.members if available, else fall back to teamMembers */}
                            <div>
                                <div className="flex -space-x-2">
                                    {/* Use project.members if they exist, otherwise fall back to team members */}
                                    {(() => {
                                        const membersToShow = (project.members && project.members.length > 0)
                                            ? project.members
                                            : (teamMembers || []);
                                        return membersToShow.slice(0, 5).map((member, i) => (
                                            <div
                                                key={member.id || i}
                                                className="w-8 h-8 rounded-full border-2 border-white overflow-hidden relative"
                                                title={member.name}
                                            >
                                                {member.avatar ? (
                                                    <img
                                                        src={member.avatar}
                                                        alt={member.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 font-medium">
                                                        {member.name.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                        ));
                                    })()}
                                    {(() => {
                                        const membersToShow = (project.members && project.members.length > 0)
                                            ? project.members
                                            : (teamMembers || []);
                                        return membersToShow.length > 5 && (
                                            <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-medium">
                                                +{membersToShow.length - 5}
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TeamProjects;
