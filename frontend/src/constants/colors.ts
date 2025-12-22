/**
 * Centralized Color Constants for the Application
 * All color definitions should be imported from this file
 */

// ============================================
// STATUS COLORS (for task/kanban status)
// ============================================

export const STATUS_COLORS = {
  BACKLOG: "bg-gray-400",
  TODO: "bg-blue-500",
  IN_PROGRESS: "bg-green-500",
  IN_REVIEW: "bg-purple-500",
  QA: "bg-yellow-500",
  COMPLETED: "bg-indigo-500",
  POSTPONE: "bg-red-400",
  CANCELED: "bg-gray-500",
} as const;

// Hex colors for charts and non-Tailwind contexts
export const STATUS_HEX_COLORS = {
  TODO: "#3b82f6",
  IN_PROGRESS: "#f59e0b",
  COMPLETED: "#10b981",
  CANCELED: "#ef4444",
} as const;

// ============================================
// PRIORITY COLORS
// ============================================

export const PRIORITY_COLORS = {
  HIGH: "bg-red-100 text-red-600",
  URGENT: "bg-red-100 text-red-600",
  MEDIUM: "bg-yellow-100 text-yellow-600",
  LOW: "bg-green-100 text-green-600",
  DEFAULT: "bg-gray-100 text-gray-600",
} as const;

export const getPriorityColor = (priority: string): string => {
  const upperPriority = priority?.toUpperCase() as keyof typeof PRIORITY_COLORS;
  return PRIORITY_COLORS[upperPriority] || PRIORITY_COLORS.DEFAULT;
};

// ============================================
// TABLE GROUP COLORS
// ============================================

export const GROUP_COLORS = {
  gray: "gray",
  blue: "blue",
  green: "green",
  purple: "purple",
  yellow: "yellow",
  indigo: "indigo",
  red: "red",
} as const;

// ============================================
// CALENDAR EVENT COLORS
// ============================================

export const CALENDAR_EVENT_COLORS = {
  yellow: "bg-orange-50 text-orange-700 border-l-[3px] border-orange-300",
  pink: "bg-rose-50 text-rose-700 border-l-[3px] border-rose-300",
  blue: "bg-blue-50 text-blue-700 border-l-[3px] border-blue-300",
  green: "bg-emerald-50 text-emerald-700 border-l-[3px] border-emerald-300",
  teal: "bg-teal-50 text-teal-700 border-l-[3px] border-teal-300",
  gray: "bg-gray-100 text-gray-700 border-l-[3px] border-gray-400",
  default: "bg-gray-100 text-gray-800",
} as const;

export const getCalendarEventColorClass = (color: string): string => {
  const colorKey = color as keyof typeof CALENDAR_EVENT_COLORS;
  return CALENDAR_EVENT_COLORS[colorKey] || CALENDAR_EVENT_COLORS.default;
};

// ============================================
// COLUMN CONFIGURATION (combines ID, title, color)
// ============================================

export interface ColumnConfig {
  id: string;
  title: string;
  color: string;
  collapsed: boolean;
  isVisible: boolean;
}

export const DEFAULT_COLUMNS: ColumnConfig[] = [
  {
    id: "BACKLOG",
    title: "Backlog",
    color: STATUS_COLORS.BACKLOG,
    collapsed: false,
    isVisible: false,
  },
  {
    id: "TODO",
    title: "Todo",
    color: STATUS_COLORS.TODO,
    collapsed: false,
    isVisible: true,
  },
  {
    id: "IN_PROGRESS",
    title: "In progress",
    color: STATUS_COLORS.IN_PROGRESS,
    collapsed: false,
    isVisible: true,
  },
  {
    id: "IN_REVIEW",
    title: "In Review",
    color: STATUS_COLORS.IN_REVIEW,
    collapsed: false,
    isVisible: false,
  },
  {
    id: "QA",
    title: "QA",
    color: STATUS_COLORS.QA,
    collapsed: false,
    isVisible: false,
  },
  {
    id: "COMPLETED",
    title: "Completed",
    color: STATUS_COLORS.COMPLETED,
    collapsed: false,
    isVisible: true,
  },
  {
    id: "POSTPONE",
    title: "Postpone",
    color: STATUS_COLORS.POSTPONE,
    collapsed: false,
    isVisible: false,
  },
  {
    id: "CANCELED",
    title: "Canceled",
    color: STATUS_COLORS.CANCELED,
    collapsed: false,
    isVisible: true,
  },
];

// Simple column config for charts (without visibility state)
export const SIMPLE_COLUMN_CONFIG = [
  { id: "TODO", title: "To-Do", color: STATUS_HEX_COLORS.TODO },
  {
    id: "IN_PROGRESS",
    title: "In Progress",
    color: STATUS_HEX_COLORS.IN_PROGRESS,
  },
  { id: "COMPLETED", title: "Completed", color: STATUS_HEX_COLORS.COMPLETED },
  { id: "CANCELED", title: "Cancelled", color: STATUS_HEX_COLORS.CANCELED },
];

// ============================================
// CHART COLORS (for BudgetChart, etc.)
// ============================================

export const CHART_COLORS = {
  budget: "#93C5FD",
  expenses: "#004e76",
  budgetGradientStop1: "rgba(147, 197, 253, 0.3)",
  budgetGradientStop2: "rgba(147, 197, 253, 0)",
  expensesGradientStop1: "rgba(0, 78, 118, 0.3)",
  expensesGradientStop2: "rgba(0, 78, 118, 0)",
} as const;

// ============================================
// ICON COLORS (for ProjectEarning, etc.)
// ============================================

export const ICON_COLORS = {
  teal: "bg-teal-100 text-teal-600",
  blue: "bg-blue-100 text-blue-600",
  orange: "bg-orange-100 text-orange-600",
  gray: "bg-gray-100 text-gray-600",
} as const;

// ============================================
// UI COLORS
// ============================================

export const UI_COLORS = {
  // Success/Error states
  success: "bg-green-50 text-green-600",
  error: "bg-red-50 text-red-600",
  warning: "bg-yellow-50 text-yellow-600",
  info: "bg-blue-50 text-blue-600",

  // Trend indicators
  trendPositive: "bg-green-50 text-green-600",
  trendNegative: "bg-red-50 text-red-600",
} as const;

// ============================================
// TAG COLORS (for task tags/labels)
// ============================================

export const TAG_COLORS = [
  { bg: "bg-red-100", text: "text-red-700" },
  { bg: "bg-orange-100", text: "text-orange-700" },
  { bg: "bg-amber-100", text: "text-amber-700" },
  { bg: "bg-green-100", text: "text-green-700" },
  { bg: "bg-emerald-100", text: "text-emerald-700" },
  { bg: "bg-teal-100", text: "text-teal-700" },
  { bg: "bg-cyan-100", text: "text-cyan-700" },
  { bg: "bg-blue-100", text: "text-blue-700" },
  { bg: "bg-indigo-100", text: "text-indigo-700" },
  { bg: "bg-violet-100", text: "text-violet-700" },
  { bg: "bg-purple-100", text: "text-purple-700" },
  { bg: "bg-fuchsia-100", text: "text-fuchsia-700" },
  { bg: "bg-pink-100", text: "text-pink-700" },
  { bg: "bg-rose-100", text: "text-rose-700" },
] as const;

// Get consistent color for a tag based on its text (hash function)
export const getTagColor = (tag: string): { bg: string; text: string } => {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % TAG_COLORS.length;
  return TAG_COLORS[index];
};

// Get tag classes (bg + text) as a single string
export const getTagClasses = (tag: string): string => {
  const { bg, text } = getTagColor(tag);
  return `${bg} ${text}`;
};
