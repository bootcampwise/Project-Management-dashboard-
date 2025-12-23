import React from 'react';
import { MessageSquare, Paperclip, Flag, ListTodo } from 'lucide-react';

import type { TaskCardComponentProps } from '../../types';

const TaskCard: React.FC<TaskCardComponentProps> = ({
    title,
    project,
    description,
    priority,
    assignee,
    assignees,
    comments = 0,
    attachments = 0,
    subtasks = 0,
    date,
    onClick
}) => {

    // Format date to "MMM D, YYYY" or similar compact format
    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        const d = new Date(dateString);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getPriorityColor = (p?: string) => {
        const priorityUpper = p?.toUpperCase();
        switch (priorityUpper) {
            case 'URGENT':
            case 'HIGH':
                return 'bg-red-50 text-red-600';
            case 'MEDIUM':
                return 'bg-amber-50 text-amber-600';
            case 'LOW':
                return 'bg-green-50 text-green-600';
            default:
                return 'bg-gray-50 text-gray-500';
        }
    };

    const displayAssignees = assignees && assignees.length > 0 ? assignees : (assignee ? [assignee] : []);

    return (
        <div
            onClick={onClick}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group"
        >
            {/* Project Name */}
            {project && (
                <div className="mb-1">
                    <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-semibold rounded uppercase tracking-wide">
                        {project}
                    </span>
                </div>
            )}

            {/* Title */}
            <h3 className="text-gray-900 font-bold mb-1 text-[15px] leading-snug group-hover:text-blue-600 transition-colors">
                {title}
            </h3>

            {/* Description */}
            {description && (
                <p className="text-gray-500 text-xs mb-4 line-clamp-2 leading-relaxed">
                    {description}
                </p>
            )}

            {/* Assignees */}
            <div className="mb-4">
                <div className="flex items-center">
                    <span className="text-xs text-gray-400 mr-2 font-medium">Assignee:</span>
                    <div className="flex -space-x-2">
                        {displayAssignees.length > 0 ? (
                            displayAssignees.slice(0, 3).map((a, i) => (
                                <div
                                    key={i}
                                    className="w-6 h-6 rounded-full border-2 border-white overflow-hidden bg-gray-100 flex items-center justify-center text-[9px] font-bold text-gray-500"
                                    title={a.name}
                                >
                                    {a.avatar ? (
                                        <img src={a.avatar} alt={a.name} className="w-full h-full object-cover" />
                                    ) : (
                                        (a.name || 'U')[0].toUpperCase()
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="w-6 h-6 rounded-full border-2 border-white border-dashed bg-gray-50 flex items-center justify-center">
                                <span className="text-gray-300 text-[10px]">?</span>
                            </div>
                        )}
                        {displayAssignees.length > 3 && (
                            <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[9px] font-medium text-gray-500">
                                +{displayAssignees.length - 3}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Date and Priority Row */}
            <div className="flex items-center justify-between mb-4">
                {/* Date */}
                <div className="flex items-center gap-1.5 text-gray-400">
                    <Flag size={14} className="stroke-current" />
                    <span className="text-xs font-medium">
                        {date ? formatDate(date) : 'No date'}
                    </span>
                </div>

                {/* Priority Badge */}
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${getPriorityColor(priority)}`}>
                    {priority || 'Medium'}
                </span>
            </div>

            {/* Footer Stats */}
            <div className="flex items-center gap-4 border-t border-gray-50 pt-3">
                {/* Subtasks */}
                <div className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                    <ListTodo size={14} />
                    <span className="text-xs font-medium">{subtasks}</span>
                </div>

                {/* Comments */}
                <div className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                    <MessageSquare size={14} />
                    <span className="text-xs font-medium">{comments}</span>
                </div>

                {/* Attachments */}
                <div className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                    <Paperclip size={14} />
                    <span className="text-xs font-medium">{attachments}</span>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
