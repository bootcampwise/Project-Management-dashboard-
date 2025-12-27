// UI Components Library
// Centralized reusable components for consistent UI

// Form Components
export { Button, type ButtonProps } from "./Button";
export { Input, type InputProps } from "./Input";
export { Textarea, type TextareaProps } from "./Textarea";
export { Select, type SelectProps, type SelectOption } from "./Select";

// Layout Components
export { Modal, type ModalProps } from "./Modal";
export { Dropdown, type DropdownProps, type DropdownItem } from "./Dropdown";

// Display Components
export { Avatar, type AvatarProps } from "./Avatar";
export { Badge, type BadgeProps } from "./Badge";
export { StatCard, type StatCardProps } from "./StatCard";
export { StatusDot, type StatusDotProps } from "./StatusDot";
export { Tag, type TagProps, getTagColor } from "./Tag";

// Icon Components
export { IconButton, type IconButtonProps } from "./IconButton";
export { default as AuthButton } from "./AuthButton";
export { LetterIcon, type LetterIconProps } from "./LetterIcon";

// Feedback Components
export { showToast, Toaster, getErrorMessage, type ToastProps } from "./Toast";

// Skeleton Components (Loading States)
export {
  Skeleton,
  TaskCardSkeleton,
  KanbanColumnSkeleton,
  KanbanBoardSkeleton,
  ProjectHeaderSkeleton,
  TabsSkeleton,
  TeamMemberSkeleton,
  TeamMembersListSkeleton,
  FileRowSkeleton,
  FilesListSkeleton,
  ProjectBoardSkeleton,
  TeamPageSkeleton,
  TableRowSkeleton,
  TableSkeleton,
  SidebarItemSkeleton,
  SidebarSubmenuSkeleton,
  SidebarSkeleton,
  // Dashboard skeletons
  StatCardSkeleton,
  StatsGridSkeleton,
  CompletionChartSkeleton,
  ScheduleCalendarSkeleton,
  LatestTasksRowSkeleton,
  LatestTasksSkeleton,
  BudgetChartSkeleton,
  DashboardSkeleton,
} from "./Skeleton";
