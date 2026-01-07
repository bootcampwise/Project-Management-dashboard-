import type { Task } from "./task.types";
import type { Project } from "./project.types";

export interface TopTasksMember {
  id: string;
  name: string;
  role?: string;
  tasksCompleted: number;
  avatar?: string;
  avatarColor?: string;
}

export interface TopCompletedTasksProps {
  members: TopTasksMember[];
  isLoading?: boolean;
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

export type TimeRange = "D" | "W" | "M" | "6M" | "Y";

export interface StatsGridProps {
  tasks: Task[];
  range?: TimeRange;
  date?: Date;
}

export interface CompletionChartProps {
  tasks?: Task[];
  projects?: Project[];
  range?: TimeRange;
  date?: Date;
}

export interface ScheduleCalendarProps {
  projectId?: string;
}

export interface LatestTasksProps {
  tasks: Task[];
}

export interface BudgetChartProps {
  tasks?: Task[];
  projects?: Project[];
  range?: TimeRange;
  date?: Date;
}
