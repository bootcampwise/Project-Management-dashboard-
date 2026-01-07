import React from "react";
import {
  ChevronRight,
  ChevronDown,
  Plus,
  MoreHorizontal,
  CheckCircle2,
  MessageSquare,
  Paperclip,
  User,
} from "lucide-react";
import type { ExtendedTableViewProps } from "../../types";
import { useTableView } from "../../pages/projectboard/hooks/useTableView";

const TableView: React.FC<ExtendedTableViewProps> = ({
  onTaskClick,
  tasks,
  visibleFields = { assignee: true, dueDate: true, label: true },
  onAddTask,
}) => {
  const { groups, toggleGroup } = useTableView(tasks);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 font-sans text-sm">
      {groups.map((group) => (
        <div key={group.id} className="mb-8">
          <div className="flex items-center gap-2 mb-2 px-2 group/header">
            <button
              onClick={() => toggleGroup(group.id)}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none transition-colors"
            >
              {group.isCollapsed ? (
                <ChevronRight size={14} />
              ) : (
                <ChevronDown size={14} />
              )}
            </button>
            <div
              className={`w-2.5 h-2.5 rounded-full bg-${group.color}-500 shadow-sm`}
            ></div>
            <h3 className="text-[15px] font-semibold text-gray-800 dark:text-white">
              {group.title}
            </h3>
            <span className="text-gray-400 dark:text-gray-500 font-normal ml-1">
              {group.count}
            </span>

            <div className="flex items-center gap-1 ml-2 opacity-0 group-hover/header:opacity-100 transition-opacity">
              <button className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <Plus size={14} />
              </button>
            </div>
          </div>

          {!group.isCollapsed && (
            <div>
              <div
                className={`grid gap-0 border-y border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 font-normal bg-white dark:bg-gray-800 sticky top-0 z-10`}
                style={{
                  gridTemplateColumns: `1fr ${visibleFields.assignee ? "180px " : ""}${visibleFields.dueDate ? "100px " : ""}${visibleFields.label ? "180px " : ""}40px`,
                }}
              >
                <div className="px-4 py-2 border-r border-gray-100 dark:border-gray-700">
                  Name
                </div>
                {visibleFields.assignee && (
                  <div className="px-4 py-2 border-r border-gray-100 dark:border-gray-700">
                    Assignee
                  </div>
                )}
                {visibleFields.dueDate && (
                  <div className="px-4 py-2 border-r border-gray-100 dark:border-gray-700">
                    Due date
                  </div>
                )}
                {visibleFields.label && (
                  <div className="px-4 py-2 border-r border-gray-100 dark:border-gray-700">
                    Label
                  </div>
                )}
                <div className="py-2"></div>
              </div>

              <div className="">
                {group.tasks.length > 0 ? (
                  group.tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`grid gap-0 hover:bg-gray-50 dark:hover:bg-gray-800 group/row text-[13px] cursor-pointer items-center border-b border-gray-100 dark:border-gray-700 transition-colors h-10`}
                      style={{
                        gridTemplateColumns: `1fr ${visibleFields.assignee ? "180px " : ""}${visibleFields.dueDate ? "100px " : ""}${visibleFields.label ? "180px " : ""}40px`,
                      }}
                      onClick={() => onTaskClick && onTaskClick(task)}
                    >
                      <div className="flex items-center gap-3 px-4 h-full border-r border-gray-100 dark:border-gray-700 overflow-hidden">
                        <button
                          className="text-gray-300 dark:text-gray-600 hover:text-blue-500 transition-colors flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <CheckCircle2 size={16} strokeWidth={1.5} />
                        </button>
                        <span className="text-gray-800 dark:text-gray-200 truncate font-normal">
                          {task.name}
                        </span>

                        <div className="flex items-center gap-3 text-gray-400 dark:text-gray-500 shrink-0 ml-1">
                          {task.comments ? (
                            <span className="flex items-center gap-1 text-xs hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                              {task.comments} <MessageSquare size={12} />
                            </span>
                          ) : null}
                          {task.attachments ? (
                            <span className="flex items-center gap-1 text-xs hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                              <Paperclip size={12} />
                            </span>
                          ) : null}
                        </div>
                      </div>

                      {visibleFields.assignee && (
                        <div className="flex items-center gap-2 h-full px-4 border-r border-gray-100 dark:border-gray-700">
                          {!task.assignee ||
                          task.assignee.name === "Unassigned" ||
                          !task.assignee.name ? (
                            <div className="flex items-center gap-2 group/assignee opacity-50 hover:opacity-100 transition-opacity">
                              <div className="w-5 h-5 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 border-dashed flex items-center justify-center text-gray-400 dark:text-gray-500 hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                                <User size={10} />
                              </div>
                            </div>
                          ) : task.assignee.avatar ? (
                            <div className="flex items-center gap-2">
                              <img
                                src={task.assignee.avatar}
                                alt={task.assignee.name}
                                className="w-5 h-5 rounded-full object-cover"
                              />
                              <span className="truncate text-gray-700 dark:text-gray-300">
                                {task.assignee.name}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[9px] font-bold border border-blue-200 dark:border-blue-800">
                                {task.assignee.name.charAt(0)}
                              </div>
                              <span className="truncate text-gray-700 dark:text-gray-300">
                                {task.assignee.name}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {visibleFields.dueDate && (
                        <div className="text-gray-500 dark:text-gray-400 h-full flex items-center px-4 border-r border-gray-100 dark:border-gray-700">
                          {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString(
                                "en-US",
                                { month: "short", day: "numeric" },
                              )
                            : ""}
                        </div>
                      )}

                      {visibleFields.label && (
                        <div className="flex items-center gap-1.5 h-full px-4 border-r border-gray-100 dark:border-gray-700 overflow-hidden">
                          {task.labels.map((label, idx) => {
                            const bgClass =
                              label.bg && label.bg.length > 2
                                ? label.bg
                                : "bg-gray-100 dark:bg-gray-700";
                            const textClass =
                              label.color && label.color.length > 2
                                ? label.color
                                : "text-gray-600 dark:text-gray-300";
                            return (
                              <span
                                key={idx}
                                className={`px-2 py-0.5 rounded-[3px] text-[11px] font-medium leading-none ${bgClass} ${textClass} opacity-90 whitespace-nowrap`}
                              >
                                {label.text}
                              </span>
                            );
                          })}
                        </div>
                      )}

                      <div className="flex justify-center items-center h-full">
                        <button className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 opacity-0 group-hover/row:opacity-100 transition-all p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                          <MoreHorizontal size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-2 px-4 text-[13px] text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-700 italic bg-gray-50/30 dark:bg-gray-800/30">
                    No tasks.
                  </div>
                )}
              </div>

              <button
                className="flex items-center gap-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 py-1.5 items-center px-4 text-[13px] group/add w-full text-left transition-colors -mt-px relative z-[1]"
                onClick={() => onAddTask && onAddTask(group.id)}
              >
                <Plus
                  size={14}
                  className="group-hover/add:text-blue-500 transition-colors"
                />
                <span className="group-hover/add:text-gray-800 dark:group-hover/add:text-gray-200 transition-colors">
                  Add task...
                </span>
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TableView;
