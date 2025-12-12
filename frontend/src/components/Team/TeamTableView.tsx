import React from 'react';

interface TeamProject {
    id: string;
    name: string;
    status: 'On track' | 'At risk' | 'On hold';
    taskProgress: number;
    dueDate: string;
    priority: 'High' | 'Medium' | 'Low';
    members: { name: string; avatar?: string }[];
}

const TeamTableView: React.FC = () => {
    // Mock data matching the image
    const projects: TeamProject[] = [
        {
            id: '1',
            name: 'Development',
            status: 'On track',
            taskProgress: 80,
            dueDate: 'Mar 1, 2025',
            priority: 'High',
            members: [
                { name: 'John Doe' },
                { name: 'Jane Smith' },
                { name: 'Mike Johnson' }
            ]
        },
        {
            id: '2',
            name: 'Directions',
            status: 'At risk',
            taskProgress: 40,
            dueDate: 'Nov 20, 2025',
            priority: 'Medium',
            members: [
                { name: 'Sarah Williams' },
                { name: 'Tom Brown' },
                { name: 'Emily Davis' },
                { name: 'Chris Wilson' }
            ]
        },
        {
            id: '3',
            name: 'Product calendar',
            status: 'At risk',
            taskProgress: 40,
            dueDate: 'Nov 20, 2025',
            priority: 'High',
            members: [
                { name: 'Alex Lee' },
                { name: 'Maria Garcia' },
                { name: 'David Martinez' }
            ]
        },
        {
            id: '4',
            name: 'Design references',
            status: 'On track',
            taskProgress: 70,
            dueDate: 'Nov 20, 2025',
            priority: 'Low',
            members: [
                { name: 'Lisa Anderson' },
                { name: 'James Taylor' }
            ]
        },
        {
            id: '5',
            name: 'QA and review',
            status: 'On hold',
            taskProgress: 70,
            dueDate: 'Sep 20, 2024',
            priority: 'Low',
            members: [
                { name: 'Robert Miller' },
                { name: 'Jennifer Moore' },
                { name: 'Michael Davis' },
                { name: 'Amanda White' }
            ]
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'On track':
                return { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' };
            case 'At risk':
                return { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500' };
            case 'On hold':
                return { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' };
            default:
                return { bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-500' };
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'High':
                return { bg: 'bg-red-50', text: 'text-red-700' };
            case 'Medium':
                return { bg: 'bg-yellow-50', text: 'text-yellow-700' };
            case 'Low':
                return { bg: 'bg-green-50', text: 'text-green-700' };
            default:
                return { bg: 'bg-gray-50', text: 'text-gray-700' };
        }
    };

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
                {projects.map((project) => {
                    const statusColor = getStatusColor(project.status);
                    const priorityColor = getPriorityColor(project.priority);

                    return (
                        <div
                            key={project.id}
                            className="grid grid-cols-[2fr_1fr_1.5fr_1fr_1fr_2fr] gap-4 px-4 py-4 hover:bg-gray-50 cursor-pointer items-center text-sm transition-colors"
                        >
                            {/* Name */}
                            <div className="font-medium text-gray-800 truncate">
                                {project.name}
                            </div>

                            {/* Status */}
                            <div>
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusColor.bg} ${statusColor.text}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${statusColor.dot}`}></span>
                                    {project.status}
                                </span>
                            </div>

                            {/* Task Progress */}
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 rounded-full transition-all"
                                        style={{ width: `${project.taskProgress}%` }}
                                    ></div>
                                </div>
                                <span className="text-xs text-gray-600 font-medium min-w-[32px]">
                                    {project.taskProgress}%
                                </span>
                            </div>

                            {/* Due Date */}
                            <div className="text-gray-600 text-xs">
                                {project.dueDate}
                            </div>

                            {/* Priority */}
                            <div>
                                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${priorityColor.bg} ${priorityColor.text}`}>
                                    {project.priority}
                                </span>
                            </div>

                            {/* Members */}
                            <div className="flex items-center -space-x-2">
                                {project.members.slice(0, 3).map((member, idx) => (
                                    <div
                                        key={idx}
                                        className="w-7 h-7 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600"
                                        title={member.name}
                                    >
                                        {member.avatar ? (
                                            <img
                                                src={member.avatar}
                                                alt={member.name}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            member.name.charAt(0)
                                        )}
                                    </div>
                                ))}
                                {project.members.length > 3 && (
                                    <div className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-500">
                                        +{project.members.length - 3}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TeamTableView;
