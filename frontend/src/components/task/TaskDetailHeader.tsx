import React from "react";
import {
  X,
  Star,
  Link,
  MoreHorizontal,
  CheckCircle2,
  ChevronsRight,
  Edit,
  Trash2,
} from "lucide-react";
import { Dropdown, IconButton } from "../ui";
import type { TaskDetailHeaderProps } from "../../types";

const TaskDetailHeader: React.FC<TaskDetailHeaderProps> = ({
  onEdit,
  onDelete,
  onClose,
  isTeamMember = false,
}) => {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
      <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
        <IconButton
          icon={<ChevronsRight size={20} />}
          className="hover:text-gray-600"
        />
        <IconButton
          icon={<CheckCircle2 size={20} />}
          className="hover:text-green-600"
        />
      </div>

      <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
        <IconButton
          icon={<Star size={18} />}
          className="hover:text-gray-700 dark:hover:text-gray-200"
        />
        <IconButton icon={<Link size={18} />} className="hover:text-gray-700" />

        <div className="relative">
          <Dropdown
            align="right"
            trigger={
              <button className="hover:text-gray-700 transition-colors p-1 rounded">
                <MoreHorizontal size={18} />
              </button>
            }
            items={[
              ...(isTeamMember
                ? [
                    {
                      key: "update",
                      label: "Update Task",
                      icon: <Edit size={16} />,
                      onClick: onEdit,
                    },
                    {
                      key: "delete",
                      label: "Delete Task",
                      icon: <Trash2 size={16} />,
                      danger: true,
                      onClick: onDelete,
                    },
                  ]
                : []),
            ]}
          />
        </div>

        <IconButton
          icon={<X size={20} />}
          onClick={onClose}
          className="hover:text-red-500 ml-2"
        />
      </div>
    </div>
  );
};

export default TaskDetailHeader;
