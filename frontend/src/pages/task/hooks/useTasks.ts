import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setActiveView, setSidebarOpen } from "../../../store/uiSlice";
import { useGetTasksQuery } from "../../../store/api/taskApiSlice";
import type { Task, BoardColumn } from "../../../types";

export const useTasks = () => {
  const dispatch = useAppDispatch();

  const { activeView, sidebarOpen } = useAppSelector((state) => state.ui);

  const { data: tasks = [], isLoading } = useGetTasksQuery();

  const columns: BoardColumn[] = useMemo(() => {
    const columnConfig = [
      { id: "TODO", title: "To-Do", color: "bg-blue-500" },
      { id: "IN_PROGRESS", title: "In Progress", color: "bg-amber-500" },
      { id: "COMPLETED", title: "Completed", color: "bg-green-500" },
      { id: "CANCELED", title: "Cancelled", color: "bg-red-500" },
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
    sidebarOpen,
    setSidebarOpen: (open: boolean) => dispatch(setSidebarOpen(open)),
    activeView,
    setActiveView: (view: "kanban" | "list") => dispatch(setActiveView(view)),
    columns,
    tasks,
    isLoading,
    getPriorityColor,
  };
};
