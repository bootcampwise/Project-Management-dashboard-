import React, { useState } from "react";
import {
  CheckCircle2,
  Trash2,
  UserPlus,
  X,
  Search,
  Loader2,
} from "lucide-react";
import type { TaskSubtasksProps } from "../../types";

const TaskSubtasks: React.FC<TaskSubtasksProps> = ({
  subtasks,
  newSubtask,
  setNewSubtask,
  filteredTeamMembers,
  subtaskAssigneeSearch,
  setSubtaskAssigneeSearch,
  onAddSubtask,
  onToggle,
  onDelete,
  onAssign,
  isTeamMember = false,
  isSubmitting = false,
}) => {
  const [assigningSubtaskId, setAssigningSubtaskId] = useState<string | null>(
    null,
  );

  const completedCount = subtasks?.filter((st) => st.completed).length || 0;
  const totalCount = subtasks?.length || 0;
  const subtaskProgress =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Subtasks
        </h3>
        <span className="text-gray-400 dark:text-gray-500 text-xs font-medium">
          · {completedCount}/{totalCount}
        </span>
      </div>

      {totalCount > 0 && (
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                subtaskProgress === 100 ? "bg-green-500" : "bg-blue-500"
              }`}
              style={{ width: `${subtaskProgress}%` }}
            />
          </div>
          <span
            className={`text-xs font-medium min-w-[40px] ${
              subtaskProgress === 100
                ? "text-green-600 dark:text-green-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {subtaskProgress}%
          </span>
        </div>
      )}

      <div className="space-y-1">
        {subtasks?.map((subtask) => (
          <div
            key={subtask.id}
            className="flex items-center justify-between group py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 px-3 -mx-3 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  isTeamMember && onToggle(subtask.id, !subtask.completed)
                }
                className={`focus:outline-none ${!isTeamMember ? "cursor-default" : ""}`}
                disabled={!isTeamMember}
              >
                <CheckCircle2
                  size={18}
                  className={`cursor-pointer transition-colors ${
                    subtask.completed
                      ? "text-green-500"
                      : "text-gray-300 dark:text-gray-600 hover:text-gray-400 dark:hover:text-gray-500"
                  }`}
                />
              </button>
              <span
                className={`text-sm ${
                  subtask.completed
                    ? "text-gray-400 dark:text-gray-500 line-through"
                    : "text-gray-700 dark:text-gray-200 font-medium"
                }`}
              >
                {subtask.title}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {subtask.createdBy && (
                <div
                  className="flex items-center gap-1"
                  title={`Created by ${subtask.createdBy.name}`}
                >
                  {subtask.createdBy.avatar ? (
                    <img
                      src={subtask.createdBy.avatar}
                      alt={subtask.createdBy.name}
                      className="w-5 h-5 rounded-full opacity-60"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[9px] text-gray-500 opacity-60">
                      {subtask.createdBy.name?.charAt(0)}
                    </div>
                  )}
                </div>
              )}

              <div className="relative">
                <button
                  onClick={() =>
                    isTeamMember &&
                    setAssigningSubtaskId(
                      assigningSubtaskId === subtask.id ? null : subtask.id,
                    )
                  }
                  className={`focus:outline-none flex items-center ${!isTeamMember ? "cursor-default" : ""}`}
                  title={
                    subtask.assignees?.length
                      ? `Assigned to ${subtask.assignees
                          .map((a) => a.name)
                          .join(", ")}`
                      : "Click to assign"
                  }
                >
                  {subtask.assignees && subtask.assignees.length > 0 ? (
                    <div className="flex -space-x-1.5">
                      {subtask.assignees.slice(0, 3).map((assignee, idx) => (
                        <img
                          key={assignee.id}
                          src={
                            assignee.avatar ||
                            `https://avatar.vercel.sh/${assignee.name}`
                          }
                          alt={assignee.name}
                          className="w-6 h-6 rounded-full border-2 border-white"
                          style={{ zIndex: 3 - idx }}
                        />
                      ))}
                      {subtask.assignees.length > 3 && (
                        <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[9px] text-gray-600 font-medium">
                          +{subtask.assignees.length - 3}
                        </div>
                      )}
                    </div>
                  ) : (
                    isTeamMember && (
                      <div className="w-6 h-6 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-500 transition-colors opacity-0 group-hover:opacity-100">
                        <UserPlus size={12} />
                      </div>
                    )
                  )}
                </button>

                {assigningSubtaskId === subtask.id && (
                  <div className="absolute right-0 top-8 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 py-1 min-w-[220px] max-h-[300px] flex flex-col">
                    <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                      <span>Assign to</span>
                      <button
                        onClick={() => {
                          setAssigningSubtaskId(null);
                          setSubtaskAssigneeSearch("");
                        }}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <X size={12} />
                      </button>
                    </div>

                    <div className="px-2 py-2 border-b border-gray-100 dark:border-gray-700">
                      <div className="relative">
                        <Search
                          size={14}
                          className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                        />
                        <input
                          type="text"
                          placeholder="Search members..."
                          value={subtaskAssigneeSearch}
                          onChange={(e) =>
                            setSubtaskAssigneeSearch(e.target.value)
                          }
                          className="w-full pl-7 pr-2 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                          autoFocus
                        />
                      </div>
                    </div>

                    <div className="overflow-y-auto max-h-[180px]">
                      {filteredTeamMembers.length > 0 ? (
                        filteredTeamMembers.map((member) => {
                          const isAssigned = subtask.assignees?.some(
                            (a) => String(a.id) === String(member.id),
                          );
                          return (
                            <button
                              key={member.id}
                              onClick={() => {
                                onAssign(
                                  subtask.id,
                                  String(member.id),
                                  isAssigned ? "remove" : "add",
                                );
                              }}
                              className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                                isAssigned
                                  ? "bg-blue-50 dark:bg-blue-900/30"
                                  : ""
                              }`}
                            >
                              <div
                                className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                                  isAssigned
                                    ? "bg-blue-500 border-blue-500"
                                    : "border-gray-300 dark:border-gray-600"
                                }`}
                              >
                                {isAssigned && (
                                  <CheckCircle2
                                    size={12}
                                    className="text-white"
                                  />
                                )}
                              </div>
                              {member.avatar ? (
                                <img
                                  src={member.avatar}
                                  alt={member.name}
                                  className="w-5 h-5 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-[9px] text-white font-medium">
                                  {member.name?.charAt(0)}
                                </div>
                              )}
                              <span
                                className={`truncate ${
                                  isAssigned
                                    ? "text-blue-700 dark:text-blue-400 font-medium"
                                    : "text-gray-700 dark:text-gray-200"
                                }`}
                              >
                                {member.name}
                              </span>
                            </button>
                          );
                        })
                      ) : (
                        <div className="px-3 py-4 text-sm text-gray-400 dark:text-gray-500 text-center">
                          No members found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {isTeamMember && (
                <button
                  onClick={() => onDelete(subtask.id)}
                  className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete subtask"
                >
                  <Trash2 size={14} />
                </button>
              )}

              <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {new Date(subtask.createdAt || Date.now()).toLocaleDateString(
                  "en-US",
                  { month: "short", day: "numeric" },
                )}
              </span>
            </div>
          </div>
        ))}
      </div>

      {isTeamMember && (
        <div className="flex items-center gap-3 mt-4 px-1 py-1 group">
          <div className="w-4 h-4 flex items-center justify-center">
            {isSubmitting ? (
              <Loader2 className="animate-spin text-blue-500" size={16} />
            ) : (
              <div className="w-4 h-4 rounded border border-gray-300 dark:border-gray-600 group-hover:border-gray-400 dark:group-hover:border-gray-500 transition-colors"></div>
            )}
          </div>
          <input
            type="text"
            placeholder={
              isSubmitting ? "Adding subtask..." : "Add a subtask..."
            }
            className="flex-1 text-sm outline-none placeholder-gray-400 dark:placeholder-gray-500 bg-transparent py-1 text-gray-700 dark:text-gray-200"
            value={newSubtask}
            onChange={(e) => setNewSubtask(e.target.value)}
            onKeyDown={onAddSubtask}
            disabled={isSubmitting}
          />
        </div>
      )}
    </div>
  );
};

export default TaskSubtasks;
