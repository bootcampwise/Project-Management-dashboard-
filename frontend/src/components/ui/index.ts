// UI Components Library
// Centralized reusable components for consistent UI

// Re-export types from central types file
export type {
  ButtonProps,
  InputProps,
  TextareaProps,
  SelectProps,
  SelectOption,
  ModalProps,
  DropdownProps,
  DropdownItem,
  AvatarProps,
  BadgeProps,
  StatCardProps,
  StatusDotProps,
  TagProps,
  IconButtonProps,
  LetterIconProps,
  ToastProps,
} from "../../types";

// Form Components
export { Button } from "./Button";
export { Input } from "./Input";
export { Textarea } from "./Textarea";
export { Select } from "./Select";

// Layout Components
export { Modal } from "./Modal";
export { Dropdown } from "./Dropdown";

// Display Components
export { Avatar } from "./Avatar";
export { Badge } from "./Badge";
export { StatCard } from "./StatCard";
export { StatusDot } from "./StatusDot";
export { Tag, getTagColor } from "./Tag";

// Icon Components
export { IconButton } from "./IconButton";
export { default as AuthButton } from "./AuthButton";
export { LetterIcon } from "./LetterIcon";

// Feedback Components
export { showToast, Toaster, getErrorMessage } from "./Toast";

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
