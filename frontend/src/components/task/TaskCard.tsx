import React from 'react';
import { MessageSquare, Paperclip, Flag, ListTodo, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Badge, Dropdown } from '../ui';

import type { TaskCardComponentProps } from '../../types';

const TaskCard: React.FC<TaskCardComponentProps> = ({
  title,
  project,
  description,
  priority,
  assignee,
  assignees,
  comments = 0,
  attachments = 0,
  subtasks = 0,
  date,
  onClick,
  onEdit,
  onDelete,
  visibleFields = { assignee: true, dueDate: true, label: true }
}) => {

  // Format date to "MMM D, YYYY" or similar compact format
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const displayAssignees = assignees && assignees.length > 0 ? assignees : (assignee ? [assignee] : []);

  // Dropdown menu items
  const dropdownItems = [
    {
      key: 'edit',
      label: 'Edit Task',
      icon: <Pencil size={14} />,
      onClick: () => onEdit?.(),
    },
    {
      key: 'delete',
      label: 'Delete Task',
      icon: <Trash2 size={14} />,
      onClick: () => onDelete?.(),
      danger: true,
    },
  ];

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md dark:hover:shadow-gray-900/50 transition-all cursor-pointer group relative"
    >
      {/* Three-dot Menu - appears on hover */}
      {(onEdit || onDelete) && (
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

      {/* Project Name */}
      {project && (
        <div className="mb-1">
          <Badge variant="primary" size="sm" className="uppercase tracking-wide font-semibold">
            {project}
          </Badge>
        </div>
      )}

      {/* Title */}
      <h3 className="text-gray-900 dark:text-white font-bold mb-1 text-[15px] leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors pr-8">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-gray-500 dark:text-gray-400 text-xs mb-4 line-clamp-2 leading-relaxed">
          {description}
        </p>
      )}

      {/* Assignees */}
      {visibleFields.assignee !== false && (
        <div className="mb-4">
          <div className="flex items-center">
            <span className="text-xs text-gray-400 dark:text-gray-500 mr-2 font-medium">Assignee:</span>
            <div className="flex -space-x-2">
              {displayAssignees.length > 0 ? (
                displayAssignees.slice(0, 3).map((a, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-[9px] font-bold text-gray-500 dark:text-gray-400"
                    title={a.name}
                  >
                    {a.avatar ? (
                      <img src={a.avatar} alt={a.name} className="w-full h-full object-cover" />
                    ) : (
                      (a.name || 'U')[0].toUpperCase()
                    )}
                  </div>
                ))
              ) : (
                <div className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 border-dashed bg-gray-50 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-300 dark:text-gray-500 text-[10px]">?</span>
                </div>
              )}
              {displayAssignees.length > 3 && (
                <div className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-[9px] font-medium text-gray-500 dark:text-gray-400">
                  +{displayAssignees.length - 3}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Date and Priority Row */}
      {(visibleFields.dueDate !== false || visibleFields.label !== false) && (
        <div className="flex items-center justify-between mb-4">
          {/* Date */}
          {visibleFields.dueDate !== false && (
            <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500">
              <Flag size={14} className="stroke-current" />
              <span className="text-xs font-medium">
                {date ? formatDate(date) : 'No date'}
              </span>
            </div>
          )}

          {/* Priority Badge */}
          {visibleFields.label !== false && (
            <Badge variant={
              priority?.toUpperCase() === 'URGENT' || priority?.toUpperCase() === 'HIGH' ? 'danger' :
                priority?.toUpperCase() === 'LOW' ? 'success' :
                  priority?.toUpperCase() === 'MEDIUM' ? 'warning' : 'default'
            } size="sm" className="font-bold uppercase tracking-wider">
              {priority || 'Medium'}
            </Badge>
          )}
        </div>
      )}

      {/* Footer Stats */}
      <div className="flex items-center gap-4 border-t border-gray-50 dark:border-gray-700 pt-3">
        {/* Subtasks */}
        <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          <ListTodo size={14} />
          <span className="text-xs font-medium">{subtasks}</span>
        </div>

        {/* Comments */}
        <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          <MessageSquare size={14} />
          <span className="text-xs font-medium">{comments}</span>
        </div>

        {/* Attachments */}
        <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          <Paperclip size={14} />
          <span className="text-xs font-medium">{attachments}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
