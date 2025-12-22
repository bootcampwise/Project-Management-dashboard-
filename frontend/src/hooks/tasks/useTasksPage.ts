import { useState } from "react";
import type { Task, CreateTaskPayload } from "../../types";
import { useAppDispatch } from "../../store/hooks";
import {
  createTask,
  updateTask,
  updateTaskStatus,
} from "../../store/slices/taskSlice";
import toast from "react-hot-toast";
import { useTasks } from "./useTasks";

export const useTasksPage = () => {
  const dispatch = useAppDispatch();
  const {
    tasks,
    sidebarOpen,
    setSidebarOpen,
    activeView,
    setActiveView,
    getPriorityColor,
  } = useTasks();

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

  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId;
    dispatch(updateTaskStatus({ id: draggableId, status: newStatus }));
  };

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
      // @ts-ignore - unwrap available on the returned promise
      await dispatch(createTask(newTask)).unwrap();
      toast.success("Task created successfully");
      setIsCreateTaskModalOpen(false);
    } catch (err: unknown) {
      console.error("Failed to create task:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create task";
      toast.error(errorMessage);
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
    } catch (error: unknown) {
      console.error("Failed to update task:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast.error(`Failed to update task: ${errorMessage}`);
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
