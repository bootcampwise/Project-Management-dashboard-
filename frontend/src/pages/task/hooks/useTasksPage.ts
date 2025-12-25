import { useState } from "react";
import type { DropResult } from "@hello-pangea/dnd";
import type { Task, CreateTaskPayload } from "../../../types";
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
} from "../../../store/api/taskApiSlice";
import { showToast } from "../../../components/ui";
import { useTasks } from "./useTasks";

export const useTasksPage = () => {
  const {
    tasks,
    isLoading,
    sidebarOpen,
    setSidebarOpen,
    activeView,
    setActiveView,
    getPriorityColor,
  } = useTasks();

  // RTK Query mutations
  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [modalInitialStatus, setModalInitialStatus] = useState<
    string | undefined
  >(undefined);

  // Column State
  const [columns, setColumns] = useState([
    {
      id: "BACKLOG",
      title: "Backlog",
      color: "bg-gray-400",
      collapsed: false,
      isVisible: false,
    },
    {
      id: "TODO",
      title: "Todo",
      color: "bg-blue-500",
      collapsed: false,
      isVisible: true,
    },
    {
      id: "IN_PROGRESS",
      title: "In progress",
      color: "bg-green-500",
      collapsed: false,
      isVisible: true,
    },
    {
      id: "IN_REVIEW",
      title: "In Review",
      color: "bg-purple-500",
      collapsed: false,
      isVisible: false,
    },
    {
      id: "QA",
      title: "QA",
      color: "bg-yellow-500",
      collapsed: false,
      isVisible: false,
    },
    {
      id: "COMPLETED",
      title: "Completed",
      color: "bg-indigo-500",
      collapsed: false,
      isVisible: true,
    },
    {
      id: "POSTPONE",
      title: "Postpone",
      color: "bg-red-400",
      collapsed: false,
      isVisible: false,
    },
    {
      id: "CANCELED",
      title: "Canceled",
      color: "bg-gray-500",
      collapsed: false,
      isVisible: true,
    },
  ]);

  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);

  // Derived Data
  const visibleColumns = columns.filter((col) => col.isVisible);
  const hiddenColumns = columns.filter((col) => !col.isVisible);

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status);
  };

  // Handlers
  const handleToggleColumn = (columnId: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, collapsed: !col.collapsed } : col
      )
    );
  };

  const handleHideColumn = (columnId: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, isVisible: false } : col
      )
    );
  };

  const handleShowColumn = (columnId: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, isVisible: true } : col
      )
    );
    setIsAddSectionOpen(false);
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId;
    try {
      await updateTaskStatus({ id: draggableId, status: newStatus }).unwrap();
    } catch (error) {
      console.error("Failed to update task status:", error);
      showToast.error("Failed to update task status");
    }
  };

  const handleTaskClick = (task: Task) => {
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
    setTaskToEdit(null);
    setIsCreateTaskModalOpen(true);
  };

  const handleCreateTask = async (newTask: CreateTaskPayload) => {
    try {
      await createTask(newTask).unwrap();
      showToast.success("Task created successfully");
      setIsCreateTaskModalOpen(false);
    } catch (err: unknown) {
      console.error("Failed to create task:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create task";
      showToast.error(errorMessage);
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
      await updateTask({ id: taskId, data: taskData }).unwrap();
      showToast.success("Task updated successfully");
      setIsCreateTaskModalOpen(false);
      setTaskToEdit(null);
    } catch (error: unknown) {
      console.error("Failed to update task:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      showToast.error(`Failed to update task: ${errorMessage}`);
    }
  };

  const closeTaskDetail = () => setSelectedTask(null);

  const closeCreateTaskModal = () => {
    setIsCreateTaskModalOpen(false);
    setTaskToEdit(null);
  };

  return {
    // Global State (from useTasks)
    tasks,
    isLoading,
    sidebarOpen,
    setSidebarOpen,
    activeView,
    setActiveView,
    getPriorityColor,

    // Local Page State
    selectedTask,
    taskToEdit,
    isCreateTaskModalOpen,
    modalInitialStatus,
    columns,
    isAddSectionOpen,
    setIsAddSectionOpen,
    visibleColumns,
    hiddenColumns,

    // Handlers
    handleTaskClick,
    handleOpenCreateTask,
    handleCreateTask,
    handleEditTask,
    handleUpdateTask,
    closeTaskDetail,
    closeCreateTaskModal,
    handleToggleColumn,
    handleHideColumn,
    handleShowColumn,
    handleDragEnd,
    getTasksByStatus,
  };
};
