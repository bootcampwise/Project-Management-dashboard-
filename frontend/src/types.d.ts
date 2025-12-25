import React from "react";

// Global Types for the Application

// ============================================
// TASK TYPES
// ============================================

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
  creator?: { id: string; name: string; avatar?: string };
}

// ============================================
// TABLE VIEW TYPES
// ============================================

export interface TableTask {
  id: string;
  name: string;
  assignee: { name: string; avatar?: string };
  dueDate: string;
  labels: { text: string; color: string; bg: string }[];
  comments?: number;
  attachments?: number;
  // Added fields to support instant TaskDetailModal display
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

// CALENDAR VIEW TYPES
// ============================================

export interface CalendarTask {
  id: number | string;
  title: string;
  time?: string;
  color: string;
  category?: string;
  date?: Date; // For CalendarView date-based filtering
}

export interface CalendarViewProps {
  projectId?: string;
}

export interface TimelineViewProps {
  projectId?: string;
}

// ============================================
// BOARD VIEW TYPES
// ============================================

export interface BoardViewProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onAddTask?: (status: string) => void;
}

export interface BoardColumn {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
}

// ============================================
// SIDEBAR TYPES
// ============================================

export interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export interface SidebarItemProps {
  label: string;
  icon?: React.ElementType;
  isActive?: boolean;
  hasSubmenu?: boolean;
  isOpen?: boolean;
  indent?: number;
  onClick?: () => void;
  badge?: string | React.ReactNode;
  to?: string;
}

// ============================================
// MODAL TYPES
// ============================================

export interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onEdit?: (task: Task) => void;
}

export interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTemplateLibrary: () => void;
  onCreate: (data: CreateProjectPayload) => Promise<void>;
}

export interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface TemplateLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: () => void;
}

// ============================================
// COMPONENT PROPS TYPES
// ============================================

export interface TaskCardProps {
  task: Task;
  onClick?: (task: Task) => void;
}

export interface AuthButtonProps {
  icon: string;
  text: string;
  onClick?: () => void;
  disabled?: boolean;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon?: React.ReactNode;
}

// ============================================
// CREATE TASK & EVENT TYPES
// ============================================

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
}

export interface CalendarEvent {
  id?: string;
  eventType: string;
  title?: string; // Added for API compatibility
  date: string;
  startTime: string;
  endTime: string;
  description?: string;
  projectId?: string;
}

// ============================================
// REDUX SLICE STATE TYPES
// ============================================

export interface UiState {
  sidebarOpen: boolean;
  isSettingsOpen: boolean;
  sidebarSections: {
    mobileApp: boolean;
    diadora: boolean;
  };
  theme: "light" | "dark";
}

// ============================================
// COMPONENT-SPECIFIC TYPES
// ============================================

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
  date?: string;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export interface Project {
  id: string;
  name: string;
  key: string;
  description?: string;
  icon?: string;
  color?: string;
  progress?: number;
  status?: string;
  members?: { id: string; name: string; avatar?: string }[];
  teams?: {
    id: string;
    name: string;
    avatar?: string;
    members?: { id: string; name: string; avatar?: string }[];
    status?: string;
    priority?: string;
    startDate?: string;
    endDate?: string;
    progress?: number;
  }[];
  startDate?: string;
  endDate?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProjectPayload {
  name: string;
  description: string;
  dueDate?: string;
  teamId?: string;
  privacy: "public" | "private" | "team";
}

export interface ProjectState {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  activeTab: string;
  isCreateModalOpen: boolean;
  isTeamModalOpen: boolean;
  isTemplateLibraryOpen: boolean;
  activeProject: Project | null;
  files: TeamFile[];
}

export interface TaskState {
  activeView: "kanban" | "list";
  columns: BoardColumn[];
  selectedTask: Task | null;
  isCreateTaskModalOpen: boolean;
  modalInitialStatus: string | undefined;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  jobTitle?: string;
  department?: string;
  hasCompletedOnboarding?: boolean;
  createdAt?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface Team {
  id: string;
  name: string;
  projectId?: string;
  memberIds: string[];
  members?: TeamMember[];
  status?: string;
  priority?: string;
  startDate?: string;
  endDate?: string;
  progress?: number;
  createdAt: string;
}

export interface TeamMember {
  id: number | string;
  name: string;
  email: string;
  position: string;
  groups: string[];
  location: string;
  avatar: string;
}

export type ScheduleCalendarTab = "Events" | "Meetings" | "Holidays";

export interface NotificationsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface TeamState {
  members: TeamMember[];
  teams: Team[];
  isLoading: boolean;
  error: string | null;
}

export interface SearchPopupProps {
  isOpen: boolean;
  onClose: () => void;
}
export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string;
}

export interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (event: CalendarEvent) => void;
  onUpdate?: (event: CalendarEvent) => void;
  projectId?: string;
  event?: {
    id: string;
    title: string;
    type: string;
    start: string;
    end?: string;
    description?: string;
  } | null;
}

export interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate?: (taskData: CreateTaskPayload) => void;
  onUpdate?: (
    taskId: string,
    taskData: CreateTaskPayload
  ) => void | Promise<void>;
  initialStatus?: string;
  task?: Task | null;
}

export interface TeamFile {
  id: string; // Changed from number
  name: string;
  type: string; // broadened from literal union for safety, can narrow later
  size: number | string;
  date: string | Date; // Backend sends Date string usually
  url?: string; // URL to open the file
  filePath?: string; // from backend
  mimeType?: string;
  task?: {
    id: string;
    title: string;
    creator?: {
      name: string;
      avatar?: string;
    };
  };
  createdAt?: string;
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface ProjectEarning {
  id: string;
  name: string;
  completedTasks: number;
  earning: number;
  iconColor: "teal" | "blue" | "orange" | "gray";
}

export interface TeamStatCardProps {
  title: string;
  value: string | number;
  percentage: string;
  percentageColor: "blue" | "red" | "gray";
}

export interface BoardColumnProps {
  title: string;
  count: number;
  color: string;
  tasks: Task[];
  status?: string; // Added status ID prop
  collapsed?: boolean;
  onTaskClick?: (task: Task) => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (task: Task) => void;
  onAddTask?: (status: string) => void;
  onToggle?: () => void;
  onHide?: () => void;
}

export interface TeamTableViewProps {
  projectId?: string;
}

// ============================================
// HOOK PROPS TYPES
// ============================================

export interface UseTaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onEdit?: (task: Task) => void;
}

export interface UseCreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreateProjectPayload) => Promise<void>;
}

export interface UseCreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate?: (taskData: CreateTaskPayload) => void | Promise<void>;
  onUpdate?: (
    taskId: string,
    taskData: CreateTaskPayload
  ) => void | Promise<void>;
  initialStatus?: string;
  task?: Task | null;
}

export interface UseAddEventModalProps {
  onClose: () => void;
  onAdd?: (event: CalendarEvent) => void;
  onUpdate?: (event: CalendarEvent) => void;
  projectId?: string;
  event?: {
    id: string;
    title: string;
    type: string;
    start: string;
    end?: string;
    description?: string;
  } | null;
}

export interface BoardColumnState {
  id: string;
  title: string;
  color: string;
  collapsed: boolean;
  isVisible: boolean;
}

// ============================================
// DASHBOARD COMPONENT TYPES
// ============================================

export interface TopTasksMember {
  id: string;
  name: string;
  role: string;
  tasksCompleted: number;
  avatar?: string;
}

export interface DashboardStatCardProps {
  title: string;
  count: string | number;
  trend: "positive" | "negative";
  points: string | number;
}

export interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string }>;
  label?: string;
}
