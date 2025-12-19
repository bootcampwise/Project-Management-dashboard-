import React from 'react';
import { MessageSquare, Paperclip } from 'lucide-react';

import type { TaskCardComponentProps } from '../../types';

const TaskCard: React.FC<TaskCardComponentProps> = ({ title, project, description, priority, tags = [], assignee, assignees, comments = 0, attachments = 0, date, onClick }) => {
    // Generate initials for single assignee if needed (legacy or fallback)
    const initials = assignee?.name
        ?.split(' ')
        ?.map((n) => n[0])
        ?.join('')
        ?.toUpperCase()
        ?.slice(0, 2) || '?';

    return (
        <div
            onClick={onClick}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer mb-3"
        >
            {project && (
                <div className="text-xs font-semibold text-blue-600 mb-1">
                    {project}
                </div>
            )}
            <h3 className="text-gray-800 font-medium mb-1 text-sm leading-snug">{title}</h3>
            {description && (
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{description}</p>
            )}


            {/* Tags */}
            {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {tags.map((tag, index) => {
                        // Helper function to get proper Tailwind classes
                        const getTagClasses = (color?: string) => {
                            const colorMap: Record<string, string> = {
                                'blue': 'bg-blue-100 text-blue-600',
                                'green': 'bg-green-100 text-green-600',
                                'red': 'bg-red-100 text-red-600',
                                'yellow': 'bg-yellow-100 text-yellow-600',
                                'purple': 'bg-purple-100 text-purple-600',
                                'pink': 'bg-pink-100 text-pink-600',
                                'gray': 'bg-gray-100 text-gray-600',
                                'orange': 'bg-orange-100 text-orange-600',
                            };
                            return colorMap[color || 'blue'] || 'bg-blue-100 text-blue-600';
                        };

                        return (
                            <span
                                key={index}
                                className={`px-2 py-0.5 rounded text-xs font-medium ${getTagClasses(tag.color)}`}
                            >
                                {tag.text}
                            </span>
                        );
                    })}
                </div>
            )}


            {/* Footer */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                <div className="flex items-center gap-2">
                    <div className="flex -space-x-1.5 overflow-hidden">
                        {assignees && assignees.length > 0 ? (
                            assignees.map((a: { name: string; avatar?: string }, i: number) => (
                                <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600 overflow-hidden" title={a.name}>
                                    {a.avatar ? (
                                        <img
                                            src={a.avatar}
                                            alt={a.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        (a.name || 'U').charAt(0).toUpperCase()
                                    )}
                                </div>
                            ))
                        ) : assignee ? ( // Fallback for legacy single assignee
                            <div className="w-6 h-6 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600 overflow-hidden" title={assignee.name}>
                                {assignee.avatar ? (
                                    <img
                                        src={assignee.avatar}
                                        alt={assignee.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    (assignee.name || 'U').charAt(0).toUpperCase()
                                )}
                            </div>
                        ) : (
                            <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400">
                                ?
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {priority && (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium 
                        ${priority === 'HIGH' || priority === 'URGENT' ? 'bg-red-50 text-red-600' :
                                priority === 'MEDIUM' ? 'bg-amber-50 text-amber-600' :
                                    'bg-green-50 text-green-600'}`}>
                            {priority.charAt(0) + priority.slice(1).toLowerCase().replace('_', ' ')}
                        </span>
                    )}

                    <div className="flex items-center gap-3 text-gray-400 text-xs">
                        {(comments > 0 || attachments > 0) && (
                            <div className="flex items-center gap-3 text-gray-500 text-xs font-medium">
                                {(comments || 0) > 0 && (
                                    <div className="flex items-center gap-1">
                                        <MessageSquare size={14} className="text-gray-400" />
                                        <span>{comments}</span>
                                    </div>
                                )}
                                {(attachments || 0) > 0 && (
                                    <div className="flex items-center gap-1">
                                        <Paperclip size={14} className="text-gray-400" />
                                        <span>{attachments}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-1 min-w-[60px]">
                            <span className="text-[10px]">{date}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
