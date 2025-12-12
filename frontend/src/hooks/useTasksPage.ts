import { useState } from "react";
import type { Task, CreateTaskPayload } from "../types";

export const useTasksPage = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [modalInitialStatus, setModalInitialStatus] = useState<
    string | undefined
  >(undefined);

  const handleTaskClick = (task: Task) => {
    // Map hook task data to Task interface if necessary and ensure all required fields
    const mappedTask: Task = {
      ...task,
      name: task.title || task.name,
      status: task.status,
      startDate: task.startDate || new Date().toISOString(),
      endDate: task.endDate || new Date().toISOString(),
    };
    setSelectedTask(mappedTask);
  };

  const handleOpenCreateTask = (status?: string) => {
    setModalInitialStatus(status);
    setIsCreateTaskModalOpen(true);
  };

  const handleCreateTask = (newTask: CreateTaskPayload) => {
    console.log("New task created:", newTask);
    // Here you would typically add the task to your state or backend
    setIsCreateTaskModalOpen(false);
  };

  const closeTaskDetail = () => setSelectedTask(null);
  const closeCreateTaskModal = () => setIsCreateTaskModalOpen(false);

  return {
    selectedTask,
    isCreateTaskModalOpen,
    modalInitialStatus,
    handleTaskClick,
    handleOpenCreateTask,
    handleCreateTask,
    closeTaskDetail,
    closeCreateTaskModal,
  };
};
