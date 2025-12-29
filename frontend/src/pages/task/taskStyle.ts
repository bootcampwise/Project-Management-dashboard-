export const taskClasses = {
  container: "flex h-screen bg-white dark:bg-gray-900 relative font-sans",
  main: (activeView: string) =>
    `flex-1 flex flex-col bg-white dark:bg-gray-900 ${
      activeView === "kanban" ? "overflow-hidden" : "overflow-y-auto"
    }`,
  mainContent: (sidebarOpen: boolean) =>
    `flex-1 flex flex-col transition-all duration-300 min-h-0 ${
      !sidebarOpen ? "pt-16 md:pt-0 md:pl-16" : ""
    }`,

  menuButton: (sidebarOpen: boolean) =>
    `absolute top-4 left-4 z-30 p-2 bg-white dark:bg-gray-800 rounded-md shadow dark:shadow-gray-800 text-gray-600 dark:text-gray-300 ${
      sidebarOpen ? "md:hidden" : "block"
    }`,
  headerWrapper:
    "bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4",
  headerTitle: "text-2xl font-bold text-gray-900 dark:text-white mb-4",

  toolbar: "flex flex-col md:flex-row md:items-center justify-between gap-4",

  viewTabsWrapper:
    "flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1",
  viewTab: (isActive: boolean) =>
    `flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition ${
      isActive
        ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
    }`,

  actionsWrapper: "flex items-center gap-3 flex-wrap",
  searchButton:
    "flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer",
  searchIcon: "text-gray-400 dark:text-gray-500",
  searchText: "text-sm text-gray-500 dark:text-gray-400",
  filterButton:
    "flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-sm text-gray-700 dark:text-gray-300",
  newTaskButton:
    "flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium",

  kanbanWrapper: "p-6 flex-1 overflow-x-auto min-h-0",
  kanbanBoard: "flex h-full w-full gap-4 pb-4",
  columnWrapper: (collapsed: boolean) =>
    `h-full transition-all duration-300 ${
      collapsed ? "w-12 min-w-[48px]" : "flex-1 min-w-[280px]"
    }`,

  addSectionWrapper: "relative min-w-[120px] pt-1",
  addSectionButton:
    "flex items-center gap-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-sm font-medium whitespace-nowrap",
  addSectionOverlay: "fixed inset-0 z-10",
  addSectionDropdown:
    "absolute right-0 top-8 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20 py-1",
  addSectionItem:
    "w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2",
  addSectionEmpty:
    "absolute right-0 top-8 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20 py-2 px-4 text-sm text-gray-500 dark:text-gray-400",
  columnDot: (color: string) => `w-2 h-2 rounded-full ${color}`,

  listWrapper: "p-6",
  listContainer:
    "bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden overflow-x-auto",
  listHeader:
    "grid grid-cols-[2fr_1fr_1fr_120px_100px_150px] gap-4 px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[800px]",
  listBody: "divide-y divide-gray-100 dark:divide-gray-700",
  listRow:
    "grid grid-cols-[2fr_1fr_1fr_120px_100px_150px] gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer items-center text-sm min-w-[800px]",

  taskName: "font-medium text-gray-900 dark:text-white mb-1",
  taskDescription: "text-xs text-gray-500 dark:text-gray-400 line-clamp-1",
  taskStats:
    "flex items-center gap-3 mt-1 text-xs text-gray-400 dark:text-gray-500",
  taskStat: "flex items-center gap-1",
  projectName: "text-blue-600 dark:text-blue-400 text-xs font-medium",

  assigneesWrapper: "flex -space-x-2",
  assigneeAvatar:
    "w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-[10px] font-bold text-blue-600 dark:text-blue-400 overflow-hidden",
  assigneeImage: "w-full h-full object-cover",

  dueDateWrapper:
    "flex items-center gap-1 text-gray-600 dark:text-gray-400 text-xs",
  dueDateEmpty: "text-gray-400 dark:text-gray-500",

  priorityBadge: (colorClass: string) =>
    `px-2 py-1 rounded-full text-xs font-medium ${colorClass}`,

  statusWrapper: "flex items-center gap-2",
  statusDot: "w-2 h-2 rounded-full",
  statusText: "text-gray-700 dark:text-gray-300 text-sm",
};
