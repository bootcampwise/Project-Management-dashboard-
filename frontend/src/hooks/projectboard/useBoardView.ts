import React from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store";
import { updateTaskStatus } from "../../store/slices/taskSlice";
import type { DropResult } from "@hello-pangea/dnd";
import type { BoardColumnState } from "../../types";

// Default column configuration for the board view
const DEFAULT_COLUMNS: BoardColumnState[] = [
  {
    id: "BACKLOG",
    title: "Backlog",
    color: "gray",
    collapsed: false,
    isVisible: true,
  },
  {
    id: "TODO",
    title: "To Do",
    color: "blue",
    collapsed: false,
    isVisible: true,
  },
  {
    id: "IN_PROGRESS",
    title: "In Progress",
    color: "green",
    collapsed: false,
    isVisible: true,
  },
  {
    id: "IN_REVIEW",
    title: "In Review",
    color: "purple",
    collapsed: false,
    isVisible: true,
  },
  { id: "QA", title: "QA", color: "yellow", collapsed: false, isVisible: true },
  {
    id: "COMPLETED",
    title: "Completed",
    color: "indigo",
    collapsed: false,
    isVisible: true,
  },
  {
    id: "POSTPONE",
    title: "Postponed",
    color: "red",
    collapsed: false,
    isVisible: true,
  },
  {
    id: "CANCELED",
    title: "Canceled",
    color: "gray",
    collapsed: false,
    isVisible: true,
  },
];

export const useBoardView = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Column configuration with visibility state
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

    const newStatus = destination.droppableId;
    dispatch(updateTaskStatus({ id: draggableId, status: newStatus }));
  };

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
