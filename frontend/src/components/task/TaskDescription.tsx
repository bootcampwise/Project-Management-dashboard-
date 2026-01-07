import React from "react";
import type { TaskDescriptionProps } from "../../types";

const TaskDescription: React.FC<TaskDescriptionProps> = ({ description }) => {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
        Description
      </h3>
      <div className="text-gray-800 dark:text-gray-200 leading-relaxed text-sm whitespace-pre-wrap">
        {description || (
          <span className="text-gray-400 dark:text-gray-500 italic">
            No description provided.
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskDescription;
