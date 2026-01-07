import React from "react";
import type { SkeletonProps } from "../../types";

export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  style,
}) => (
  <div
    className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
    style={style}
  />
);

export const TaskCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 space-y-3">
    <div className="flex justify-between items-start">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-4 rounded-full" />
    </div>
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-2/3" />
    <div className="flex items-center justify-between pt-2">
      <div className="flex -space-x-2">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>
  </div>
);

export const KanbanColumnSkeleton: React.FC = () => (
  <div className="flex-shrink-0 w-72 bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-5 w-8 rounded-full" />
    </div>
    <div className="space-y-3">
      <TaskCardSkeleton />
      <TaskCardSkeleton />
      <TaskCardSkeleton />
    </div>
  </div>
);

export const KanbanBoardSkeleton: React.FC = () => (
  <div className="flex gap-4 overflow-x-auto p-4">
    <KanbanColumnSkeleton />
    <KanbanColumnSkeleton />
    <KanbanColumnSkeleton />
    <KanbanColumnSkeleton />
  </div>
);

export const ProjectHeaderSkeleton: React.FC = () => (
  <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
    <div className="flex items-center gap-3">
      <Skeleton className="h-10 w-10 rounded-lg" />
      <div>
        <Skeleton className="h-6 w-40 mb-2" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
    <div className="flex items-center gap-2">
      <Skeleton className="h-9 w-20 rounded-lg" />
      <Skeleton className="h-9 w-9 rounded-lg" />
    </div>
  </div>
);

export const TabsSkeleton: React.FC = () => (
  <div className="flex gap-2 p-4 border-b border-gray-200 dark:border-gray-700">
    <Skeleton className="h-9 w-20 rounded-lg" />
    <Skeleton className="h-9 w-20 rounded-lg" />
    <Skeleton className="h-9 w-20 rounded-lg" />
    <Skeleton className="h-9 w-20 rounded-lg" />
  </div>
);

export const TeamMemberSkeleton: React.FC = () => (
  <div className="flex items-center gap-4 p-4 border-b border-gray-100 dark:border-gray-700">
    <Skeleton className="h-10 w-10 rounded-full" />
    <div className="flex-1">
      <Skeleton className="h-4 w-32 mb-2" />
      <Skeleton className="h-3 w-48" />
    </div>
    <Skeleton className="h-6 w-20 rounded-full" />
  </div>
);

export const TeamMembersListSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
    <TeamMemberSkeleton />
    <TeamMemberSkeleton />
    <TeamMemberSkeleton />
    <TeamMemberSkeleton />
    <TeamMemberSkeleton />
  </div>
);

export const FileRowSkeleton: React.FC = () => (
  <div className="grid grid-cols-[2.5fr_1fr_1fr_1.5fr] gap-4 px-6 h-[43px] items-center bg-white dark:bg-gray-900">
    <div className="flex items-center gap-3">
      <Skeleton className="h-5 w-5 rounded" />
      <Skeleton className="h-4 w-48" />
    </div>
    <Skeleton className="h-4 w-16" />
    <Skeleton className="h-4 w-24" />
    <div className="flex items-center gap-3">
      <Skeleton className="h-8 w-8 rounded-full" />
      <Skeleton className="h-4 w-24" />
    </div>
  </div>
);

export const FilesListSkeleton: React.FC = () => (
  <div className="flex flex-col gap-[2px] bg-gray-50 dark:bg-gray-800">
    <FileRowSkeleton />
    <FileRowSkeleton />
    <FileRowSkeleton />
    <FileRowSkeleton />
    <FileRowSkeleton />
  </div>
);

export const ProjectBoardSkeleton: React.FC = () => (
  <div className="flex-1 flex flex-col">
    <ProjectHeaderSkeleton />
    <TabsSkeleton />
    <KanbanBoardSkeleton />
  </div>
);

export const TeamPageSkeleton: React.FC = () => (
  <div className="flex-1 flex flex-col">
    <ProjectHeaderSkeleton />
    <TabsSkeleton />
    <div className="p-4">
      <TeamMembersListSkeleton />
    </div>
  </div>
);

export const TableRowSkeleton: React.FC = () => (
  <div className="grid grid-cols-6 gap-4 px-4 py-3 border-b border-gray-100 dark:border-gray-700">
    <Skeleton className="h-4 w-full col-span-2" />
    <Skeleton className="h-4 w-20" />
    <Skeleton className="h-4 w-24" />
    <Skeleton className="h-6 w-6 rounded-full" />
    <Skeleton className="h-5 w-16 rounded-full" />
  </div>
);

export const TableSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
    <div className="grid grid-cols-6 gap-4 px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
      <Skeleton className="h-4 w-16 col-span-2" />
      <Skeleton className="h-4 w-12" />
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-4 w-12" />
    </div>
    <TableRowSkeleton />
    <TableRowSkeleton />
    <TableRowSkeleton />
    <TableRowSkeleton />
    <TableRowSkeleton />
  </div>
);

export const SidebarItemSkeleton: React.FC<{ indent?: number }> = ({
  indent = 0,
}) => (
  <div
    className={`flex items-center gap-3 px-4 py-2 ${
      indent ? "pl-" + (indent + 4) : ""
    }`}
  >
    <Skeleton className="h-4 w-4 rounded" />
    <Skeleton className="h-4 w-24" />
  </div>
);

export const SidebarSubmenuSkeleton: React.FC<{ count?: number }> = ({
  count = 3,
}) => (
  <div className="space-y-1 pl-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-center gap-2 px-4 py-1.5">
        <Skeleton className="h-3 w-3 rounded" />
        <Skeleton className="h-3 w-20" />
      </div>
    ))}
  </div>
);

export const SidebarSkeleton: React.FC = () => (
  <div className="flex flex-col h-full">
    <div className="h-14 px-4 flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-6 rounded" />
        <Skeleton className="h-4 w-28" />
      </div>
      <Skeleton className="h-8 w-8 rounded" />
    </div>

    <div className="px-2 space-y-1">
      <SidebarItemSkeleton />
      <SidebarItemSkeleton />
      <SidebarItemSkeleton />
      <SidebarItemSkeleton />
    </div>

    <div className="px-2 mt-6">
      <div className="px-4 mb-2">
        <Skeleton className="h-3 w-20" />
      </div>
      <SidebarItemSkeleton />
      <SidebarSubmenuSkeleton count={2} />

      <div className="h-2" />
      <SidebarItemSkeleton />
      <SidebarSubmenuSkeleton count={3} />
    </div>

    <div className="mt-auto p-2 border-t border-gray-200 dark:border-gray-700">
      <SidebarItemSkeleton />
      <SidebarItemSkeleton />
    </div>
  </div>
);

export const StatCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col gap-2">
    <Skeleton className="h-4 w-20" />
    <Skeleton className="h-8 w-16" />
    <Skeleton className="h-3 w-32" />
  </div>
);

export const StatsGridSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[10px] p-[1px]">
    <StatCardSkeleton />
    <StatCardSkeleton />
    <StatCardSkeleton />
    <StatCardSkeleton />
  </div>
);

export const CompletionChartSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100/60 dark:border-gray-700/60 p-4 flex flex-col justify-between w-full lg:w-[304px] h-auto min-h-[337px]">
    <div className="flex flex-col gap-1">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-3 w-32" />
    </div>
    <div className="flex-1 flex items-center justify-center">
      <Skeleton className="h-[180px] w-[180px] rounded-full" />
    </div>
    <div className="flex flex-col gap-2 pt-2">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  </div>
);

export const ScheduleCalendarSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100/60 dark:border-gray-700/60 p-4 flex flex-col overflow-hidden w-full lg:w-[304px] h-[338px]">
    <Skeleton className="h-5 w-20 mb-3" />
    <div className="flex items-center justify-between mb-3">
      <Skeleton className="h-4 w-24" />
      <div className="flex gap-1">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>
    </div>

    <div className="mb-4">
      <div className="grid grid-cols-7 gap-1 mb-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-full" />
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 35 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-6 rounded-full mx-auto" />
        ))}
      </div>
    </div>

    <div className="bg-gray-50 dark:bg-gray-700 p-1 rounded-lg flex mb-3">
      <Skeleton className="flex-1 h-6 rounded-md mx-0.5" />
      <Skeleton className="flex-1 h-6 rounded-md mx-0.5" />
      <Skeleton className="flex-1 h-6 rounded-md mx-0.5" />
    </div>

    <div className="flex flex-col gap-2">
      <Skeleton className="h-10 w-full rounded-lg" />
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  </div>
);

export const LatestTasksRowSkeleton: React.FC = () => (
  <tr className="border-b border-gray-50 dark:border-gray-700">
    <td className="py-1.5 px-3">
      <Skeleton className="h-3 w-3 rounded" />
    </td>
    <td className="py-1.5 px-3">
      <Skeleton className="h-4 w-32" />
    </td>
    <td className="py-1.5 px-3">
      <Skeleton className="h-4 w-20" />
    </td>
    <td className="py-1.5 px-3">
      <Skeleton className="h-4 w-12" />
    </td>
    <td className="py-1.5 px-3">
      <Skeleton className="h-5 w-20 rounded" />
    </td>
    <td className="py-1.5 px-3">
      <Skeleton className="h-5 w-16 rounded" />
    </td>
    <td className="py-1.5 px-3">
      <Skeleton className="h-4 w-20" />
    </td>
    <td className="py-1.5 px-3">
      <Skeleton className="h-4 w-20" />
    </td>
  </tr>
);

export const LatestTasksSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100/60 dark:border-gray-700/60 p-3 flex flex-col overflow-hidden w-full h-[260px]">
    <Skeleton className="h-4 w-24 mb-2" />
    <div className="overflow-x-auto flex-1 w-full">
      <table className="w-full min-w-[900px]">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="py-1 px-3 w-8">
              <Skeleton className="h-3 w-3 rounded" />
            </th>
            <th className="py-1.5 px-3">
              <Skeleton className="h-3 w-16" />
            </th>
            <th className="py-1.5 px-3">
              <Skeleton className="h-3 w-20" />
            </th>
            <th className="py-1.5 px-3">
              <Skeleton className="h-3 w-14" />
            </th>
            <th className="py-1.5 px-3">
              <Skeleton className="h-3 w-12" />
            </th>
            <th className="py-1.5 px-3">
              <Skeleton className="h-3 w-14" />
            </th>
            <th className="py-1.5 px-3">
              <Skeleton className="h-3 w-16" />
            </th>
            <th className="py-1.5 px-3">
              <Skeleton className="h-3 w-14" />
            </th>
          </tr>
        </thead>
        <tbody>
          <LatestTasksRowSkeleton />
          <LatestTasksRowSkeleton />
          <LatestTasksRowSkeleton />
          <LatestTasksRowSkeleton />
        </tbody>
      </table>
    </div>
  </div>
);

export const BudgetChartSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100/60 dark:border-gray-700/60 p-4 flex flex-col w-full lg:flex-1 h-auto min-h-[337px]">
    <div className="flex items-center justify-between mb-4">
      <div>
        <Skeleton className="h-5 w-16 mb-1" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="h-8 w-20 rounded-lg" />
    </div>
    <div className="flex-1 flex items-end justify-around gap-2">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <Skeleton
            className="w-full rounded-t"
            style={{ height: `${((i % 3) + 1) * 40}px` }}
          />
          <Skeleton className="h-3 w-6" />
        </div>
      ))}
    </div>
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div className="flex flex-col">
    <div className="p-4 pb-2">
      <Skeleton className="h-8 w-32" />
    </div>

    <div className="px-4 py-3 flex items-center justify-between flex-wrap gap-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-28 rounded-lg" />
        <Skeleton className="h-9 w-20 rounded-lg" />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-28 rounded-lg" />
        <div className="flex gap-1">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-10 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </div>
    </div>

    <div className="flex flex-col gap-4 p-4">
      <StatsGridSkeleton />
      <div className="flex flex-col lg:flex-row gap-4">
        <CompletionChartSkeleton />
        <ScheduleCalendarSkeleton />
        <BudgetChartSkeleton />
      </div>

      <LatestTasksSkeleton />
    </div>
  </div>
);
