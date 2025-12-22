import React from 'react';
import { MessageSquare, Paperclip } from 'lucide-react';

import type { TaskCardComponentProps } from '../../types';
import { getTagColor } from '../../constants/colors';

const TaskCard: React.FC<TaskCardComponentProps> = ({ title, tags = [], assignee, assignees, comments = 0, attachments = 0, date, onClick }) => {

    // Format date to "MMM D" e.g., Sep 22
    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        const d = new Date(dateString);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div
            onClick={onClick}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer mb-3"
        >
            {/* Title */}
            <h3 className="text-gray-800 font-medium mb-2 text-sm leading-snug">{title}</h3>

            {/* Tags - Move below title */}
            {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {tags.map((tag, index) => {
                        // Use hash-based color for consistent tag coloring
                        const colors = getTagColor(tag.text);
                        return (
                            <span
                                key={index}
                                className={`px-2 py-0.5 rounded text-[11px] font-medium ${colors.bg} ${colors.text}`}
                            >
                                {tag.text}
                            </span>
                        );
                    })}
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between mt-1 flex-wrap gap-y-2">
                {/* Assignee (Avatar + Name) */}
                <div className="flex items-center gap-2 min-w-0">
                    {assignees && assignees.length > 0 ? (
                        <div className="flex items-center gap-2 min-w-0">
                            <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
                                {assignees[0].avatar ? (
                                    <img src={assignees[0].avatar} alt={assignees[0].name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-[9px] font-bold text-gray-500">
                                        {(assignees[0].name || 'U')[0]}
                                    </div>
                                )}
                            </div>
                            <span className="text-xs text-gray-500 truncate">{assignees[0].name.split(' ')[0]}</span>
                        </div>
                    ) : assignee ? (
                        <div className="flex items-center gap-2 min-w-0">
                            <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
                                {assignee.avatar ? (
                                    <img src={assignee.avatar} alt={assignee.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-[9px] font-bold text-gray-500">
                                        {(assignee.name || 'U')[0]}
                                    </div>
                                )}
                            </div>
                            <span className="text-xs text-gray-500 truncate">{assignee.name.split(' ')[0]}</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-gray-100 border border-dashed border-gray-300 flex-shrink-0"></div>
                        </div>
                    )}
                </div>

                {/* Meta (Comments, Attachments, Date) */}
                <div className="flex items-center gap-3 text-gray-400 text-xs flex-shrink-0 ml-2">
                    {(comments > 0 || attachments > 0) && (
                        <div className="flex items-center gap-2">
                            {(comments || 0) > 0 && (
                                <div className="flex items-center gap-1">
                                    <MessageSquare size={13} strokeWidth={2.5} className="text-gray-300" />
                                    <span className="text-gray-500 font-medium">{comments}</span>
                                </div>
                            )}
                            {(attachments || 0) > 0 && (
                                <div className="flex items-center gap-1">
                                    <Paperclip size={13} strokeWidth={2.5} className="text-gray-300" />
                                    <span className="text-gray-500 font-medium">{attachments}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {date && (
                        <span className="text-gray-400 font-medium text-[11px] whitespace-nowrap">{formatDate(date)}</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
