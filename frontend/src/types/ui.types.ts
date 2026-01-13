import type React from "react";
import type { Task } from "./task.types";
import type { Project } from "./project.types";

export interface UiState {
  sidebarOpen: boolean;
  sidebarSections: {
    mobileApp: boolean;
    diadora: boolean;
  };

  isSettingsOpen: boolean;

  activeProject: Project | null;
  activeTab: string;
  isCreateProjectModalOpen: boolean;
  isTeamModalOpen: boolean;
  isTemplateLibraryOpen: boolean;

  selectedTask: Task | null;
  activeView: "kanban" | "list";

  timeFormat: "12h" | "24h";
}

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
  disabled?: boolean;
}

export interface NotificationsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface SearchPopupProps {
  isOpen: boolean;
  onClose: () => void;
  showProjects?: boolean;
}

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
}

export interface SortOption {
  key: string;
  label: string;
}

export interface SortControlProps {
  value: string;
  onChange: (value: string) => void;
  options: SortOption[];
  label?: string;
  className?: string;
}

export interface FilterOption {
  key: string;
  label: string;
  value: string | null;
}

export interface FilterControlProps {
  value: string | null;
  onChange: (value: string | null) => void;
  options: FilterOption[];
  label?: string;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "children"
> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export interface GlobalSearchProps {
  onClose?: () => void;
  className?: string;
  autoFocus?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  showProjects?: boolean;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  trend?: "positive" | "negative";
  trendText?: string;
  change?: string;
  icon?: React.ReactNode;
  className?: string;
}

export interface AuthButtonProps {
  icon: string;
  text: string;
  onClick?: () => void;
  disabled?: boolean;
}

export interface ToastProps {
  message: string;
  type?: "success" | "error" | "loading" | "info";
  duration?: number;
}

export interface TagProps {
  text: string;
  onRemove?: () => void;
  size?: "sm" | "md";
  className?: string;
  backgroundColor?: string;
  color?: string;
}

export interface StatusDotProps {
  color?: "green" | "red" | "blue" | "gray" | "yellow" | "orange" | "purple";
  size?: "xs" | "sm" | "md";
  className?: string;
}

export interface LetterIconProps {
  letter: string;
  size?: "sm" | "md" | "lg";
  color?: "gray" | "blue" | "green" | "red" | "purple";
  className?: string;
}

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  text?: string;
  variant?: "outline" | "filled" | "ghost";
  size?: "sm" | "md" | "lg";
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md";
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}

export interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

export interface DropdownItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
  header?: boolean;
  custom?: boolean;
  preventClose?: boolean;
  className?: string;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
  className?: string;
  menuClassName?: string;
}
