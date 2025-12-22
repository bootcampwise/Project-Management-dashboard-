import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setActiveView, fetchTasks } from "../../store/slices/taskSlice";
import { setSidebarOpen } from "../../store/slices/uiSlice";
import type { Task, BoardColumn } from "../../types";

export const useTasks = () => {
  const dispatch = useAppDispatch();

  // Selectors
  const { activeView, tasks, isLoading } = useAppSelector(
    (state) => state.task
  );
  const { sidebarOpen } = useAppSelector((state) => state.ui);

  // Fetch all tasks on mount
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // Organize tasks into columns by status
  const columns: BoardColumn[] = useMemo(() => {
    const columnConfig = [
      { id: "TODO", title: "To-Do", color: "#3b82f6" },
      { id: "IN_PROGRESS", title: "In Progress", color: "#f59e0b" },
      { id: "COMPLETED", title: "Completed", color: "#10b981" },
      { id: "CANCELED", title: "Cancelled", color: "#ef4444" },
    ];

    return columnConfig.map((config) => ({
      id: config.id,
      title: config.title,
      color: config.color,
      tasks: tasks.filter((task: Task) => task.status === config.id),
    }));
  }, [tasks]);

  const getPriorityColor = (priority: string) => {
    const upperPriority = priority?.toUpperCase();
    switch (upperPriority) {
      case "HIGH":
      case "URGENT":
        return "bg-red-100 text-red-600";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-600";
      case "LOW":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return {
    // States
    sidebarOpen,
    setSidebarOpen: (open: boolean) => dispatch(setSidebarOpen(open)),
    activeView,
    setActiveView: (view: "kanban" | "list") => dispatch(setActiveView(view)),

    // Data
    columns,
    tasks,
    isLoading,

    // Helpers
    getPriorityColor,
  };
};
