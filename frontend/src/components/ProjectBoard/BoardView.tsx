import { DragDropContext } from '@hello-pangea/dnd';
import React from 'react';
import { Plus } from 'lucide-react';
import BoardColumn from './BoardColumn';
import type { BoardViewProps, Task } from '../../types';
import { useBoardView } from '../../hooks/projectboard/useBoardView';

const BoardView: React.FC<BoardViewProps> = ({ tasks, onTaskClick, onAddTask }) => {
  const {
    visibleColumns,
    hiddenColumns,
    isAddSectionOpen,
    setIsAddSectionOpen,
    handleDragEnd,
    handleToggleColumn,
    handleHideColumn,
    handleShowColumn
  } = useBoardView();

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task: Task) => task.status === status);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex h-full w-full gap-4 pb-4 overflow-x-auto">
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
    </DragDropContext>
  );
};

export default BoardView;

