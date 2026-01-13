import React, { useRef, useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Tag } from "../ui";
import type { TaskPropertiesProps, User } from "../../types";
import { getStatusColor, formatStatus } from "../../utils/statusUtils";
import TaskCustomFields from "./TaskCustomFields";

const TaskProperties: React.FC<TaskPropertiesProps> = ({
  task,
  onAddTag,
  isTeamMember = false,
  isSubmitting = false,
}) => {
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const tagInputRef = useRef<HTMLInputElement>(null);

  const projectId =
    typeof task.project === "string" ? task.project : task.project?.id;

  const handleTagSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      onAddTag(tagInput.trim());
      setTagInput("");
      setIsAddingTag(false);
    } else if (e.key === "Escape") {
      setTagInput("");
      setIsAddingTag(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
        {task.name || task.title}
      </h1>
      <div className="grid grid-cols-[120px_1fr] gap-y-6 mb-8 text-sm">
        <div className="text-gray-500 dark:text-gray-400 font-medium py-1">
          Status
        </div>
        <div>
          <div className="inline-flex items-center gap-2.5 px-1 py-1 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
            <div
              className={`w-2.5 h-2.5 rounded-full ${getStatusColor(
                task.status,
              )}`}
            ></div>
            <span className="text-gray-700 dark:text-gray-200 font-medium">
              {formatStatus(task.status)}
            </span>
          </div>
        </div>

        <div className="text-gray-500 dark:text-gray-400 font-medium py-1">
          Created By
        </div>
        <div>
          {task.creator ? (
            <div className="flex items-center gap-2 px-1 py-1 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
              {task.creator.avatar ? (
                <img
                  src={task.creator.avatar}
                  alt={task.creator.name}
                  className="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-700"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                  {task.creator.name?.charAt(0)}
                </div>
              )}
              <span className="text-gray-700 dark:text-gray-200 font-medium">
                {task.creator.name}
              </span>
            </div>
          ) : (
            <span className="text-gray-400 dark:text-gray-500 italic px-1">
              Unknown
            </span>
          )}
        </div>

        <div className="text-gray-500 dark:text-gray-400 font-medium py-1">
          Assignee
        </div>
        <div className="flex flex-wrap gap-2">
          {task.assignees && task.assignees.length > 0 ? (
            task.assignees.map((assignee: User) => (
              <div
                key={assignee.id}
                className="flex items-center gap-2 px-1 py-1 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                {assignee.avatar ? (
                  <img
                    src={assignee.avatar}
                    alt={assignee.name}
                    className="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-700"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                    {assignee.name?.charAt(0)}
                  </div>
                )}
                <span className="text-gray-700 dark:text-gray-200 font-medium">
                  {assignee.name}
                </span>
              </div>
            ))
          ) : (
            <span className="text-gray-400 dark:text-gray-500 italic px-1">
              Unassigned
            </span>
          )}
        </div>

        <div className="text-gray-500 dark:text-gray-400 font-medium py-1">
          Priority
        </div>
        <div>
          <span
            className={`inline-block px-3 py-1 rounded text-xs font-medium ${
              task.priority === "HIGH" || task.priority === "URGENT"
                ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                : task.priority === "MEDIUM"
                  ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
                  : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {task.priority.charAt(0) + task.priority.slice(1).toLowerCase()}
          </span>
        </div>

        <div className="text-gray-500 dark:text-gray-400 font-medium py-1">
          Due date
        </div>
        <div className="text-gray-700 dark:text-gray-200 font-medium py-1 px-1">
          {task.dueDate
            ? new Date(task.dueDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            : "-"}
        </div>

        <div className="text-gray-500 dark:text-gray-400 font-medium py-1">
          Tags
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {task.tags &&
            task.tags.map((tag) => <Tag key={tag.id} text={tag.text} />)}

          {isSubmitting && (
            <div className="px-2 py-1">
              <Loader2 className="animate-spin text-gray-400" size={16} />
            </div>
          )}

          {!isSubmitting &&
            isTeamMember &&
            (isAddingTag ? (
              <input
                ref={tagInputRef}
                type="text"
                className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:border-blue-500 w-24 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                placeholder="New tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagSubmit}
                onBlur={() => {
                  if (!tagInput.trim()) setIsAddingTag(false);
                }}
              />
            ) : (
              <button
                onClick={() => {
                  setIsAddingTag(true);
                  setTimeout(() => tagInputRef.current?.focus(), 0);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Plus size={16} />
              </button>
            ))}
        </div>
      </div>

      {projectId && (
        <TaskCustomFields taskId={String(task.id)} projectId={projectId} />
      )}
      <div className="relative flex py-5 items-center mb-6 group cursor-pointer">
        <div className="flex-grow border-t border-gray-100 dark:border-gray-800 group-hover:border-gray-200 dark:group-hover:border-gray-700 transition-colors"></div>
        <span className="flex-shrink-0 mx-4 text-gray-300 dark:text-gray-600 text-xs text-center absolute left-1/2 -translate-x-1/2 bg-white dark:bg-gray-900 px-2 group-hover:text-gray-400 dark:group-hover:text-gray-500 transition-colors">
          Show empty fields
        </span>
      </div>
    </>
  );
};

export default TaskProperties;
