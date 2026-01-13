import type { Task } from "./task.types";

export interface BoardColumn {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
}

export interface BoardViewProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (task: Task) => void;
  onAddTask?: (status: string) => void;
  visibleFields?: Record<string, boolean>;
  cardVariant?: "simple" | "detailed";
  currentUserId?: string;
  isTeamMember?: boolean;
}

export interface BoardColumnProps {
  title: string;
  count: number;
  color: string;
  tasks: Task[];
  status?: string;
  collapsed?: boolean;
  onTaskClick?: (task: Task) => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (task: Task) => void;
  onAddTask?: (status: string) => void;
  onToggle?: () => void;
  onHide?: () => void;
  visibleFields?: Record<string, boolean>;
  cardVariant?: "simple" | "detailed";
  currentUserId?: string;
  isTeamMember?: boolean;
}

export interface BoardColumnState {
  id: string;
  title: string;
  color: string;
  collapsed: boolean;
  isVisible: boolean;
}
