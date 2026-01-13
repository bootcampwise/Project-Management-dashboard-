import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { isSameDay, isAfter, subDays, parseISO } from "date-fns";
import { useGetTasksQuery } from "../../../store/api/taskApiSlice";
import { useGetProjectsQuery } from "../../../store/api/projectApiSlice";
import { useGetAllTeamsQuery } from "../../../store/api/teamApiSlice";
import type { Task, Project } from "../../../types";

export const useGlobalSearch = (
  showProjects: boolean = true,
  onClose?: () => void,
) => {
  const { data: tasks = [] } = useGetTasksQuery();
  const { data: projects = [] } = useGetProjectsQuery();
  const { data: allTeams = [] } = useGetAllTeamsQuery();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "alpha">("newest");

  const [filterCreator, setFilterCreator] = useState<string | null>(null);
  const [filterProject, setFilterProject] = useState<string | null>(null);
  const [filterDate, setFilterDate] = useState<string | null>(null);

  const allMembers = useMemo(() => {
    const membersMap = new Map();
    allTeams.forEach((team) => {
      team.members?.forEach((member) => {
        if (!membersMap.has(member.id)) {
          membersMap.set(member.id, member);
        }
      });
    });
    return Array.from(membersMap.values());
  }, [allTeams]);

  const filteredResults = useMemo(() => {
    let results: (Task | Project)[] = [];

    const filteredTasks = tasks.filter((task) => {
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchesTitle =
          task.title?.toLowerCase().includes(query) ||
          task.name?.toLowerCase().includes(query);
        const matchesDesc = task.description?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) return false;
      }

      if (filterCreator) {
        if (
          task.creator?.id !== filterCreator &&
          task.assignee?.name !== filterCreator
        ) {
          const creatorId = task.creator?.id;
          if (creatorId !== filterCreator) return false;
        }
      }

      if (filterProject) {
        const projectId =
          typeof task.project === "string" ? task.project : task.project?.id;
        if (projectId !== filterProject) return false;
      }

      if (filterDate && task.dueDate) {
        const date = parseISO(task.dueDate);
        const today = new Date();
        const startOfToday = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
        );

        if (filterDate === "today") {
          if (!isSameDay(date, today)) return false;
        } else if (filterDate === "week") {
          const sevenDaysAgo = subDays(startOfToday, 7);
          if (!(isAfter(date, sevenDaysAgo) && !isAfter(date, today)))
            return false;
        } else if (filterDate === "month") {
          const thirtyDaysAgo = subDays(startOfToday, 30);
          if (!(isAfter(date, thirtyDaysAgo) && !isAfter(date, today)))
            return false;
        }
      }

      return true;
    });

    let filteredProjects: Project[] = [];
    if (showProjects) {
      filteredProjects = projects.filter((project) => {
        if (filterDate || filterCreator) return false;
        if (filterProject && project.id !== filterProject) return false;
        if (searchQuery.trim()) {
          const query = searchQuery.trim().toLowerCase();
          return (
            project.name.toLowerCase().includes(query) ||
            project.key.toLowerCase().includes(query)
          );
        }
        return true;
      });
    }

    results = [...filteredTasks, ...filteredProjects];

    return results.sort((a, b) => {
      if (sortBy === "alpha") {
        const titleA = ("title" in a ? a.title : a.name) || "";
        const titleB = ("title" in b ? b.title : b.name) || "";
        return titleA.localeCompare(titleB);
      }

      const dateA = new Date(
        a.createdAt || ("startDate" in a ? a.startDate : undefined) || 0,
      ).getTime();
      const dateB = new Date(
        b.createdAt || ("startDate" in b ? b.startDate : undefined) || 0,
      ).getTime();

      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [
    tasks,
    projects,
    searchQuery,
    filterCreator,
    filterProject,
    filterDate,
    sortBy,
    showProjects,
  ]);

  const handleResultClick = (result: Task | Project) => {
    if ("key" in result) {
      navigate(`/project/${result.id}`);
    } else {
      navigate(`/tasks?taskId=${result.id}`);
    }
    if (onClose) onClose();
  };

  const clearSearch = () => setSearchQuery("");

  const getCreatorLabel = () => {
    if (!filterCreator) return "Created by";
    const member = allMembers.find((m) => String(m.id) === filterCreator);
    return member ? `Created by: ${member.name}` : "Created by";
  };

  const getProjectLabel = () => {
    if (!filterProject) return "Projects";
    const project = projects.find((p) => p.id === filterProject);
    return project ? `Project: ${project.name}` : "Projects";
  };

  const getDateLabel = () => {
    if (!filterDate) return "Date";
    if (filterDate === "today") return "Due Today";
    if (filterDate === "week") return "Last 7 Days";
    if (filterDate === "month") return "Last 30 Days";
    return "Date";
  };

  return {
    projects,
    allMembers,
    filteredResults,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filterCreator,
    setFilterCreator,
    filterProject,
    setFilterProject,
    filterDate,
    setFilterDate,
    handleResultClick,
    clearSearch,
    getCreatorLabel,
    getProjectLabel,
    getDateLabel,
  };
};
