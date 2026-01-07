import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setSidebarOpen, setSettingsOpen } from "../../../store/uiSlice";
import { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useGetProjectsQuery } from "../../../store/api/projectApiSlice";
import { useGetTasksQuery } from "../../../store/api/taskApiSlice";
import { useGetTeamsQuery } from "../../../store/api/teamApiSlice";
import type { TimeRange } from "../../../types/dashboard.types";

export type StatusFilter =
  | "all"
  | "TODO"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "BACKLOG";
export type PriorityFilter = "all" | "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export const useDashboard = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { sidebarOpen } = useAppSelector((state) => state.ui);

  const { data: projects = [], isLoading: isProjectsLoading } =
    useGetProjectsQuery();
  const { data: tasks = [], isLoading: isTasksLoading } = useGetTasksQuery();
  const { isLoading: isTeamsLoading } = useGetTeamsQuery();

  const [selectedProject, setSelectedProject] = useState<string>("all");

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [selectedRange, setSelectedRange] = useState<TimeRange>("W");

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const dateRange = useMemo(() => {
    const endDate = new Date(selectedDate);
    const startDate = new Date(selectedDate);

    switch (selectedRange) {
      case "D":
        startDate.setDate(endDate.getDate() - 1);
        break;
      case "W":
        startDate.setDate(endDate.getDate() - 7);
        break;
      case "M":
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case "6M":
        startDate.setMonth(endDate.getMonth() - 6);
        break;
      case "Y":
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
    }

    return { startDate, endDate };
  }, [selectedDate, selectedRange]);

  const projectFilteredTasks = useMemo(() => {
    if (selectedProject === "all") return tasks;
    return tasks.filter((task) => {
      const projectId =
        typeof task.project === "string" ? task.project : task.project?.id;
      return projectId === selectedProject;
    });
  }, [tasks, selectedProject]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const projectId =
        typeof task.project === "string" ? task.project : task.project?.id;
      if (selectedProject !== "all" && projectId !== selectedProject) {
        return false;
      }

      if (statusFilter !== "all" && task.status !== statusFilter) {
        return false;
      }
      if (priorityFilter !== "all" && task.priority !== priorityFilter) {
        return false;
      }

      if (task.dueDate) {
        const taskDate = new Date(task.dueDate);
        if (taskDate < dateRange.startDate || taskDate > dateRange.endDate) {
          return false;
        }
      }

      return true;
    });
  }, [tasks, selectedProject, statusFilter, priorityFilter, dateRange]);

  const isLoading = isProjectsLoading || isTasksLoading || isTeamsLoading;

  useEffect(() => {
    if (location.state?.openOnboarding) {
      dispatch(setSettingsOpen(true));
      window.history.replaceState({}, document.title);
    }
  }, [location, dispatch]);
  const clearFilters = () => {
    setStatusFilter("all");
    setPriorityFilter("all");
    setSelectedProject("all");
    setSelectedRange("W");
    setSelectedDate(new Date());
  };

  return {
    sidebarOpen,
    setSidebarOpen: (open: boolean) => dispatch(setSidebarOpen(open)),
    isLoading,
    projects,
    tasks,
    projectFilteredTasks,
    filteredTasks,
    selectedProject,
    setSelectedProject,
    selectedDate,
    setSelectedDate,
    selectedRange,
    setSelectedRange,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    isFiltersOpen,
    setIsFiltersOpen,
    dateRange,
    clearFilters,
  };
};
