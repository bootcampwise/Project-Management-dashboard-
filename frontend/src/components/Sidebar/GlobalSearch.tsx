import React from "react";
import {
  Search,
  CheckCircle2,
  SortAsc,
  Calendar,
  LayoutGrid,
  User as UserIcon,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { Dropdown, type DropdownItem } from "../../components/ui";
import type { Task, Project, GlobalSearchProps } from "../../types";
import { useGlobalSearch } from "../../pages/sidebar/hooks/useGlobalSearch";

const GlobalSearch: React.FC<GlobalSearchProps> = ({
  onClose,
  className = "",
  autoFocus = true,
  onClick,
  showProjects = true,
}) => {
  const {
    projects,
    allMembers,
    filteredResults,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filterCreator,
    setFilterCreator,
    filterProject,
    setFilterProject,
    filterDate,
    setFilterDate,
    handleResultClick,
    getCreatorLabel,
    getProjectLabel,
    getDateLabel,
  } = useGlobalSearch(showProjects, onClose);

  const sortItems: DropdownItem[] = [
    {
      key: "newest",
      label: "Newest First",
      onClick: () => setSortBy("newest"),
    },
    {
      key: "oldest",
      label: "Oldest First",
      onClick: () => setSortBy("oldest"),
    },
    { key: "div1", divider: true } as DropdownItem,
    { key: "alpha", label: "Alphabetical", onClick: () => setSortBy("alpha") },
  ];

  const creatorItems: DropdownItem[] = [
    {
      key: "all",
      label: "All Creators",
      onClick: () => setFilterCreator(null),
      icon: filterCreator === null ? <CheckCircle2 size={14} /> : undefined,
    },
    ...allMembers.map((member) => ({
      key: member.id,
      label: member.name,
      icon:
        filterCreator === member.id ? (
          <CheckCircle2 size={14} />
        ) : (
          <UserIcon size={14} />
        ),
      onClick: () => setFilterCreator(String(member.id)),
    })),
  ];

  const projectItems: DropdownItem[] = [
    {
      key: "all",
      label: "All Projects",
      onClick: () => setFilterProject(null),
      icon: filterProject === null ? <CheckCircle2 size={14} /> : undefined,
    },
    ...projects.map((p) => ({
      key: p.id,
      label: p.name,
      icon:
        filterProject === p.id ? (
          <CheckCircle2 size={14} />
        ) : (
          <LayoutGrid size={14} />
        ),
      onClick: () => setFilterProject(p.id),
    })),
  ];

  const dateItems: DropdownItem[] = [
    { key: "any", label: "Any Date", onClick: () => setFilterDate(null) },
    { key: "today", label: "Due Today", onClick: () => setFilterDate("today") },
    { key: "week", label: "Last 7 Days", onClick: () => setFilterDate("week") },
    {
      key: "month",
      label: "Last 30 Days",
      onClick: () => setFilterDate("month"),
    },
  ];

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col max-h-[85vh] ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
        <Search className="text-gray-400 dark:text-gray-500" size={20} />
        <input
          type="text"
          placeholder={
            showProjects ? "Search tasks, projects..." : "Search tasks..."
          }
          className="flex-1 outline-none text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-[15px] bg-transparent"
          autoFocus={autoFocus}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 flex-shrink-0">
        <Dropdown
          trigger={
            <button
              className={`flex items-center gap-1.5 px-3 py-1.5 border rounded text-sm transition-colors ${
                sortBy !== "newest"
                  ? "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500"
              }`}
            >
              <SortAsc size={14} />
              <span>
                {sortBy === "newest"
                  ? "Sort"
                  : sortBy === "oldest"
                    ? "Oldest"
                    : "A-Z"}
              </span>
            </button>
          }
          items={sortItems}
        />

        <Dropdown
          trigger={
            <button
              className={`flex items-center gap-1.5 px-3 py-1.5 border rounded text-sm transition-colors ${
                filterCreator
                  ? "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500"
              }`}
            >
              <UserIcon size={14} />
              <span className="truncate max-w-[150px]">
                {getCreatorLabel()}
              </span>
            </button>
          }
          items={creatorItems}
          menuClassName="max-h-[300px] overflow-y-auto w-64"
        />

        {showProjects && (
          <Dropdown
            trigger={
              <button
                className={`flex items-center gap-1.5 px-3 py-1.5 border rounded text-sm transition-colors ${
                  filterProject
                    ? "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500"
                }`}
              >
                <LayoutGrid size={14} />
                <span className="truncate max-w-[150px]">
                  {getProjectLabel()}
                </span>
              </button>
            }
            items={projectItems}
            menuClassName="max-h-[300px] overflow-y-auto w-64"
          />
        )}

        <Dropdown
          trigger={
            <button
              className={`flex items-center gap-1.5 px-3 py-1.5 border rounded text-sm transition-colors ${
                filterDate
                  ? "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500"
              }`}
            >
              <Calendar size={14} />
              <span>{getDateLabel()}</span>
            </button>
          }
          items={dateItems}
        />
      </div>

      <div className="flex-1 overflow-y-auto min-h-[300px] max-h-[500px] bg-white dark:bg-gray-800">
        <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 sticky top-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur z-10 border-b border-gray-50 dark:border-gray-700">
          {filteredResults.length} Result
          {filteredResults.length !== 1 ? "s" : ""}
        </div>

        <div className="pb-2">
          {filteredResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
              <Search size={32} className="mb-2 opacity-50" />
              <p className="text-sm">No results found matching your filters</p>
            </div>
          ) : (
            filteredResults.map((result) => {
              const isProject = "key" in result;

              if (isProject) {
                const project = result as Project;
                return (
                  <div
                    key={`proj-${project.id}`}
                    className="px-4 py-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer group border-b border-gray-50 dark:border-gray-700 last:border-0"
                    onClick={() => handleResultClick(project)}
                  >
                    <div className="mt-0.5 text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 p-1 rounded">
                      <LayoutGrid size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4
                          className="text-sm font-medium text-gray-900 dark:text-white truncate"
                          title={project.name}
                        >
                          {project.name}
                        </h4>
                        <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                          Project
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                          {project.key}
                        </span>
                        <span className="text-[10px] text-gray-300 dark:text-gray-600">
                          •
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {project.createdAt
                            ? format(new Date(project.createdAt), "MMM d, yyyy")
                            : "No date"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              } else {
                const task = result as Task;
                const project = projects.find(
                  (p) =>
                    p.id ===
                    (typeof task.project === "string"
                      ? task.project
                      : task.project?.id),
                );
                const creator = task.creator || {
                  name: "Unknown",
                  avatar: undefined,
                };
                const timeStr = task.dueDate
                  ? `Due ${format(new Date(task.dueDate), "MMM d")}`
                  : "No due date";

                return (
                  <div
                    key={`task-${task.id}`}
                    className="px-4 py-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer group border-b border-gray-50 dark:border-gray-700 last:border-0"
                    onClick={() => handleResultClick(task)}
                  >
                    <div
                      className={`mt-0.5 ${
                        task.status === "COMPLETED"
                          ? "text-green-500"
                          : "text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400"
                      }`}
                    >
                      <CheckCircle2 size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4
                          className="text-sm font-medium text-gray-900 dark:text-white truncate"
                          title={task.name || task.title}
                        >
                          {task.name || task.title}
                        </h4>
                        {creator.avatar ? (
                          <img
                            src={creator.avatar}
                            className="w-5 h-5 rounded-full flex-shrink-0"
                            alt={creator.name}
                            title={`Created by ${creator.name}`}
                          />
                        ) : (
                          <div
                            className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-[10px] flex-shrink-0 text-gray-600 dark:text-gray-300"
                            title={`Created by ${creator.name}`}
                          >
                            {creator.name?.[0]?.toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                          {project?.name || "No Project"}
                        </span>
                        <span className="text-[10px] text-gray-300 dark:text-gray-600">
                          •
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {timeStr}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }
            })
          )}
        </div>
      </div>

      <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            Select{" "}
            <kbd className="font-sans px-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-[10px] min-w-[16px] text-center">
              ↵
            </kbd>
          </span>
          <span className="flex items-center gap-1">
            Navigate{" "}
            <kbd className="font-sans px-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-[10px] min-w-[16px] text-center">
              ↑↓
            </kbd>
          </span>
          <span className="flex items-center gap-1">
            Close{" "}
            <kbd className="font-sans px-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-[10px] px-1.5">
              Esc
            </kbd>
          </span>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;
