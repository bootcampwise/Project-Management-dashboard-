import { useState, useEffect } from "react";
import type { TableGroup, Task } from "../types";

export const useTableView = (tasks: Task[] = []) => {
  const [groups, setGroups] = useState<TableGroup[]>([]);

  useEffect(() => {
    const statusGroups: Record<string, Task[]> = {
      "In Progress": [],
      "To-Do": [],
      Completed: [],
      Backlog: [],
      Cancelled: [],
    };

    tasks.forEach((task) => {
      const status = task.status || "To-Do";
      if (statusGroups[status]) {
        statusGroups[status].push(task);
      } else {
        // Handle unknown status if any, maybe put in To-Do or generic
        statusGroups["To-Do"].push(task);
      }
    });

    const newGroups: TableGroup[] = [
      {
        id: "1",
        title: "In Progress",
        count: statusGroups["In Progress"].length,
        color: "green",
        isCollapsed: false,
        tasks: statusGroups["In Progress"].map(mapTaskToTableTask),
      },
      {
        id: "2",
        title: "To Do",
        count: statusGroups["To-Do"].length,
        color: "gray",
        isCollapsed: false,
        tasks: statusGroups["To-Do"].map(mapTaskToTableTask),
      },
      {
        id: "3",
        title: "Completed",
        count: statusGroups["Completed"].length,
        color: "blue",
        isCollapsed: false,
        tasks: statusGroups["Completed"].map(mapTaskToTableTask),
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

// Helper to map Task to TableTask
const mapTaskToTableTask = (task: Task) => ({
  id: String(task.id),
  name: task.name || task.title || "Untitled",
  assignee: task.assignee || { name: "Unassigned" },
  dueDate: task.dueDate || task.endDate || "",
  labels: task.labels || task.tags || [],
  comments: task.comments || 0,
  attachments: task.attachments || 0,
});
