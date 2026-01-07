export const dashboardClasses = {
  container:
    "flex h-full min-h-screen bg-white dark:bg-gray-900 relative font-sans",
  main: "flex-1 overflow-y-auto bg-white dark:bg-gray-900",
  mainContent: (sidebarOpen: boolean) =>
    `transition-all duration-300 flex-1 flex flex-col ${
      !sidebarOpen ? "pt-16 md:pt-0 md:pl-16" : ""
    }`,

  menuButton: (sidebarOpen: boolean) =>
    `absolute top-4 left-4 z-30 p-2 bg-white dark:bg-gray-800 rounded-md shadow dark:shadow-gray-800 text-gray-600 dark:text-gray-300 ${
      sidebarOpen ? "md:hidden" : "block"
    }`,
  header:
    "px-6 pt-6 pb-2 flex flex-col md:flex-row md:items-center justify-between gap-4",
  title: "text-2xl font-bold text-gray-800 dark:text-white",

  toolbar:
    "mt-6 px-6 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4",

  filtersWrapper: "flex items-center gap-6",
  projectsDropdown:
    "flex items-center gap-2 text-gray-500 dark:text-gray-400 cursor-pointer",
  dropdownText: "text-sm",
  filtersButton:
    "flex items-center gap-2 text-gray-500 dark:text-gray-400 cursor-pointer border-l pl-6 border-gray-200 dark:border-gray-700",
  filtersButtonText: "text-sm",

  rangeWrapper: "flex items-center gap-6",
  dateDisplay: "flex items-center gap-2 text-gray-500 dark:text-gray-400",
  dateText: "text-sm",

  rangeSelector:
    "flex items-center bg-gray-100 dark:bg-gray-800 rounded-md p-0.5",
  rangeButton: (isActive: boolean) =>
    `px-3 py-1 text-xs rounded-sm font-medium transition-colors ${
      isActive
        ? "bg-white dark:bg-gray-700 shadow-sm text-gray-800 dark:text-white"
        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
    }`,

  contentSection: "p-6",
  statsGridWrapper: "mb-8",
  chartsSection: "flex flex-wrap gap-3",
  completionChartWrapper: "",
  scheduleCalendarWrapper: "",
  budgetChartWrapper: "flex-1 min-w-[300px]",
  latestTasksWrapper: "mt-6",
};
