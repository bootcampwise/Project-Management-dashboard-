import { useState } from "react";
import type { Task, CreateTaskPayload } from "../types";
import { useAppDispatch } from "../store/hooks";
import { createTask } from "../store/slices/taskSlice";
import toast from "react-hot-toast";

export const useTasksPage = () => {
  const dispatch = useAppDispatch();

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

  const handleCreateTask = async (newTask: CreateTaskPayload) => {
    try {
      console.log("Creating task:", newTask);
      // Dispatch createTask thunk which will persist to backend and update store
      // Use unwrap to throw on rejected action so we can catch it
      // @ts-ignore - unwrap available on the returned promise
      await dispatch(createTask(newTask)).unwrap();
      toast.success("Task created successfully");
      setIsCreateTaskModalOpen(false);
    } catch (err: any) {
      console.error("Failed to create task:", err);
      toast.error(err?.message || "Failed to create task");
    }
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
