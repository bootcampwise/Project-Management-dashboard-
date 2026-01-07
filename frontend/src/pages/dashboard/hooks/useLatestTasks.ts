import { useState, useMemo } from "react";
import type { Task } from "../../../types";

type SortKey =
  | "title"
  | "project"
  | "subtasks"
  | "status"
  | "priority"
  | "startDate"
  | "dueDate";
type SortDirection = "asc" | "desc";

export const useLatestTasks = (tasks: Task[]) => {
  const [sortKey, setSortKey] = useState<SortKey>("startDate");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sortedTasks = useMemo(() => {
    const sorted = [...tasks].sort((a, b) => {
      let valA: string | number = a[sortKey as keyof Task] as string | number;
      let valB: string | number = b[sortKey as keyof Task] as string | number;
      if (sortKey === "project") {
        valA =
          typeof a.project === "string" ? a.project : a.project?.name || "";
        valB =
          typeof b.project === "string" ? b.project : b.project?.name || "";
      } else if (sortKey === "subtasks") {
        valA = Array.isArray(a.subtasks) ? a.subtasks.length : 0;
        valB = Array.isArray(b.subtasks) ? b.subtasks.length : 0;
      } else if (sortKey === "priority") {
        const pMap: Record<string, number> = {
          URGENT: 4,
          HIGH: 3,
          MEDIUM: 2,
          LOW: 1,
        };
        valA = pMap[a.priority] || 0;
        valB = pMap[b.priority] || 0;
      } else if (sortKey === "startDate") {
        valA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        valB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      } else if (sortKey === "dueDate") {
        valA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        valB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
      }

      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return sorted.slice(0, 6);
  }, [tasks, sortKey, sortDir]);

  return {
    sortKey,
    sortDir,
    sortedTasks,
    handleSort,
  };
};

export type { SortKey, SortDirection };
