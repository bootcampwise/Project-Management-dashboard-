import React from 'react';
import { MessageSquare, Paperclip } from 'lucide-react';

interface TaskCardProps {
    title: string;
    tags?: { text: string; color: string; bg: string }[];
    assignee: { name: string; avatar?: string };
    comments: number;
    attachments: number;
    date: string;
    onClick?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ title, tags = [], assignee, comments, attachments, date, onClick }) => {
    // Generate initials if no avatar
    const initials = assignee.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <div
            onClick={onClick}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer mb-3"
        >
            <h3 className="text-gray-800 font-medium mb-3 text-sm leading-snug">{title}</h3>

            {/* Tags */}
            {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {tags.map((tag, index) => (
                        <span
                            key={index}
                            className={`px-2 py-0.5 rounded text-xs font-medium ${tag.bg} ${tag.color}`}
                        >
                            {tag.text}
                        </span>
                    ))}
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between mt-2 pt-2">
                <div className="flex items-center gap-2">
                    {assignee.avatar ? (
                        <img
                            src={assignee.avatar}
                            alt={assignee.name}
                            className="w-6 h-6 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                            {initials}
                        </div>
                    )}
                    <span className="text-xs text-gray-500">{assignee.name}</span>
                </div>

                <div className="flex items-center gap-3 text-gray-400 text-xs">
                    {(comments > 0 || attachments > 0) && (
                        <div className="flex items-center gap-3">
                            {comments > 0 && (
                                <div className="flex items-center gap-1">
                                    <MessageSquare size={14} />
                                    <span>{comments}</span>
                                </div>
                            )}
                            {attachments > 0 && (
                                <div className="flex items-center gap-1">
                                    <Paperclip size={14} />
                                    <span>{attachments}</span>
                                </div>
                            )}
                        </div>
                    )}
                    <div className="flex items-center gap-1">
                        {/* <Calendar size={14} /> */}
                        <span>{date}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
