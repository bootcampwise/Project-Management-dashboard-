import React from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store";
import { updateTaskStatus } from "../../store/slices/taskSlice";
import type { DropResult } from "@hello-pangea/dnd";
import type { BoardColumnState } from "../../types";
import { DEFAULT_COLUMNS } from "../../constants/colors";

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
