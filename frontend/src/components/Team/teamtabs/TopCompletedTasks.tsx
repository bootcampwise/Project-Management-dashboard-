import React from "react";
import { ChevronDown } from "lucide-react";
import type { TopCompletedTasksProps } from "../../../types";

const TopCompletedTasks: React.FC<TopCompletedTasksProps> = ({
  members,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 w-full lg:w-[336px] h-[328px]">
        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-6 animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="flex flex-col gap-2">
                  <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-2 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              </div>
              <div className="h-4 w-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getAvatarColor = (index: number) => {
    const colors = [
      "bg-amber-200",
      "bg-orange-200",
      "bg-rose-200",
      "bg-purple-200",
      "bg-teal-200",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 w-full lg:w-[336px] h-[328px]">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-medium text-gray-600 dark:text-gray-300">
          Top completed tasks
        </h3>
        <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-md text-xs text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
          <span>This week</span>
          <ChevronDown size={14} />
        </button>
      </div>

      <div className="space-y-4">
        {members.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[200px] text-gray-400 dark:text-gray-500 text-sm">
            <p>No task data yet</p>
          </div>
        ) : (
          members.slice(0, 5).map((member, index) => (
            <div key={member.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full ${
                    member.avatarColor || getAvatarColor(index)
                  } overflow-hidden flex-shrink-0 flex items-center justify-center`}
                >
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-700 dark:text-gray-800 font-semibold text-sm">
                      {member.name.charAt(0)}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200 leading-tight">
                    {member.name}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 leading-tight">
                    {member.role}
                  </span>
                </div>
              </div>

              <div className="text-base font-medium text-gray-600 dark:text-gray-300">
                {member.tasksCompleted}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TopCompletedTasks;
