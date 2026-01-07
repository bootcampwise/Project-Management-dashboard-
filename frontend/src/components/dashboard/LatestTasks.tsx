import React from "react";
import { ArrowUp, ArrowDown, FileText } from "lucide-react";
import type { LatestTasksProps } from "../../types";
import {
  useLatestTasks,
  type SortDirection,
} from "../../pages/dashboard/hooks/useLatestTasks";

const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return "-";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getStatusDisplay = (
  status: string,
): { label: string; className: string } => {
  const statusMap: Record<string, { label: string; className: string }> = {
    TODO: { label: "To-Do", className: "bg-blue-700" },
    BACKLOG: { label: "Backlog", className: "bg-gray-600" },
    IN_PROGRESS: { label: "In Progress", className: "bg-amber-600" },
    IN_REVIEW: { label: "In Review", className: "bg-purple-600" },
    QA: { label: "QA", className: "bg-indigo-600" },
    COMPLETED: { label: "Completed", className: "bg-green-700" },
    CANCELED: { label: "Cancelled", className: "bg-red-600" },
    POSTPONE: { label: "Postponed", className: "bg-orange-600" },
  };
  return statusMap[status] || { label: status, className: "bg-gray-500" };
};

const getPriorityDisplay = (
  priority: string,
): {
  label: string;
  bgClass: string;
  textClass: string;
  dotClass: string;
  sortValue: number;
} => {
  const priorityMap: Record<
    string,
    {
      label: string;
      bgClass: string;
      textClass: string;
      dotClass: string;
      sortValue: number;
    }
  > = {
    URGENT: {
      label: "Urgent",
      bgClass: "bg-red-100 dark:bg-red-900/50",
      textClass: "text-red-700 dark:text-red-300",
      dotClass: "bg-red-600",
      sortValue: 4,
    },
    HIGH: {
      label: "High",
      bgClass: "bg-red-50 dark:bg-red-900/30",
      textClass: "text-red-600 dark:text-red-400",
      dotClass: "bg-red-500",
      sortValue: 3,
    },
    MEDIUM: {
      label: "Medium",
      bgClass: "bg-yellow-50 dark:bg-yellow-900/30",
      textClass: "text-yellow-600 dark:text-yellow-400",
      dotClass: "bg-yellow-500",
      sortValue: 2,
    },
    LOW: {
      label: "Low",
      bgClass: "bg-green-50 dark:bg-green-900/30",
      textClass: "text-green-600 dark:text-green-400",
      dotClass: "bg-green-500",
      sortValue: 1,
    },
  };
  return (
    priorityMap[priority] || {
      label: priority,
      bgClass: "bg-gray-50",
      textClass: "text-gray-600",
      dotClass: "bg-gray-500",
      sortValue: 0,
    }
  );
};

const SortArrow = ({
  active,
  direction,
}: {
  active: boolean;
  direction: SortDirection;
}) => (
  <div className="flex flex-col">
    <ArrowUp
      size={8}
      className={`-mb-[2px] ${active && direction === "asc" ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-600"}`}
    />
    <ArrowDown
      size={8}
      className={`-mt-[2px] ${active && direction === "desc" ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-600"}`}
    />
  </div>
);

const LatestTasks: React.FC<LatestTasksProps> = ({ tasks }) => {
  const { sortKey, sortDir, sortedTasks, handleSort } = useLatestTasks(tasks);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100/60 dark:border-gray-700/60 p-3 flex flex-col overflow-hidden w-full h-[260px]">
      <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-2">
        Latest Tasks
      </h3>

      <div className="overflow-x-auto flex-1 w-full">
        <table className="w-full min-w-[900px]">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="py-1 px-3 text-left w-8">
                <div className="w-3 h-3 rounded border border-gray-400 dark:border-gray-500"></div>
              </th>

              <th className="py-1.5 px-3 text-left font-medium text-gray-500 dark:text-gray-400 text-[10px] uppercase tracking-wider">
                <div
                  className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => handleSort("title")}
                >
                  Task Name
                  <SortArrow active={sortKey === "title"} direction={sortDir} />
                </div>
              </th>

              <th className="py-1.5 px-3 text-left font-medium text-gray-500 dark:text-gray-400 text-[10px] uppercase tracking-wider">
                <div
                  className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => handleSort("project")}
                >
                  Project Name
                  <SortArrow
                    active={sortKey === "project"}
                    direction={sortDir}
                  />
                </div>
              </th>

              <th className="py-1.5 px-3 text-left font-medium text-gray-500 dark:text-gray-400 text-[10px] uppercase tracking-wider">
                <div
                  className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => handleSort("subtasks")}
                >
                  Subtasks
                  <SortArrow
                    active={sortKey === "subtasks"}
                    direction={sortDir}
                  />
                </div>
              </th>

              <th className="py-1.5 px-3 text-left font-medium text-gray-500 dark:text-gray-400 text-[10px] uppercase tracking-wider">
                <div
                  className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => handleSort("status")}
                >
                  Status
                  <SortArrow
                    active={sortKey === "status"}
                    direction={sortDir}
                  />
                </div>
              </th>

              <th className="py-1.5 px-3 text-left font-medium text-gray-500 dark:text-gray-400 text-[10px] uppercase tracking-wider">
                <div
                  className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => handleSort("priority")}
                >
                  Priority
                  <SortArrow
                    active={sortKey === "priority"}
                    direction={sortDir}
                  />
                </div>
              </th>

              <th className="py-1.5 px-3 text-left font-medium text-gray-500 dark:text-gray-400 text-[10px] uppercase tracking-wider">
                <div
                  className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => handleSort("startDate")}
                >
                  Start Date
                  <SortArrow
                    active={sortKey === "startDate"}
                    direction={sortDir}
                  />
                </div>
              </th>

              <th className="py-1.5 px-3 text-left font-medium text-gray-500 dark:text-gray-400 text-[10px] uppercase tracking-wider">
                <div
                  className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => handleSort("dueDate")}
                >
                  End Date
                  <SortArrow
                    active={sortKey === "dueDate"}
                    direction={sortDir}
                  />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedTasks.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  No tasks found
                </td>
              </tr>
            ) : (
              sortedTasks.map((task) => {
                const statusDisplay = getStatusDisplay(task.status);
                const priorityDisplay = getPriorityDisplay(task.priority);
                const projectName =
                  typeof task.project === "string"
                    ? task.project
                    : task.project?.name || "-";
                const subtasksArray = Array.isArray(task.subtasks)
                  ? task.subtasks
                  : [];
                const subtaskCount = subtasksArray.length;
                const completedSubtasks = subtasksArray.filter(
                  (s: { completed?: boolean }) => s.completed,
                ).length;

                return (
                  <tr
                    key={task.id}
                    className="border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="py-1.5 px-3">
                      <div className="w-3 h-3 rounded border border-gray-400 dark:border-gray-500 cursor-pointer hover:border-blue-900"></div>
                    </td>
                    <td className="py-1.5 px-3 text-xs font-medium text-gray-700 dark:text-gray-200 max-w-[200px] truncate">
                      {task.title}
                    </td>
                    <td className="py-1.5 px-3 text-xs text-gray-500 dark:text-gray-400">
                      {projectName}
                    </td>
                    <td className="py-1.5 px-3 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <FileText
                          size={12}
                          className="text-blue-900 dark:text-blue-400"
                        />
                        <span>
                          {completedSubtasks}/{subtaskCount}
                        </span>
                      </div>
                    </td>
                    <td className="py-1.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold text-white inline-block w-20 text-center ${statusDisplay.className}`}
                      >
                        {statusDisplay.label}
                      </span>
                    </td>
                    <td className="py-1.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-medium inline-flex items-center gap-1 ${priorityDisplay.bgClass} ${priorityDisplay.textClass}`}
                      >
                        <div
                          className={`w-1 h-1 rounded-full ${priorityDisplay.dotClass}`}
                        ></div>
                        {priorityDisplay.label}
                      </span>
                    </td>
                    <td className="py-1.5 px-3 text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(task.createdAt)}
                    </td>
                    <td className="py-1.5 px-3 text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(task.dueDate)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LatestTasks;
