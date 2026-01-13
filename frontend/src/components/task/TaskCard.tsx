import React from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Paperclip,
  MoreVertical,
  Pencil,
  Trash2,
  FileText,
} from "lucide-react";
import { cardVariants } from "../../utils/motion";
import { useMagnetic } from "../../hooks/useMagnetic";
import { Dropdown, Tag } from "../ui";
import { canEditTask, canDeleteTask } from "../../utils/permissions";

import type { TaskCardComponentProps } from "../../types";

const TaskCard: React.FC<TaskCardComponentProps> = ({
  title,
  project,
  priority,
  description,
  tags,
  assignee,
  assignees,
  comments = 0,
  attachments = 0,
  subtasks = 0,
  completedSubtasks,
  date,
  onClick,
  onEdit,
  onDelete,
  visibleFields = {
    assignee: true,
    dueDate: true,
    label: true,
    project: true,
  },
  variant = "detailed",
  isTaskCreator = false,
  isTeamMember = false,
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const displayAssignee =
    assignees && assignees.length > 0 ? assignees[0] : assignee;

  const dropdownItems = [];

  if (canEditTask(isTeamMember, isTaskCreator)) {
    dropdownItems.push({
      key: "edit",
      label: "Edit Task",
      icon: <Pencil size={14} />,
      onClick: () => onEdit?.(),
    });
  }

  if (canDeleteTask(isTeamMember, isTaskCreator)) {
    dropdownItems.push({
      key: "delete",
      label: "Delete Task",
      icon: <Trash2 size={14} />,
      onClick: () => onDelete?.(),
      danger: true,
    });
  }

  const showActions = dropdownItems.length > 0;

  const {
    style: magneticStyle,
    onMouseMove,
    onMouseLeave,
  } = useMagnetic({ limit: 4, strength: 0.1 });

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={magneticStyle}
      className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md dark:hover:shadow-gray-900/50 transition-all cursor-pointer group relative flex flex-col gap-3"
    >
      {showActions && (
        <div
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <Dropdown
            trigger={
              <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <MoreVertical size={16} />
              </button>
            }
            items={dropdownItems}
            align="right"
          />
        </div>
      )}

      {variant === "simple" ? (
        <>
          <h3 className="text-gray-900 dark:text-white font-bold text-[15px] leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors pr-6">
            {title}
          </h3>

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Tag
                  key={index}
                  text={tag.text}
                  backgroundColor={tag.bg}
                  color={tag.color}
                />
              ))}

              {visibleFields.label !== false && priority && !tags.length && (
                <span
                  className={`px-2.5 py-1 rounded text-xs font-medium ${
                    priority.toUpperCase() === "URGENT" ||
                    priority.toUpperCase() === "HIGH"
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      : priority.toUpperCase() === "LOW"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                  }`}
                >
                  {priority}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between mt-auto pt-2">
            <div className="flex items-center gap-2">
              {visibleFields.assignee !== false && displayAssignee && (
                <>
                  <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                    {displayAssignee.avatar ? (
                      <img
                        src={displayAssignee.avatar}
                        alt={displayAssignee.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 text-[10px] font-bold">
                        {(displayAssignee.name || "U")[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-medium truncate max-w-[80px]">
                    {displayAssignee.name}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-3 text-gray-400 dark:text-gray-500">
              {!!comments && (
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium">{comments}</span>
                  <MessageSquare size={13} />
                </div>
              )}
              {!!attachments && (
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium">{attachments}</span>
                  <Paperclip size={13} className="rotate-45" />
                </div>
              )}
              {visibleFields.dueDate !== false && date && (
                <div className="text-xs font-medium ml-1">
                  {formatDate(date)}
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between items-start">
            {visibleFields.project && project && (
              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400">
                {project}
              </span>
            )}
          </div>

          <h3 className="text-gray-900 dark:text-white font-bold text-base leading-snug mt-2">
            {title}
          </h3>

          {description && (
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}
          <div className="flex items-center justify-between mt-4">
            {visibleFields.assignee !== false && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  Assignee:
                </span>
                <div className="flex -space-x-2">
                  {assignees && assignees.length > 0 ? (
                    <>
                      {assignees.slice(0, 3).map((a, i) => (
                        <div
                          key={i}
                          className="w-7 h-7 rounded-full border-2 border-white dark:border-gray-800 overflow-hidden bg-gray-200 dark:bg-gray-700"
                          title={a.name}
                        >
                          {a.avatar ? (
                            <img
                              src={a.avatar}
                              alt={a.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400">
                              {(a.name || "U")[0].toUpperCase()}
                            </div>
                          )}
                        </div>
                      ))}
                      {assignees.length > 3 && (
                        <div className="w-7 h-7 rounded-full border-2 border-white dark:border-gray-800 bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-xs font-medium text-pink-600 dark:text-pink-400">
                          +{assignees.length - 3}
                        </div>
                      )}
                    </>
                  ) : assignee ? (
                    <div
                      className="w-7 h-7 rounded-full border-2 border-white dark:border-gray-800 overflow-hidden bg-gray-200 dark:bg-gray-700"
                      title={assignee.name}
                    >
                      {assignee.avatar ? (
                        <img
                          src={assignee.avatar}
                          alt={assignee.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400">
                          {(assignee.name || "U")[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            )}

            {visibleFields.label !== false && priority && (
              <div
                className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${
                  priority.toUpperCase() === "URGENT" ||
                  priority.toUpperCase() === "HIGH"
                    ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                    : priority.toUpperCase() === "LOW"
                      ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    priority.toUpperCase() === "URGENT" ||
                    priority.toUpperCase() === "HIGH"
                      ? "bg-red-500"
                      : priority.toUpperCase() === "LOW"
                        ? "bg-green-500"
                        : "bg-orange-500"
                  }`}
                />
                {priority}
              </div>
            )}
          </div>

          {visibleFields.dueDate !== false && date && (
            <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 mt-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                />
              </svg>
              <span className="text-xs font-medium">{formatDate(date)}</span>
            </div>
          )}

          <div className="flex items-center gap-4 border-t border-gray-100 dark:border-gray-700 pt-3 mt-3">
            <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500">
              <FileText size={14} />
              <span className="text-xs font-medium">
                {subtasks > 0
                  ? completedSubtasks !== undefined
                    ? `${completedSubtasks}/${subtasks}`
                    : subtasks
                  : 0}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500">
              <MessageSquare size={14} />
              <span className="text-xs font-medium">{comments}</span>
            </div>

            <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500">
              <Paperclip size={14} />
              <span className="text-xs font-medium">{attachments}</span>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default TaskCard;
