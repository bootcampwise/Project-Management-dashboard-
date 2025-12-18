import React from "react";

// Global Types for the Application

// ============================================
// TASK TYPES
// ============================================

export interface Task {
  id: number | string;
  name: string;
  title?: string; // Alias for name, used in some components
  project: string;
  subtasks: string | number;
  status: "To-Do" | "Completed" | "In Progress";
  priority: "High" | "Medium" | "Low";

  startDate: string;
  endDate: string;
  dueDate?: string;
  tags?: { text: string; color: string; bg: string }[];
  labels?: { text: string; color: string; bg: string }[];
  assignee?: { name: string; avatar?: string };
  assignees?: string[]; // For Tasks page with multiple assignees
  comments?: number;
  attachments?: number;
  date?: string;
  description?: string;
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

// ============================================
// BOARD VIEW TYPES
// ============================================

export interface BoardViewProps {
  onTaskClick?: (task: Task) => void;
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
}

export interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTemplateLibrary: () => void;
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

export interface CreateTaskPayload {
  title: string;
  status: string;
  priority: string;
  tags: string[];
  description: string;
  attachments: File[];
  projectId: string;
  dueDate?: string;
}

export interface CalendarEvent {
  eventType: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
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
  tags?: { text: string; color: string; bg: string }[];
  assignee: { name: string; avatar?: string };
  comments: number;
  attachments: number;
  date: string;
  onClick?: () => void;
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
    members?: { avatar?: string }[];
    status?: string;
    priority?: string;
    startDate?: string;
    endDate?: string;
    progress?: number;
  }[];
  startDate?: string;
  endDate?: string;
  priority?: "High" | "Medium" | "Low";
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
}

export interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate?: (taskData: CreateTaskPayload) => void;
  initialStatus?: string;
}

export interface TeamFile {
  id: number;
  name: string;
  type: "pdf" | "image" | "ppt";
  size: string;
  date: string;
  author: {
    name: string;
    avatar: string;
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
  collapsed?: boolean;
  onTaskClick?: (task: Task) => void;
  onAddTask?: (status: string) => void;
}

export interface TeamTableViewProps {
  projectId?: string;
}
