import React from "react";
import { Plus, MoreHorizontal, EyeOff } from "lucide-react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import type { BoardColumnProps } from "../../types";
import TaskCard from "../task/TaskCard";
import { useBoardColumn } from "../../pages/projectboard/hooks/useBoardColumn";

const BoardColumn: React.FC<BoardColumnProps> = ({
  title,
  count,
  color,
  tasks,
  status,
  collapsed = false,
  onTaskClick,
  onEditTask,
  onDeleteTask,
  onAddTask,
  onToggle,
  onHide,
  visibleFields,
  cardVariant,
  currentUserId,
  isTeamMember = false,
}) => {
  const { isMenuOpen, setIsMenuOpen } = useBoardColumn();

  if (collapsed) {
    return (
      <div
        className="w-12 flex flex-col items-center py-4 h-full bg-gray-100 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        onClick={onToggle}
        title="Click to expand"
      >
        <div className="flex flex-col items-center gap-4 mt-2 h-full">
          <div className={`w-2 h-2 rounded-full ${color}`}></div>
          <span
            className="text-gray-700 dark:text-gray-300 font-semibold text-sm tracking-wide whitespace-nowrap"
            style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
          >
            {title}
          </span>
          <span className="text-gray-400 dark:text-gray-500 font-medium text-xs mt-2">
            {count}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-w-0 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 px-1 group">
        <div
          className="flex items-center gap-2 cursor-pointer flex-1"
          onClick={onToggle}
        >
          <div className={`w-2 h-2 rounded-full ${color}`}></div>
          <h2 className="font-semibold text-gray-700 dark:text-gray-200 whitespace-nowrap">
            {title}
          </h2>
          <span className="text-gray-400 dark:text-gray-500 font-medium">
            {count}
          </span>
        </div>

        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-all"
          >
            <MoreHorizontal size={16} />
          </button>

          {isMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsMenuOpen(false)}
              />
              <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 py-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                    onHide && onHide();
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center gap-2"
                >
                  <EyeOff size={14} />
                  <span>Hide section</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <Droppable droppableId={status || title} isDropDisabled={!isTeamMember}>
        {(provided) => (
          <div
            className="flex-1 overflow-y-auto pr-2 custom-scrollbar"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.map((task, index) => (
              <Draggable
                key={task.id}
                draggableId={String(task.id)}
                index={index}
                isDragDisabled={!isTeamMember}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...provided.draggableProps.style,
                      marginBottom: "0.75rem",
                    }}
                  >
                    <TaskCard
                      title={task.title || task.name}
                      project={
                        typeof task.project === "string"
                          ? task.project
                          : task.project?.name
                      }
                      description={task.description}
                      priority={task.priority}
                      tags={task.tags}
                      assignee={task.assignee || { name: "Unassigned" }}
                      assignees={task.assignees?.map((a) => ({
                        name: a.name,
                        avatar: a.avatar || undefined,
                      }))}
                      comments={
                        typeof task.comments === "number"
                          ? task.comments
                          : Array.isArray(task.comments)
                            ? task.comments.length
                            : 0
                      }
                      attachments={
                        typeof task.attachments === "number"
                          ? task.attachments
                          : Array.isArray(task.attachments)
                            ? task.attachments.length
                            : 0
                      }
                      subtasks={
                        Array.isArray(task.subtasks)
                          ? task.subtasks.length
                          : typeof task.subtasks === "number"
                            ? task.subtasks
                            : 0
                      }
                      completedSubtasks={
                        Array.isArray(task.subtasks)
                          ? task.subtasks.filter((st) => st.completed).length
                          : 0
                      }
                      date={task.date || task.dueDate || ""}
                      onClick={() => onTaskClick && onTaskClick(task)}
                      onEdit={() => onEditTask && onEditTask(task)}
                      onDelete={() => onDeleteTask && onDeleteTask(task)}
                      visibleFields={visibleFields}
                      variant={cardVariant}
                      isTaskCreator={
                        currentUserId
                          ? task.creator?.id === currentUserId
                          : false
                      }
                      isTeamMember={isTeamMember}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}

            {isTeamMember && (
              <button
                onClick={() => onAddTask && onAddTask(status || title)}
                className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-md transition-colors mt-2 text-sm font-medium w-full text-left"
              >
                <Plus size={16} />
                <span>Add task</span>
              </button>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default BoardColumn;
