import { DragDropContext } from "@hello-pangea/dnd";
import React from "react";
import { Plus } from "lucide-react";
import { Dropdown } from "../ui";
import BoardColumn from "./BoardColumn";
import type { BoardViewProps, Task } from "../../types";
import { useBoardView } from "../../pages/projectboard/hooks/useBoardView";

const BoardView: React.FC<BoardViewProps> = ({
  tasks,
  onTaskClick,
  onEditTask,
  onDeleteTask,
  onAddTask,
  visibleFields,
  cardVariant,
  currentUserId,
  isTeamMember = false,
}) => {
  const {
    visibleColumns,
    hiddenColumns,

    handleDragEnd,
    handleToggleColumn,
    handleHideColumn,
    handleShowColumn,
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
            className={`h-full transition-all duration-300 ${
              col.collapsed ? "w-12 min-w-[48px]" : "flex-1 min-w-[280px]"
            }`}
          >
            <BoardColumn
              title={col.title}
              count={getTasksByStatus(col.id).length}
              color={col.color}
              tasks={getTasksByStatus(col.id)}
              status={col.id}
              collapsed={col.collapsed}
              onTaskClick={onTaskClick}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              onAddTask={onAddTask}
              onToggle={() => handleToggleColumn(col.id)}
              onHide={() => handleHideColumn(col.id)}
              visibleFields={visibleFields}
              cardVariant={cardVariant}
              currentUserId={currentUserId}
              isTeamMember={isTeamMember}
            />
          </div>
        ))}

        <div className="relative min-w-[120px] pt-1">
          <Dropdown
            trigger={
              <button className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors text-sm font-medium whitespace-nowrap">
                <Plus size={16} />
                <span>Add section</span>
              </button>
            }
            items={
              hiddenColumns.length > 0
                ? hiddenColumns.map((col) => ({
                    key: col.id,
                    label: (
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${col.color}`}
                        ></div>
                        {col.title}
                      </div>
                    ),
                    onClick: () => handleShowColumn(col.id),
                  }))
                : [
                    {
                      key: "empty",
                      custom: true,
                      label: (
                        <div className="px-4 py-2 text-sm text-gray-500">
                          All sections visible
                        </div>
                      ),
                    },
                  ]
            }
          />
        </div>
      </div>
    </DragDropContext>
  );
};

export default BoardView;
