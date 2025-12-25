import React from "react";

// ============================================
// SKELETON LOADING COMPONENTS
// ============================================
// Provides smooth loading placeholders while data loads
// Uses CSS animation for a pulsing effect

interface SkeletonProps {
    className?: string;
}

/**
 * Base skeleton component with pulse animation
 */
export const Skeleton: React.FC<SkeletonProps> = ({ className = "" }) => (
    <div
        className={`animate-pulse bg-gray-200 rounded ${className}`}
    />
);

/**
 * Skeleton for task cards in Kanban view
 */
export const TaskCardSkeleton: React.FC = () => (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-3">
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

/**
 * Skeleton for a single column in Kanban view
 */
export const KanbanColumnSkeleton: React.FC = () => (
    <div className="flex-shrink-0 w-72 bg-gray-50 rounded-xl p-4">
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

/**
 * Skeleton for Kanban board (multiple columns)
 */
export const KanbanBoardSkeleton: React.FC = () => (
    <div className="flex gap-4 overflow-x-auto p-4">
        <KanbanColumnSkeleton />
        <KanbanColumnSkeleton />
        <KanbanColumnSkeleton />
        <KanbanColumnSkeleton />
    </div>
);

/**
 * Skeleton for project header area
 */
export const ProjectHeaderSkeleton: React.FC = () => (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
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

/**
 * Skeleton for tab navigation
 */
export const TabsSkeleton: React.FC = () => (
    <div className="flex gap-2 p-4 border-b border-gray-200">
        <Skeleton className="h-9 w-20 rounded-lg" />
        <Skeleton className="h-9 w-20 rounded-lg" />
        <Skeleton className="h-9 w-20 rounded-lg" />
        <Skeleton className="h-9 w-20 rounded-lg" />
    </div>
);

/**
 * Skeleton for team member row
 */
export const TeamMemberSkeleton: React.FC = () => (
    <div className="flex items-center gap-4 p-4 border-b border-gray-100">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1">
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-3 w-48" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
    </div>
);

/**
 * Skeleton for team members list
 */
export const TeamMembersListSkeleton: React.FC = () => (
    <div className="bg-white rounded-xl overflow-hidden">
        <TeamMemberSkeleton />
        <TeamMemberSkeleton />
        <TeamMemberSkeleton />
        <TeamMemberSkeleton />
        <TeamMemberSkeleton />
    </div>
);

/**
 * Skeleton for file row in files tab
 */
export const FileRowSkeleton: React.FC = () => (
    <div className="grid grid-cols-[2.5fr_1fr_1fr_1.5fr] gap-4 px-6 h-[43px] items-center bg-white">
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

/**
 * Skeleton for files list
 */
export const FilesListSkeleton: React.FC = () => (
    <div className="flex flex-col gap-[2px] bg-gray-50">
        <FileRowSkeleton />
        <FileRowSkeleton />
        <FileRowSkeleton />
        <FileRowSkeleton />
        <FileRowSkeleton />
    </div>
);

/**
 * Skeleton for project board page (full page)
 */
export const ProjectBoardSkeleton: React.FC = () => (
    <div className="flex-1 flex flex-col">
        <ProjectHeaderSkeleton />
        <TabsSkeleton />
        <KanbanBoardSkeleton />
    </div>
);

/**
 * Skeleton for team page (full page)
 */
export const TeamPageSkeleton: React.FC = () => (
    <div className="flex-1 flex flex-col">
        <ProjectHeaderSkeleton />
        <TabsSkeleton />
        <div className="p-4">
            <TeamMembersListSkeleton />
        </div>
    </div>
);

/**
 * Skeleton for table view
 */
export const TableRowSkeleton: React.FC = () => (
    <div className="grid grid-cols-6 gap-4 px-4 py-3 border-b border-gray-100">
        <Skeleton className="h-4 w-full col-span-2" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
    </div>
);

export const TableSkeleton: React.FC = () => (
    <div className="bg-white rounded-xl overflow-hidden">
        <div className="grid grid-cols-6 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200">
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
