import React from "react";
import type { TaskDetailModalProps } from "../../types";
import { useTaskDetailModal } from "../../pages/task/hooks/useTaskDetailModal";
import { showToast } from "../ui";
import TaskDetailHeader from "./TaskDetailHeader";
import TaskProperties from "./TaskProperties";
import TaskDescription from "./TaskDescription";
import TaskAttachments from "./TaskAttachments";
import TaskSubtasks from "./TaskSubtasks";
import TaskComments from "./TaskComments";


const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  isOpen,
  onClose,
  task: initialTask,
  onEdit,
}) => {
  const {
    task,
    user,
    newSubtask,
    setNewSubtask,
    newComment,
    setNewComment,
    isSubmitting,
    subtaskAssigneeSearch,
    setSubtaskAssigneeSearch,
    filteredTeamMembers,
    handleEditTask,
    deleteTask,
    handleFileChange,
    handleAddSubtask,
    handleDeleteSubtask,
    handleAssignSubtask,
    handleToggleSubtask,
    handleAddComment,
    handleAddTag,
    handleDownload,
  } = useTaskDetailModal({ isOpen, onClose, task: initialTask, onEdit });

  const handleDeleteTask = () => {
    showToast.confirm({
      title: "Delete Task?",
      message: `Are you sure you want to delete "${task?.name || ""}"? This action cannot be undone.`,
      onConfirm: deleteTask,
      confirmText: "Delete",
      variant: "danger",
    });
  };

  if (!isOpen || !task) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/20 dark:bg-black/50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      onClick={onClose}
    >
      <div
        className={`fixed right-0 top-0 h-full bg-white dark:bg-gray-900 shadow-2xl w-[600px] overflow-y-auto flex flex-col transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <TaskDetailHeader
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onClose={onClose}
        />

        <div className="p-8 pb-10">
          <TaskProperties task={task} onAddTag={handleAddTag} />
          <TaskDescription description={task.description} />

          <TaskAttachments
            attachments={
              Array.isArray(task.attachments) ? task.attachments : []
            }
            onUpload={handleFileChange}
            onDownload={handleDownload}
          />

          <TaskSubtasks
            subtasks={Array.isArray(task.subtasks) ? task.subtasks : []}
            newSubtask={newSubtask}
            setNewSubtask={setNewSubtask}
            filteredTeamMembers={filteredTeamMembers}
            subtaskAssigneeSearch={subtaskAssigneeSearch}
            setSubtaskAssigneeSearch={setSubtaskAssigneeSearch}
            onAddSubtask={handleAddSubtask}
            onToggle={handleToggleSubtask}
            onDelete={handleDeleteSubtask}
            onAssign={handleAssignSubtask}
          />

          <TaskComments
            comments={Array.isArray(task.comments) ? task.comments : []}
            user={user}
            newComment={newComment}
            setNewComment={setNewComment}
            onAddComment={handleAddComment}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
