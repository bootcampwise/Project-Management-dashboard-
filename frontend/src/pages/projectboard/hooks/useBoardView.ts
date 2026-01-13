import React from "react";
import { useUpdateTaskStatusMutation } from "../../../store/api/taskApiSlice";
import type { DropResult } from "@hello-pangea/dnd";
import type { BoardColumnState, Task } from "../../../types";

const DEFAULT_COLUMNS: BoardColumnState[] = [
  {
    id: "BACKLOG",
    title: "Backlog",
    color: "bg-gray-500",
    collapsed: false,
    isVisible: false,
  },
  {
    id: "TODO",
    title: "To-Do",
    color: "bg-blue-500",
    collapsed: false,
    isVisible: true,
  },
  {
    id: "IN_PROGRESS",
    title: "In Progress",
    color: "bg-orange-500",
    collapsed: false,
    isVisible: true,
  },
  {
    id: "IN_REVIEW",
    title: "In Review",
    color: "bg-purple-500",
    collapsed: false,
    isVisible: true,
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
    color: "bg-green-500",
    collapsed: false,
    isVisible: true,
  },
  {
    id: "POSTPONE",
    title: "Postponed",
    color: "bg-amber-500",
    collapsed: false,
    isVisible: false,
  },
  {
    id: "CANCELED",
    title: "Cancelled",
    color: "bg-red-500",
    collapsed: false,
    isVisible: false,
  },
];

export const useBoardView = () => {
  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  const [columns, setColumns] =
    React.useState<BoardColumnState[]>(DEFAULT_COLUMNS);

  const [isAddSectionOpen, setIsAddSectionOpen] = React.useState(false);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as Task["status"];
    updateTaskStatus({ id: draggableId, status: newStatus });
  };

  const handleToggleColumn = (columnId: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, collapsed: !col.collapsed } : col,
      ),
    );
  };

  const handleHideColumn = (columnId: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, isVisible: false } : col,
      ),
    );
  };

  const handleShowColumn = (columnId: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, isVisible: true } : col,
      ),
    );
    setIsAddSectionOpen(false);
  };

  const visibleColumns = columns.filter((col) => col.isVisible);
  const hiddenColumns = columns.filter((col) => !col.isVisible);

  return {
    columns,
    visibleColumns,
    hiddenColumns,
    isAddSectionOpen,
    setIsAddSectionOpen,
    handleDragEnd,
    handleToggleColumn,
    handleHideColumn,
    handleShowColumn,
  };
};
