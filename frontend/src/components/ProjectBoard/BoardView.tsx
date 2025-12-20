import React from 'react';
import { Plus } from 'lucide-react';
import BoardColumn from './BoardColumn';
import type { BoardViewProps } from '../../types';

const BoardView: React.FC<BoardViewProps> = ({ tasks, onTaskClick, onAddTask }) => {

    // Initial column configuration with visibility state
    const [columns, setColumns] = React.useState([
        { id: 'BACKLOG', title: 'Backlog', color: 'bg-gray-400', collapsed: false, isVisible: true },
        { id: 'TODO', title: 'Todo', color: 'bg-blue-500', collapsed: false, isVisible: false },
        { id: 'IN_PROGRESS', title: 'In progress', color: 'bg-green-500', collapsed: false, isVisible: true },
        { id: 'IN_REVIEW', title: 'In Review', color: 'bg-purple-500', collapsed: false, isVisible: false },
        { id: 'QA', title: 'QA', color: 'bg-yellow-500', collapsed: false, isVisible: true },
        { id: 'COMPLETED', title: 'Completed', color: 'bg-indigo-500', collapsed: false, isVisible: false },
        { id: 'POSTPONE', title: 'Postpone', color: 'bg-red-400', collapsed: true, isVisible: true },
        { id: 'CANCELED', title: 'Canceled', color: 'bg-gray-500', collapsed: false, isVisible: false },
    ]);

    const [isAddSectionOpen, setIsAddSectionOpen] = React.useState(false);

    const getTasksByStatus = (status: string) => {
        return tasks.filter(task => task.status === status);
    };

    const handleToggleColumn = (columnId: string) => {
        setColumns(prev => prev.map(col =>
            col.id === columnId ? { ...col, collapsed: !col.collapsed } : col
        ));
    };

    const handleHideColumn = (columnId: string) => {
        setColumns(prev => prev.map(col =>
            col.id === columnId ? { ...col, isVisible: false } : col
        ));
    };

    const handleShowColumn = (columnId: string) => {
        setColumns(prev => prev.map(col =>
            col.id === columnId ? { ...col, isVisible: true } : col
        ));
        setIsAddSectionOpen(false);
    };

    const visibleColumns = columns.filter(col => col.isVisible);
    const hiddenColumns = columns.filter(col => !col.isVisible);

    return (
        <div className="flex h-full w-full gap-4 pb-4 overflow-hidden">
            {visibleColumns.map((col) => (
                <div
                    key={col.id}
                    className={`h-full transition-all duration-300 ${col.collapsed ? 'w-12 min-w-[48px]' : 'flex-1 min-w-0'}`}
                >
                    <BoardColumn
                        title={col.title}
                        count={getTasksByStatus(col.id).length}
                        color={col.color}
                        tasks={getTasksByStatus(col.id)}
                        status={col.id}
                        collapsed={col.collapsed}
                        onTaskClick={onTaskClick}
                        onAddTask={onAddTask}
                        onToggle={() => handleToggleColumn(col.id)}
                        onHide={() => handleHideColumn(col.id)}
                    />
                </div>
            ))}

            {/* Add Section Button & Dropdown */}
            <div className="relative min-w-[120px] pt-1">
                <button
                    onClick={() => setIsAddSectionOpen(!isAddSectionOpen)}
                    className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors text-sm font-medium whitespace-nowrap"
                >
                    <Plus size={16} />
                    <span>Add section</span>
                </button>

                {/* Dropdown Menu */}
                {isAddSectionOpen && hiddenColumns.length > 0 && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsAddSectionOpen(false)}
                        />
                        <div className="absolute left-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20 py-1">
                            {hiddenColumns.map(col => (
                                <button
                                    key={col.id}
                                    onClick={() => handleShowColumn(col.id)}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <div className={`w-2 h-2 rounded-full ${col.color}`}></div>
                                    {col.title}
                                </button>
                            ))}
                        </div>
                    </>
                )}

                {isAddSectionOpen && hiddenColumns.length === 0 && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsAddSectionOpen(false)}
                        />
                        <div className="absolute left-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20 py-2 px-4 text-sm text-gray-500">
                            All sections visible
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default BoardView;
