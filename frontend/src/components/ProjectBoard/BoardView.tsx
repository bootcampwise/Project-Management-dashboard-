import React from 'react';
import { Plus } from 'lucide-react';
import BoardColumn from './BoardColumn';
import type { BoardViewProps } from '../../types';

const BoardView: React.FC<BoardViewProps> = ({ tasks, onTaskClick, onAddTask }) => {

    const columnConfig = [
        { id: 'BACKLOG', title: 'Backlog', color: 'bg-gray-400', count: 4 },
        { id: 'POSTPONE', title: 'Postpone', color: 'bg-red-400', collapsed: true, count: 6 },
        { id: 'IN_PROGRESS', title: 'In progress', color: 'bg-green-500', count: 5 },
        { id: 'QA', title: 'QA', color: 'bg-yellow-500', count: 4 },
    ];

    const getTasksByStatus = (status: string) => {
        return tasks.filter(task => task.status === status);
    };

    return (
        <div className="flex h-full w-full gap-4 pb-4 overflow-hidden">
            {columnConfig.map((col) => (
                <div
                    key={col.id}
                    className={`h-full transition-all duration-300 ${col.collapsed ? 'w-12 min-w-[48px]' : 'flex-1 min-w-0'}`}
                >
                    <BoardColumn
                        title={col.title}
                        count={getTasksByStatus(col.id).length}
                        color={col.color}
                        tasks={getTasksByStatus(col.id)}
                        status={col.id} // Pass explicit status ID
                        collapsed={col.collapsed}
                        onTaskClick={onTaskClick}
                        onAddTask={onAddTask} // Pass through directly now that BoardColumn handles the ID
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
