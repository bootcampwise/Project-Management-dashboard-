// ============================================
// BARREL EXPORT - All Types
// ============================================

// User & Auth Types
export type { User, AuthState, MemberItem } from "./user.types";

// Task Types
export type {
  Attachment,
  SubTask,
  Comment,
  Task,
  TableTask,
  TableGroup,
  TableViewProps,
  ExtendedTableViewProps,
  AttachmentMetadata,
  CreateTaskPayload,
  TaskState,
  TaskCardProps,
  TaskCardComponentProps,
  TaskDetailHeaderProps,
  TaskPropertiesProps,
  TaskDescriptionProps,
  TaskAttachmentsProps,
  TaskSubtasksProps,
  TaskCommentsProps,
  TaskDetailModalProps,
  CreateTaskModalProps,
  UseTaskDetailModalProps,
  UseCreateTaskModalProps,
  LatestTask,
} from "./task.types";

// Project Types
export type {
  Project,
  CreateProjectPayload,
  ProjectState,
  ProjectEarning,
  CreateProjectModalProps,
  TemplateLibraryModalProps,
  UseCreateProjectModalProps,
} from "./project.types";

// Team Types
export type {
  TeamMember,
  Team,
  TeamState,
  TeamFile,
  CreateTeamPayload,
  UpdateTeamPayload,
  CreateTeamModalProps,
  TeamProjectsProps,
  TeamMembersProps,
  TeamFilesProps,
  TeamStatCardProps,
  TeamTableViewProps,
} from "./team.types";

// Calendar Types
export type {
  CalendarTask,
  CalendarEvent,
  ScheduleCalendarTab,
  EventType,
  CalendarEventApi,
  CreateEventPayload,
  UpdateEventPayload,
  CalendarViewProps,
  TimelineViewProps,
  AddEventModalProps,
  UseAddEventModalProps,
  UseTimelineViewProps,
  UseCalendarViewProps,
} from "./calendar.types";

// Board Types
export type {
  BoardColumn,
  BoardViewProps,
  BoardColumnProps,
  BoardColumnState,
} from "./board.types";

// UI Types
export type {
  UiState,
  SidebarProps,
  SidebarItemProps,
  NotificationsPopupProps,
  SearchPopupProps,
  SettingsModalProps,
  ModalProps,
  SortOption,
  SortControlProps,
  FilterOption,
  FilterControlProps,
  SelectOption,
  SelectProps,
  InputProps,
  TextareaProps,
  SkeletonProps,
  GlobalSearchProps,
  StatCardProps,
  AuthButtonProps,
  ToastProps,
  TagProps,
  StatusDotProps,
  LetterIconProps,
  IconButtonProps,
  ButtonProps,
  BadgeProps,
  AvatarProps,
  DropdownItem,
  DropdownProps,
} from "./ui.types";

// API Types
export type {
  ApiRequest,
  ApiError,
  UploadFileParams,
  DeleteFileParams,
  UploadResult,
  CacheItem,
} from "./api.types";

// Dashboard Types
export type {
  TopTasksMember,
  DashboardStatCardProps,
  ChartTooltipProps,
} from "./dashboard.types";
