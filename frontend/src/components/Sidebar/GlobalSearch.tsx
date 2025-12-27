import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    CheckCircle2,
    SortAsc,
    Calendar,
    LayoutGrid,
    User as UserIcon,
    X
} from 'lucide-react';
import { format, isSameDay, isAfter, subDays, parseISO } from 'date-fns';
import { Dropdown, type DropdownItem } from '../../components/ui';
import { useGetTasksQuery } from '../../store/api/taskApiSlice';
import { useGetProjectsQuery } from '../../store/api/projectApiSlice';
import { useGetAllTeamsQuery } from '../../store/api/teamApiSlice';
import type { Task } from '../../types';

interface GlobalSearchProps {
    onClose?: () => void;
    className?: string;
    autoFocus?: boolean;
    onClick?: (e: React.MouseEvent) => void;
    showProjects?: boolean;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({
    onClose,
    className = '',
    autoFocus = true,
    onClick,
    showProjects = true
}) => {
    // Queries
    const { data: tasks = [] } = useGetTasksQuery();
    // Only fetch projects if we are showing them, or just fetch and ignore?
    // RTK Query hooks are unconditional usually, but we can skip if we want.
    // However, for simplicity and caching, let's keep fetching or just filter.
    // To match the existing code structure, unconditional fetch is fine (it's likely cached anyway).
    const { data: projects = [] } = useGetProjectsQuery();
    const { data: allTeams = [] } = useGetAllTeamsQuery();
    const navigate = useNavigate();

    // State
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'alpha'>('newest');

    // Filters
    const [filterCreator, setFilterCreator] = useState<string | null>(null);
    const [filterProject, setFilterProject] = useState<string | null>(null);
    const [filterDate, setFilterDate] = useState<string | null>(null); // 'today', 'week', 'month'

    // Derived Data
    const allMembers = useMemo(() => {
        const membersMap = new Map();
        allTeams.forEach(team => {
            team.members?.forEach(member => {
                if (!membersMap.has(member.id)) {
                    membersMap.set(member.id, member);
                }
            });
        });
        return Array.from(membersMap.values());
    }, [allTeams]);

    const filteredResults = useMemo(() => {
        let results: (Task | any)[] = [];

        // 1. Filter Tasks
        const filteredTasks = tasks.filter(task => {
            // Search Query
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesTitle = task.title?.toLowerCase().includes(query) || task.name?.toLowerCase().includes(query);
                const matchesDesc = task.description?.toLowerCase().includes(query);
                if (!matchesTitle && !matchesDesc) return false;
            }

            // Creator Filter
            if (filterCreator) {
                if (task.creator?.id !== filterCreator && task.assignee?.name !== filterCreator) {
                    const creatorId = task.creator?.id;
                    if (creatorId !== filterCreator) return false;
                }
            }

            // Project Filter
            if (filterProject) {
                const projectId = typeof task.project === 'string' ? task.project : task.project?.id;
                if (projectId !== filterProject) return false;
            }

            // Date Filter - shows tasks whose due date is within the PAST X days
            if (filterDate && task.dueDate) {
                const date = parseISO(task.dueDate);
                const today = new Date();
                const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

                if (filterDate === 'today') {
                    if (!isSameDay(date, today)) return false;
                } else if (filterDate === 'week') {
                    // Tasks with due date in the PAST 7 days (including today)
                    const sevenDaysAgo = subDays(startOfToday, 7);
                    if (!(isAfter(date, sevenDaysAgo) && !isAfter(date, today))) return false;
                } else if (filterDate === 'month') {
                    // Tasks with due date in the PAST 30 days (including today)
                    const thirtyDaysAgo = subDays(startOfToday, 30);
                    if (!(isAfter(date, thirtyDaysAgo) && !isAfter(date, today))) return false;
                }
            }

            return true;
        });

        // 2. Filter Projects (Only if showProjects is true)
        let filteredProjects: any[] = [];
        if (showProjects) {
            filteredProjects = projects.filter(project => {
                // Skip if task-specific filters are active (Creator, Date) - unless we want to filter projects by creator?
                // Projects don't usually have a single "creator" field in the same way, or "dueDate" in the same way
                // So if Date or Creator filter is active, we might hide projects or check if they apply.
                // For simplicity, let's hide projects if Date or Creator filter is on.
                if (filterDate || filterCreator) return false;

                if (filterProject && project.id !== filterProject) return false;

                if (searchQuery) {
                    const query = searchQuery.toLowerCase();
                    return project.name.toLowerCase().includes(query) || project.key.toLowerCase().includes(query);
                }

                return true;
            });
        }

        // Combine
        results = [...filteredTasks, ...filteredProjects];

        // Sort
        return results.sort((a, b) => {
            if (sortBy === 'alpha') {
                const titleA = a.title || a.name || '';
                const titleB = b.title || b.name || '';
                return titleA.localeCompare(titleB);
            }

            const dateA = new Date(a.createdAt || a.startDate || 0).getTime();
            const dateB = new Date(b.createdAt || b.startDate || 0).getTime();

            return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
        });
    }, [tasks, projects, searchQuery, filterCreator, filterProject, filterDate, sortBy, showProjects]);

    // Handlers
    const handleResultClick = (result: any) => {
        if (result.key) { // It's a project (projects have 'key')
            navigate(`/project/${result.id}`);
        } else { // It's a task
            navigate(`/tasks?taskId=${result.id}`);
        }

        if (onClose) onClose();
    };

    // Dropdown Items Generation
    const sortItems: DropdownItem[] = [
        { key: 'newest', label: 'Newest First', onClick: () => setSortBy('newest') },
        { key: 'oldest', label: 'Oldest First', onClick: () => setSortBy('oldest') },
        { key: 'div1', divider: true } as any,
        { key: 'alpha', label: 'Alphabetical', onClick: () => setSortBy('alpha') },
    ];

    const creatorItems: DropdownItem[] = [
        {
            key: 'all',
            label: 'All Creators',
            onClick: () => setFilterCreator(null),
            icon: filterCreator === null ? <CheckCircle2 size={14} /> : undefined
        },
        ...allMembers.map(member => ({
            key: member.id,
            label: member.name,
            icon: filterCreator === member.id ? <CheckCircle2 size={14} /> : <UserIcon size={14} />,
            onClick: () => setFilterCreator(String(member.id))
        }))
    ];

    const projectItems: DropdownItem[] = [
        {
            key: 'all',
            label: 'All Projects',
            onClick: () => setFilterProject(null),
            icon: filterProject === null ? <CheckCircle2 size={14} /> : undefined
        },
        ...projects.map(p => ({
            key: p.id,
            label: p.name,
            icon: filterProject === p.id ? <CheckCircle2 size={14} /> : <LayoutGrid size={14} />,
            onClick: () => setFilterProject(p.id)
        }))
    ];

    const dateItems: DropdownItem[] = [
        { key: 'any', label: 'Any Date', onClick: () => setFilterDate(null) },
        { key: 'today', label: 'Due Today', onClick: () => setFilterDate('today') },
        { key: 'week', label: 'Last 7 Days', onClick: () => setFilterDate('week') },
        { key: 'month', label: 'Last 30 Days', onClick: () => setFilterDate('month') },
    ];

    // Helper to get active filter label
    const getCreatorLabel = () => {
        if (!filterCreator) return "Created by";
        const member = allMembers.find(m => String(m.id) === filterCreator);
        return member ? `Created by: ${member.name}` : "Created by";
    };

    const getProjectLabel = () => {
        if (!filterProject) return "Projects";
        const project = projects.find(p => p.id === filterProject);
        return project ? `Project: ${project.name}` : "Projects";
    };

    const getDateLabel = () => {
        if (!filterDate) return 'Date';
        if (filterDate === 'today') return 'Due Today';
        if (filterDate === 'week') return 'Last 7 Days';
        if (filterDate === 'month') return 'Last 30 Days';
        return 'Date';
    };

    return (
        <div
            className={`bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[85vh] ${className}`}
            onClick={onClick}
        >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 flex-shrink-0">
                <Search className="text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder={showProjects ? "Search tasks, projects..." : "Search tasks..."}
                    className="flex-1 outline-none text-gray-700 placeholder:text-gray-400 text-[15px]"
                    autoFocus={autoFocus}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600">
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* Filters Wrapper */}
            <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex-shrink-0">
                {/* Sort Filter */}
                <Dropdown
                    trigger={
                        <button className={`flex items-center gap-1.5 px-3 py-1.5 border rounded text-sm transition-colors ${sortBy !== 'newest' ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                            <SortAsc size={14} />
                            <span>{sortBy === 'newest' ? 'Sort' : sortBy === 'oldest' ? 'Oldest' : 'A-Z'}</span>
                        </button>
                    }
                    items={sortItems}
                />

                {/* Creator Filter */}
                <Dropdown
                    trigger={
                        <button className={`flex items-center gap-1.5 px-3 py-1.5 border rounded text-sm transition-colors ${filterCreator ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                            <UserIcon size={14} />
                            <span className="truncate max-w-[150px]">{getCreatorLabel()}</span>
                        </button>
                    }
                    items={creatorItems}
                    menuClassName="max-h-[300px] overflow-y-auto w-64"
                />

                {/* Project Filter - Conditionally Render */}
                {showProjects && (
                    <Dropdown
                        trigger={
                            <button className={`flex items-center gap-1.5 px-3 py-1.5 border rounded text-sm transition-colors ${filterProject ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                                <LayoutGrid size={14} />
                                <span className="truncate max-w-[150px]">{getProjectLabel()}</span>
                            </button>
                        }
                        items={projectItems}
                        menuClassName="max-h-[300px] overflow-y-auto w-64"
                    />
                )}

                {/* Date Filter */}
                <Dropdown
                    trigger={
                        <button className={`flex items-center gap-1.5 px-3 py-1.5 border rounded text-sm transition-colors ${filterDate ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                            <Calendar size={14} />
                            <span>{getDateLabel()}</span>
                        </button>
                    }
                    items={dateItems}
                />
            </div>

            {/* Results Section */}
            <div className="flex-1 overflow-y-auto min-h-[300px] max-h-[500px] bg-white">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 sticky top-0 bg-white/95 backdrop-blur z-10 border-b border-gray-50">
                    {filteredResults.length} Result{filteredResults.length !== 1 ? 's' : ''}
                </div>

                <div className="pb-2">
                    {filteredResults.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                            <Search size={32} className="mb-2 opacity-50" />
                            <p className="text-sm">No results found matching your filters</p>
                        </div>
                    ) : (
                        filteredResults.map(result => {
                            const isProject = 'key' in result; // Rudimentary check

                            if (isProject) {
                                // Project Rendering
                                const project = result as any; // Type assertion for brevity
                                return (
                                    <div
                                        key={`proj-${project.id}`}
                                        className="px-4 py-3 flex items-start gap-3 hover:bg-gray-50 cursor-pointer group border-b border-gray-50 last:border-0"
                                        onClick={() => handleResultClick(project)}
                                    >
                                        <div className="mt-0.5 text-blue-500 bg-blue-50 p-1 rounded">
                                            <LayoutGrid size={16} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <h4 className="text-sm font-medium text-gray-900 truncate" title={project.name}>
                                                    {project.name}
                                                </h4>
                                                <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">Project</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-xs text-gray-500 font-medium">{project.key}</span>
                                                <span className="text-[10px] text-gray-300">•</span>
                                                <span className="text-xs text-gray-400">
                                                    {project.createdAt ? format(new Date(project.createdAt), 'MMM d, yyyy') : 'No date'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            } else {
                                // Task Rendering
                                const task = result as Task;
                                const project = projects.find(p => p.id === (typeof task.project === 'string' ? task.project : task.project?.id));
                                const creator = task.creator || { name: 'Unknown', avatar: undefined };
                                const timeStr = task.dueDate
                                    ? `Due ${format(new Date(task.dueDate), 'MMM d')}`
                                    : 'No due date';

                                return (
                                    <div
                                        key={`task-${task.id}`}
                                        className="px-4 py-3 flex items-start gap-3 hover:bg-gray-50 cursor-pointer group border-b border-gray-50 last:border-0"
                                        onClick={() => handleResultClick(task)}
                                    >
                                        <div className={`mt-0.5 ${task.status === 'COMPLETED' ? 'text-green-500' : 'text-gray-400 group-hover:text-blue-500'}`}>
                                            <CheckCircle2 size={18} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <h4 className="text-sm font-medium text-gray-900 truncate" title={task.name || task.title}>
                                                    {task.name || task.title}
                                                </h4>
                                                {creator.avatar ? (
                                                    <img src={creator.avatar} className="w-5 h-5 rounded-full flex-shrink-0" alt={creator.name} title={`Created by ${creator.name}`} />
                                                ) : (
                                                    <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] flex-shrink-0 text-gray-600" title={`Created by ${creator.name}`}>
                                                        {creator.name?.[0]?.toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-xs text-gray-500 font-medium">{project?.name || 'No Project'}</span>
                                                <span className="text-[10px] text-gray-300">•</span>
                                                <span className="text-xs text-gray-400">{timeStr}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        })
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs text-gray-400 flex-shrink-0">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">Select <kbd className="font-sans px-1 bg-white border border-gray-200 rounded text-[10px] min-w-[16px] text-center">↵</kbd></span>
                    <span className="flex items-center gap-1">Navigate <kbd className="font-sans px-1 bg-white border border-gray-200 rounded text-[10px] min-w-[16px] text-center">↑↓</kbd></span>
                    <span className="flex items-center gap-1">Close <kbd className="font-sans px-1 bg-white border border-gray-200 rounded text-[10px] px-1.5">Esc</kbd></span>
                </div>
            </div>
        </div>
    );
};

export default GlobalSearch;
