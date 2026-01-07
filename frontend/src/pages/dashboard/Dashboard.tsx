import React, { useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  pageVariants,
  reducedPageVariants,
  itemVariants,
} from "../../utils/motion";
import Sidebar from "../sidebar/Sidebar";
import StatsGrid from "../../components/dashboard/StatsGrid";
import { CompletionChart } from "../../components/dashboard/CompletionChart";
import ScheduleCalendar from "../../components/dashboard/ScheduleCalendar";
import { BudgetChart } from "../../components/dashboard/BudgetChart";
import LatestTasks from "../../components/dashboard/LatestTasks";
import {
  Menu,
  ChevronDown,
  SlidersHorizontal,
  Calendar,
  X,
} from "lucide-react";
import {
  useDashboard,
  type StatusFilter,
  type PriorityFilter,
} from "./hooks/useDashboard";
import type { TimeRange } from "../../types/dashboard.types";
import { dashboardClasses } from "./dashboardStyle";
import { DashboardSkeleton } from "../../components/ui";

const Dashboard: React.FC = () => {
  const {
    sidebarOpen,
    setSidebarOpen,
    isLoading,
    projects,
    projectFilteredTasks,
    selectedProject,
    setSelectedProject,
    selectedDate,
    setSelectedDate,
    selectedRange,
    setSelectedRange,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    isFiltersOpen,
    setIsFiltersOpen,
    clearFilters,
  } = useDashboard();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const formattedDate = selectedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const hasActiveFilters =
    statusFilter !== "all" ||
    priorityFilter !== "all" ||
    selectedProject !== "all";

  const statusOptions: { value: StatusFilter; label: string }[] = [
    { value: "all", label: "All Status" },
    { value: "TODO", label: "To Do" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "COMPLETED", label: "Completed" },
    { value: "BACKLOG", label: "Backlog" },
  ];

  const priorityOptions: { value: PriorityFilter; label: string }[] = [
    { value: "all", label: "All Priority" },
    { value: "LOW", label: "Low" },
    { value: "MEDIUM", label: "Medium" },
    { value: "HIGH", label: "High" },
    { value: "URGENT", label: "Urgent" },
  ];

  const timeRanges: TimeRange[] = ["D", "W", "M", "6M", "Y"];

  return (
    <div className={dashboardClasses.container}>
      <button
        className={dashboardClasses.menuButton(sidebarOpen)}
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={22} />
      </button>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className={dashboardClasses.main}>
        {isLoading ? (
          <DashboardSkeleton />
        ) : (
          <motion.div
            className={dashboardClasses.mainContent(sidebarOpen)}
            variants={shouldReduceMotion ? reducedPageVariants : pageVariants}
            initial="initial"
            animate="animate"
          >
            <div className={dashboardClasses.header}>
              <h1 className={dashboardClasses.title}>Dashboard</h1>
            </div>
            <div className={dashboardClasses.toolbar}>
              <div className={dashboardClasses.filtersWrapper}>
                <div className="relative">
                  <div
                    className={dashboardClasses.projectsDropdown}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <span className={dashboardClasses.dropdownText}>
                      {selectedProject === "all"
                        ? "All Projects"
                        : projects.find((p) => p.id === selectedProject)
                            ?.name || "All Projects"}
                    </span>
                    <ChevronDown size={16} />
                  </div>
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-60 overflow-y-auto">
                      <button
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          selectedProject === "all"
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                        onClick={() => {
                          setSelectedProject("all");
                          setIsDropdownOpen(false);
                        }}
                      >
                        All Projects
                      </button>
                      {projects.map((project) => (
                        <button
                          key={project.id}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 truncate ${
                            selectedProject === project.id
                              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                          onClick={() => {
                            setSelectedProject(project.id);
                            setIsDropdownOpen(false);
                          }}
                        >
                          {project.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <div
                    className={`${dashboardClasses.filtersButton} ${
                      hasActiveFilters ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                  >
                    <SlidersHorizontal size={16} />
                    <span className={dashboardClasses.filtersButtonText}>
                      Filters
                    </span>
                    {hasActiveFilters && (
                      <span className="ml-1 w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </div>
                  {isFiltersOpen && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          Filters
                        </span>
                        <button
                          onClick={() => {
                            clearFilters();
                            setIsFiltersOpen(false);
                          }}
                          className="text-xs text-blue-600 hover:text-blue-700"
                        >
                          Clear all
                        </button>
                      </div>
                      <div className="mb-3">
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Status
                        </label>
                        <select
                          value={statusFilter}
                          onChange={(e) =>
                            setStatusFilter(e.target.value as StatusFilter)
                          }
                          className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {statusOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Priority
                        </label>
                        <select
                          value={priorityFilter}
                          onChange={(e) =>
                            setPriorityFilter(e.target.value as PriorityFilter)
                          }
                          className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {priorityOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        onClick={() => setIsFiltersOpen(false)}
                        className="w-full mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Apply Filters
                      </button>
                    </div>
                  )}
                </div>

                {hasActiveFilters && (
                  <div className="flex items-center gap-2 ml-2">
                    {statusFilter !== "all" && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                        {
                          statusOptions.find((s) => s.value === statusFilter)
                            ?.label
                        }
                        <X
                          size={12}
                          className="cursor-pointer"
                          onClick={() => setStatusFilter("all")}
                        />
                      </span>
                    )}
                    {priorityFilter !== "all" && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs rounded-full">
                        {
                          priorityOptions.find(
                            (p) => p.value === priorityFilter,
                          )?.label
                        }
                        <X
                          size={12}
                          className="cursor-pointer"
                          onClick={() => setPriorityFilter("all")}
                        />
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className={dashboardClasses.rangeWrapper}>
                <div className="relative cursor-pointer group">
                  <div
                    className={dashboardClasses.dateDisplay}
                    onClick={() => dateInputRef.current?.showPicker()}
                  >
                    <Calendar
                      size={16}
                      className="text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                    />
                    <span className={dashboardClasses.dateText}>
                      {formattedDate}
                    </span>
                  </div>
                  <input
                    ref={dateInputRef}
                    type="date"
                    value={selectedDate.toISOString().split("T")[0]}
                    onChange={(e) => {
                      if (e.target.value) {
                        setSelectedDate(new Date(e.target.value));
                      }
                    }}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                    style={{ colorScheme: "dark" }}
                    aria-label="Select Date"
                  />
                </div>
                <div className={dashboardClasses.rangeSelector}>
                  {timeRanges.map((range) => (
                    <button
                      key={range}
                      className={dashboardClasses.rangeButton(
                        range === selectedRange,
                      )}
                      onClick={() => setSelectedRange(range)}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={dashboardClasses.contentSection}>
              <motion.div
                className={dashboardClasses.statsGridWrapper}
                variants={itemVariants}
              >
                <StatsGrid
                  tasks={projectFilteredTasks}
                  range={selectedRange}
                  date={selectedDate}
                />
              </motion.div>

              <motion.div
                className={dashboardClasses.chartsSection}
                variants={itemVariants}
              >
                <motion.div
                  className={dashboardClasses.completionChartWrapper}
                  whileHover={{ y: -5, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <CompletionChart
                    tasks={projectFilteredTasks}
                    projects={
                      selectedProject === "all"
                        ? projects
                        : projects.filter((p) => p.id === selectedProject)
                    }
                    range={selectedRange}
                    date={selectedDate}
                  />
                </motion.div>

                <motion.div
                  className={dashboardClasses.scheduleCalendarWrapper}
                  whileHover={{ y: -5, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <ScheduleCalendar projectId={selectedProject} />
                </motion.div>

                <motion.div
                  className={dashboardClasses.budgetChartWrapper}
                  whileHover={{ y: -5, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <BudgetChart
                    tasks={projectFilteredTasks}
                    projects={
                      selectedProject === "all"
                        ? projects
                        : projects.filter((p) => p.id === selectedProject)
                    }
                    range={selectedRange}
                    date={selectedDate}
                  />
                </motion.div>
              </motion.div>

              <motion.div
                className={dashboardClasses.latestTasksWrapper}
                variants={itemVariants}
              >
                <LatestTasks tasks={projectFilteredTasks} />
              </motion.div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
