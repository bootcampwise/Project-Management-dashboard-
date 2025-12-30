// ============================================
// DASHBOARD TYPES
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
