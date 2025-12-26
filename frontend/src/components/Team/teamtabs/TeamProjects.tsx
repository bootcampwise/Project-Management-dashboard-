import React from 'react';
import { Badge } from "../../ui";
import { format } from "date-fns";

// Use a local interface to avoid circular deps if needed, or import Project from types
interface Project {
    id: string;
    name: string;
    status?: string;
    priority?: string;
    progress?: number;
    startDate?: string;
    endDate?: string;
}

interface TeamProjectsProps {
    projects: Project[];
}

const TeamProjects: React.FC<TeamProjectsProps> = ({ projects }) => {

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
            <div className="grid grid-cols-[2fr_1fr_1.5fr_1fr_1fr] gap-4 px-4 py-3 text-xs font-semibold text-gray-500 border-b border-gray-200 bg-gray-50">
                <div>Name</div>
                <div>Status</div>
                <div>Progress</div>
                <div>Start Date</div>
                <div>End Date</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-gray-100">
                {projects.map((project) => {
                    const status = project.status || "ACTIVE";
                    // We removed priority from selection, so don't render it or use default
                    const progress = project.progress ? Math.round(project.progress) : 0;

                    return (
                        <div key={project.id} className="grid grid-cols-[2fr_1fr_1.5fr_1fr_1fr] gap-4 px-4 py-3 hover:bg-gray-50 cursor-pointer items-center text-sm transition-colors border-b border-gray-100 last:border-0">
                            <div className="min-w-0">
                                <div className="flex items-center gap-3">
                                    <span className="text-gray-700 font-medium truncate">
                                        {project.name}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <Badge
                                    variant={
                                        status === "ACTIVE" ? "success" :
                                            status === "ON_HOLD" ? "warning" :
                                                status === "COMPLETED" ? "primary" : "default"
                                    }
                                    className="gap-1.5"
                                >
                                    <span className={`w-1.5 h-1.5 rounded-full ${status === "ACTIVE" ? "bg-green-600" :
                                        status === "ON_HOLD" ? "bg-orange-600" :
                                            status === "COMPLETED" ? "bg-blue-600" : "bg-gray-500"
                                        }`} />
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
                                    {formatDate(project.startDate)}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">
                                    {formatDate(project.endDate)}
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
