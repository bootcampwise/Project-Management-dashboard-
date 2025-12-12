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
}

export interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface TemplateLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
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
}

export interface CalendarEvent {
  eventType: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
}
