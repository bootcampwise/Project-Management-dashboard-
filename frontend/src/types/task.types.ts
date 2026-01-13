import type React from "react";
import type { User, MemberItem } from "./user.types";

export interface Attachment {
  id: string;
  name: string;
  url: string;
  size?: number | string;
  mimeType?: string;
  createdAt?: string;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  createdAt?: string;
  createdBy?: {
    id: string;
    name: string;
    avatar?: string;
  };
  assignees?: {
    id: string;
    name: string;
    avatar?: string;
  }[];
}

export interface Comment {
  id: string;
  content: string;
  author?: {
    name: string;
    avatar?: string;
  };
  createdAt: string;
}

export interface Task {
  id: number | string;
  name: string;
  title?: string;
  project: string | { id: string; name: string };
  subtasks: number | SubTask[];
  status:
    | "BACKLOG"
    | "TODO"
    | "IN_PROGRESS"
    | "IN_REVIEW"
    | "QA"
    | "COMPLETED"
    | "CANCELED"
    | "POSTPONE";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";

  startDate: string;
  endDate: string;
  dueDate?: string;
  tags?: { id: string; text: string; color: string; bg: string }[];
  labels?: { text: string; color: string; bg: string }[];
  assignee?: { name: string; avatar?: string };
  assignees?: User[];
  comments?: number | Comment[];
  attachments?: number | Attachment[];
  date?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  creator?: { id: string; name: string; avatar?: string };
  actualCost?: number;
  estimatedCost?: number;
}

export interface TableTask {
  id: string;
  name: string;
  assignee: { name: string; avatar?: string };
  dueDate: string;
  labels: { text: string; color: string; bg: string }[];
  comments?: number;
  attachments?: number;
  creator?: { id: string; name: string; avatar?: string };
  status?: string;
  priority?: string;
}

export interface TableGroup {
  id: string;
  title: string;
  count: number;
  color: string;
  tasks: TableTask[];
  isCollapsed?: boolean;
}

export interface TableViewProps {
  onTaskClick?: (task: TableTask) => void;
}

export interface ExtendedTableViewProps extends TableViewProps {
  tasks?: Task[];
  visibleFields?: Record<string, boolean>;
  onAddTask?: (status: string) => void;
}

export interface AttachmentMetadata {
  name: string;
  filePath: string;
  size: number;
  mimeType: string;
}

export interface CreateTaskPayload {
  title: string;
  status: string;
  priority: string;
  tags: string[];
  description: string;
  attachments: File[] | AttachmentMetadata[];
  projectId: string;
  dueDate?: string;
  assigneeIds?: string[];
  actualCost?: number;
}

export interface TaskState {
  activeView: "kanban" | "list";
  columns: { id: string; title: string; color: string; tasks: Task[] }[];
  selectedTask: Task | null;
  isCreateTaskModalOpen: boolean;
  modalInitialStatus: string | undefined;
}

export interface TaskCardProps {
  task: Task;
  onClick?: (task: Task) => void;
}

export interface TaskCardComponentProps {
  title: string;
  project?: string;
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  tags?: { text: string; color: string; bg: string }[];
  assignee: { name: string; avatar?: string };
  assignees?: { name: string; avatar?: string }[];
  comments?: number;
  attachments?: number;
  subtasks?: number;
  completedSubtasks?: number;
  date?: string;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  visibleFields?: Record<string, boolean>;
  variant?: "simple" | "detailed";
  isTaskCreator?: boolean;
  isTeamMember?: boolean;
}

export interface TaskDetailHeaderProps {
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
  isTeamMember?: boolean;
}

export interface TaskPropertiesProps {
  task: Task;
  onAddTag: (tag: string) => void;
  isTeamMember?: boolean;
  isSubmitting?: boolean;
}

export interface TaskDescriptionProps {
  description?: string;
}

export interface TaskAttachmentsProps {
  attachments: Attachment[];
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDownload: (e: React.MouseEvent, attachment: Attachment) => void;
  isTeamMember?: boolean;
}

export interface TaskSubtasksProps {
  subtasks: SubTask[];
  newSubtask: string;
  setNewSubtask: (value: string) => void;
  filteredTeamMembers: MemberItem[];
  subtaskAssigneeSearch: string;
  setSubtaskAssigneeSearch: (value: string) => void;
  onAddSubtask: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onAssign: (
    subtaskId: string,
    userId: string,
    action: "add" | "remove",
  ) => void;
  isTeamMember?: boolean;
  isSubmitting?: boolean;
}

export interface TaskCommentsProps {
  comments: Comment[];
  user?: User | null;
  newComment: string;
  setNewComment: (value: string) => void;
  onAddComment: () => void;
  isSubmitting: boolean;
  isTeamMember?: boolean;
}

export interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onEdit?: (task: Task) => void;
  isTeamMember?: boolean;
}

export interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate?: (taskData: CreateTaskPayload) => void;
  onUpdate?: (
    taskId: string,
    taskData: CreateTaskPayload,
  ) => void | Promise<void>;
  initialStatus?: string;
  task?: Task | null;
}

export interface UseTaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onEdit?: (task: Task) => void;
}

export interface UseCreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate?: (taskData: CreateTaskPayload) => void | Promise<void>;
  onUpdate?: (
    taskId: string,
    taskData: CreateTaskPayload,
  ) => void | Promise<void>;
  initialStatus?: string;
  task?: Task | null;
}

export interface LatestTask {
  id: number;
  name: string;
  project: string;
  subtasks: string;
  status: string;
  priority: string;
  startDate: string;
  endDate: string;
}
