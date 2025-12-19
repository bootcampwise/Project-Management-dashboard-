import React from 'react';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';
import type { BoardColumnProps } from '../../types';



const BoardColumn: React.FC<BoardColumnProps> = ({ title, count, color, tasks, collapsed = false, onTaskClick, onAddTask }) => {
    if (collapsed) {
        return (
            <div className="w-12 flex flex-col items-center py-4 h-full bg-[#F3F4F6] rounded-lg">
                <div className="flex flex-col items-center gap-4 mt-2 h-full">
                    <div className={`w-2 h-2 rounded-full ${color}`}></div>
                    <span
                        className="text-gray-700 font-semibold text-sm tracking-wide whitespace-nowrap"
                        style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                    >
                        {title}
                    </span>
                    <span className="text-gray-400 font-medium text-xs mt-2">{count}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 min-w-0 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4 px-1">
                <div className={`w-2 h-2 rounded-full ${color}`}></div>
                <h2 className="font-semibold text-gray-700 whitespace-nowrap">{title}</h2>
                <span className="text-gray-400 font-medium">{count}</span>
            </div>

            {/* Task List */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {tasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        title={task.title || task.name}
                        project={typeof task.project === 'string' ? task.project : task.project?.name}
                        description={task.description}
                        priority={task.priority}
                        tags={task.tags}
                        assignee={task.assignee || { name: 'Unassigned' }}
                        comments={task.comments || 0}
                        attachments={task.attachments || 0}
                        date={task.date || task.dueDate || ''}
                        onClick={() => onTaskClick && onTaskClick(task)}
                    />
                ))}

                {/* Add Task Button at bottom of list */}
                <button
                    onClick={() => onAddTask && onAddTask(title)}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-md transition-colors mt-2 text-sm font-medium w-full text-left"
                >
                    <Plus size={16} />
                    <span>Add task</span>
                </button>
            </div>
        </div>
    );
};

export default BoardColumn;
