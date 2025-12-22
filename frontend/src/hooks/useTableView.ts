import { useState, useEffect } from "react";
import type { TableGroup, Task } from "../types";

export const useTableView = (tasks: Task[] = []) => {
  const [groups, setGroups] = useState<TableGroup[]>([]);

  useEffect(() => {
    const statusGroups: Record<string, Task[]> = {
      BACKLOG: [],
      TODO: [],
      IN_PROGRESS: [],
      IN_REVIEW: [],
      QA: [],
      COMPLETED: [],
      POSTPONE: [],
      CANCELED: [],
    };

    tasks.forEach((task) => {
      const status = task.status || "TODO";
      if (statusGroups[status]) {
        statusGroups[status].push(task);
      } else {
        statusGroups["TODO"].push(task);
      }
    });

    const getCount = (item: any): number => {
      if (Array.isArray(item)) return item.length;
      if (typeof item === "number") return item;
      return 0;
    };

    const newGroups: TableGroup[] = [
      {
        id: "BACKLOG",
        title: "Backlog",
        count: statusGroups["BACKLOG"].length,
        color: "gray",
        isCollapsed: false,
        tasks: statusGroups["BACKLOG"].map((t) => ({
          ...mapTaskToTableTask(t),
          comments: getCount(t.comments),
          attachments: getCount(t.attachments),
        })),
      },
      {
        id: "TODO",
        title: "To Do",
        count: statusGroups["TODO"].length,
        color: "blue",
        isCollapsed: false,
        tasks: statusGroups["TODO"].map((t) => ({
          ...mapTaskToTableTask(t),
          comments: getCount(t.comments),
          attachments: getCount(t.attachments),
        })),
      },
      {
        id: "IN_PROGRESS",
        title: "In Progress",
        count: statusGroups["IN_PROGRESS"].length,
        color: "green",
        isCollapsed: false,
        tasks: statusGroups["IN_PROGRESS"].map((t) => ({
          ...mapTaskToTableTask(t),
          comments: getCount(t.comments),
          attachments: getCount(t.attachments),
        })),
      },
      {
        id: "IN_REVIEW",
        title: "In Review",
        count: statusGroups["IN_REVIEW"].length,
        color: "purple",
        isCollapsed: false,
        tasks: statusGroups["IN_REVIEW"].map((t) => ({
          ...mapTaskToTableTask(t),
          comments: getCount(t.comments),
          attachments: getCount(t.attachments),
        })),
      },
      {
        id: "QA",
        title: "QA",
        count: statusGroups["QA"].length,
        color: "yellow",
        isCollapsed: false,
        tasks: statusGroups["QA"].map((t) => ({
          ...mapTaskToTableTask(t),
          comments: getCount(t.comments),
          attachments: getCount(t.attachments),
        })),
      },
      {
        id: "COMPLETED",
        title: "Completed",
        count: statusGroups["COMPLETED"].length,
        color: "indigo",
        isCollapsed: false,
        tasks: statusGroups["COMPLETED"].map((t) => ({
          ...mapTaskToTableTask(t),
          comments: getCount(t.comments),
          attachments: getCount(t.attachments),
        })),
      },
      {
        id: "POSTPONE",
        title: "Postponed",
        count: statusGroups["POSTPONE"].length,
        color: "red",
        isCollapsed: false,
        tasks: statusGroups["POSTPONE"].map((t) => ({
          ...mapTaskToTableTask(t),
          comments: getCount(t.comments),
          attachments: getCount(t.attachments),
        })),
      },
      {
        id: "CANCELED",
        title: "Canceled",
        count: statusGroups["CANCELED"].length,
        color: "gray",
        isCollapsed: false,
        tasks: statusGroups["CANCELED"].map((t) => ({
          ...mapTaskToTableTask(t),
          comments: getCount(t.comments),
          attachments: getCount(t.attachments),
        })),
      },
    ];

    setGroups(newGroups);
  }, [tasks]);

  const toggleGroup = (groupId: string) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId ? { ...g, isCollapsed: !g.isCollapsed } : g
      )
    );
  };

  return {
    groups,
    toggleGroup,
  };
};

// Helper to format date
const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

// Helper to get random pastel color for tags
const getTagColor = (tag: string) => {
  const colors = [
    { bg: "bg-red-100", text: "text-red-700" },
    { bg: "bg-green-100", text: "text-green-700" },
    { bg: "bg-blue-100", text: "text-blue-700" },
    { bg: "bg-yellow-100", text: "text-yellow-700" },
    { bg: "bg-purple-100", text: "text-purple-700" },
    { bg: "bg-pink-100", text: "text-pink-700" },
    { bg: "bg-indigo-100", text: "text-indigo-700" },
  ];
  const index = tag.length % colors.length;
  return colors[index];
};

// Helper to map Task to TableTask
const mapTaskToTableTask = (task: Task) => {
  const tags = task.labels || task.tags || [];
  const mappedLabels = tags.map((tag: any) => {
    if (typeof tag === "string") {
      const colors = getTagColor(tag);
      return { text: tag, bg: colors.bg, color: colors.text };
    }
    return tag; // Already an object
  });

  return {
    id: String(task.id),
    name: task.name || task.title || "Untitled",
    assignee: task.assignee || { name: "Unassigned" },
    dueDate: formatDate(task.dueDate || task.endDate),
    labels: mappedLabels,
    comments: task.comments || 0,
    attachments: task.attachments || 0,
  };
};
