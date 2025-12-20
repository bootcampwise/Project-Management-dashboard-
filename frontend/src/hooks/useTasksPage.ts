import { useState } from "react";
import type { Task, CreateTaskPayload } from "../types";
import { useAppDispatch } from "../store/hooks";
import { createTask, updateTask } from "../store/slices/taskSlice";
import toast from "react-hot-toast";

export const useTasksPage = () => {
  const dispatch = useAppDispatch();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
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
    setTaskToEdit(null); // Ensure not in edit mode
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

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setSelectedTask(null);
    setIsCreateTaskModalOpen(true);
  };

  const handleUpdateTask = async (
    taskId: string,
    taskData: CreateTaskPayload
  ) => {
    try {
      // @ts-ignore
      await dispatch(updateTask({ id: taskId, data: taskData })).unwrap();
      toast.success("Task updated successfully");
      setIsCreateTaskModalOpen(false);
      setTaskToEdit(null);
    } catch (error: any) {
      console.error("Failed to update task:", error);
      toast.error(`Failed to update task: ${error.message || error}`);
    }
  };

  const closeTaskDetail = () => setSelectedTask(null);

  const closeCreateTaskModal = () => {
    setIsCreateTaskModalOpen(false);
    setTaskToEdit(null);
  };

  return {
    selectedTask,
    taskToEdit,
    isCreateTaskModalOpen,
    modalInitialStatus,
    handleTaskClick,
    handleOpenCreateTask,
    handleCreateTask,
    handleEditTask,
    handleUpdateTask,
    closeTaskDetail,
    closeCreateTaskModal,
  };
};
