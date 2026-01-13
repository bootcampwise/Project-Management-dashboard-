export const projectboardClasses = {
  container: "flex h-screen bg-white dark:bg-gray-900 relative font-sans",
  main: "flex-1 overflow-x-hidden overflow-y-auto bg-white dark:bg-gray-900 flex flex-col",
  mainContent: (sidebarOpen: boolean) =>
    `transition-all duration-300 flex-1 flex flex-col ${
      !sidebarOpen ? "pt-16 md:pt-0 md:pl-16" : ""
    }`,

  menuButton: (sidebarOpen: boolean) =>
    `absolute top-4 left-4 z-30 p-2 bg-white dark:bg-gray-800 rounded-md shadow dark:shadow-gray-800 text-gray-600 dark:text-gray-300 ${
      sidebarOpen ? "md:hidden" : "block"
    }`,

  headerWrapper:
    "px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4 overflow-visible",
  headerTitleWrapper: "flex items-center gap-4",
  headerMenuWrapper: "flex items-center gap-2 relative",
  headerTitleClickable:
    "flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-1 rounded-md transition-colors",
  headerTitle: "text-xl font-bold text-gray-800 dark:text-white",

  dropdown:
    "absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 py-1",
  dropdownHeader:
    "px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider",
  dropdownItem: (isActive: boolean) =>
    `w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 ${
      isActive
        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
        : "text-gray-700 dark:text-gray-300"
    }`,
  dropdownItemText: "truncate",
  dropdownEmpty: "px-3 py-2 text-sm text-gray-500 dark:text-gray-400 italic",
  dropdownDivider: "border-t border-gray-100 dark:border-gray-700 mt-1 pt-1",
  dropdownCreateButton:
    "w-full text-left px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2",

  starIcon: "text-yellow-400 fill-current ml-2",
  menuIconButton:
    "p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors",
  menuIconColor: "text-gray-400 dark:text-gray-500",
  menuDropdown:
    "absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 py-1",
  menuDropdownHeader: "px-4 py-2 border-b border-gray-100 dark:border-gray-700",
  menuDropdownLabel: "text-xs text-gray-500 dark:text-gray-400",
  menuDropdownValue:
    "text-sm font-medium text-gray-800 dark:text-gray-200 truncate",
  menuDropdownItem:
    "w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2",
  menuDropdownDeleteItem:
    "w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center gap-2",

  statusBadge:
    "flex items-center gap-1.5 px-2.5 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-white text-sm font-medium rounded-full",
  statusDot: "w-2 h-2 rounded-full bg-green-500",

  actionsWrapper: "flex items-center gap-3",
  avatarsWrapper: "flex -space-x-2 mr-2",
  avatar:
    "w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-600 dark:text-gray-300 font-medium overflow-hidden",
  avatarImage: "w-full h-full object-cover",
  avatarFallback:
    "w-full h-full flex items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400",
  avatarOverflow:
    "w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 font-medium",
  shareButton:
    "flex items-center gap-2 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-gray-800",
  createButton:
    "flex items-center gap-2 px-3 py-1.5 bg-blue-600 rounded-md text-white text-sm hover:bg-blue-700",
  createButtonChevron: "border-l border-blue-500 pl-1 ml-1 h-4 w-auto",

  toolbar:
    "px-6 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4",
  tabsWrapper: "flex items-center gap-8 overflow-x-auto no-scrollbar -mb-px",
  tab: (isActive: boolean) =>
    `flex items-center gap-2 py-3 text-sm font-medium transition-colors relative ${
      isActive
        ? "text-gray-900 dark:text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gray-400 dark:after:bg-white after:rounded-full"
        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
    }`,
  addTabButton:
    "flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm font-medium py-3 cursor-pointer",

  toolsWrapper: "flex items-center gap-4 py-2",
  toolItem:
    "flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer",
  toolText: "text-sm",
  toolDivider: "h-4 w-px bg-gray-300 dark:bg-gray-600 mx-1",

  contentArea: "flex-1 p-6 bg-white dark:bg-gray-900 overflow-x-auto",

  dashboardWrapper: "p-6",
  dashboardTitle: "text-lg font-semibold mb-4 text-gray-900 dark:text-white",
  membersGrid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
  memberCard:
    "flex items-center gap-3 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm",
  memberAvatar:
    "w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold overflow-hidden",
  memberName: "font-medium text-gray-900 dark:text-white",
  memberRole: "text-xs text-gray-500 dark:text-gray-400",
};
