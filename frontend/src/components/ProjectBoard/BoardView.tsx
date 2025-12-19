import React from 'react';
import { Plus } from 'lucide-react';
import BoardColumn from './BoardColumn';
import type { BoardViewProps } from '../../types';

const BoardView: React.FC<BoardViewProps> = ({ tasks, onTaskClick, onAddTask }) => {

    const columnConfig = [
        { id: 'TODO', title: 'To Do', color: 'bg-blue-500' },
        { id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-yellow-500' },
        { id: 'COMPLETED', title: 'Completed', color: 'bg-green-500' },
        { id: 'CANCELED', title: 'Cancelled', color: 'bg-red-500' },
        { id: 'BACKLOG', title: 'Backlog', color: 'bg-gray-500' },
    ];

    const getTasksByStatus = (status: string) => {
        return tasks.filter(task => task.status === status);
    };

    return (
        <div className="flex h-full w-full gap-4 pb-4 overflow-hidden overflow-x-auto">
            {columnConfig.map((col) => (
                <div key={col.id} className="min-w-[300px] h-full">
                    <BoardColumn
                        title={col.title}
                        count={getTasksByStatus(col.id).length}
                        color={col.color}
                        tasks={getTasksByStatus(col.id)}
                        onTaskClick={onTaskClick}
                        onAddTask={() => onAddTask && onAddTask(col.id)}
                    />
                </div>
            ))}

            {/* Add Section Button */}
            <div className="min-w-[120px] pt-1">
                <button className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors text-sm font-medium whitespace-nowrap">
                    <Plus size={16} />
                    <span>Add section</span>
                </button>
            </div>
        </div>
    );
};

export default BoardView;
