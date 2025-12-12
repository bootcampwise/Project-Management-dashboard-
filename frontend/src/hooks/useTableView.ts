import { useState } from "react";
import type { TableGroup } from "../types";

export const useTableView = () => {
  // Mock Data matching BoardView data source
  const initialGroups: TableGroup[] = [
    {
      id: "1",
      title: "In progress",
      count: 3,
      color: "green",
      isCollapsed: false,
      tasks: [
        {
          id: "1",
          name: "Contact customers with failed new payments",
          assignee: {
            name: "John Doe",
            avatar: "https://i.pravatar.cc/150?u=1",
          },
          dueDate: "Oct 24",
          labels: [
            { text: "design", color: "text-orange-600", bg: "bg-orange-100" },
            { text: "web", color: "text-blue-600", bg: "bg-blue-100" },
          ],
          comments: 3,
          attachments: 2,
        },
        {
          id: "2",
          name: "Dashboard: concept",
          assignee: {
            name: "Jane Smith",
            avatar: "https://i.pravatar.cc/150?u=2",
          },
          dueDate: "Oct 25",
          labels: [
            { text: "ui", color: "text-purple-600", bg: "bg-purple-100" },
          ],
          comments: 5,
        },
      ],
    },
    {
      id: "2",
      title: "To Do",
      count: 2,
      color: "gray",
      isCollapsed: false,
      tasks: [
        {
          id: "3",
          name: "Extension: show totals",
          assignee: { name: "Mike Johnson" },
          dueDate: "Oct 26",
          labels: [
            { text: "feature", color: "text-green-600", bg: "bg-green-100" },
          ],
        },
        {
          id: "4",
          name: "Task detail modal",
          assignee: {
            name: "Sarah Wilson",
            avatar: "https://i.pravatar.cc/150?u=3",
          },
          dueDate: "Oct 27",
          labels: [
            { text: "design", color: "text-orange-600", bg: "bg-orange-100" },
          ],
          attachments: 1,
        },
      ],
    },
    {
      id: "3",
      title: "Completed",
      count: 1,
      color: "blue",
      isCollapsed: false,
      tasks: [
        {
          id: "5",
          name: "Reporting: Design concept of visual dashboard",
          assignee: {
            name: "Alex Brown",
            avatar: "https://i.pravatar.cc/150?u=4",
          },
          dueDate: "Oct 20",
          labels: [
            {
              text: "analytics",
              color: "text-indigo-600",
              bg: "bg-indigo-100",
            },
          ],
          comments: 8,
          attachments: 3,
        },
      ],
    },
  ];

  const [groups, setGroups] = useState<TableGroup[]>(initialGroups);

  const toggleGroup = (groupId: string) => {
    setGroups(
      groups.map((g) =>
        g.id === groupId ? { ...g, isCollapsed: !g.isCollapsed } : g
      )
    );
  };

  return {
    groups,
    toggleGroup,
  };
};
