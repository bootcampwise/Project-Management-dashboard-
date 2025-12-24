export const projectboardClasses = {
  container: "flex h-screen bg-white relative font-sans",
  main: "flex-1 overflow-y-auto bg-white flex flex-col",
  mainContent: (sidebarOpen: boolean) =>
    `transition-all duration-300 flex-1 flex flex-col ${
      !sidebarOpen ? "pt-16 md:pt-0 md:pl-16" : ""
    }`,

  menuButton: (sidebarOpen: boolean) =>
    `absolute top-4 left-4 z-30 p-2 bg-white rounded-md shadow ${
      sidebarOpen ? "md:hidden" : "block"
    }`,

  headerWrapper:
    "px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4",
  headerTitleWrapper: "flex items-center gap-4",
  headerMenuWrapper: "flex items-center gap-2 relative",
  headerTitleClickable:
    "flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded-md transition-colors",
  headerTitle: "text-xl font-bold text-gray-800",

  dropdown:
    "absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1",
  dropdownHeader:
    "px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider",
  dropdownItem: (isActive: boolean) =>
    `w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-gray-50 ${
      isActive ? "bg-blue-50 text-blue-600" : "text-gray-700"
    }`,
  dropdownItemText: "truncate",
  dropdownEmpty: "px-3 py-2 text-sm text-gray-500 italic",
  dropdownDivider: "border-t border-gray-100 mt-1 pt-1",
  dropdownCreateButton:
    "w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-gray-50 flex items-center gap-2",

  starIcon: "text-yellow-400 fill-current ml-2",
  menuIconButton: "p-1 hover:bg-gray-100 rounded-md transition-colors",
  menuIconColor: "text-gray-400",
  menuDropdown:
    "absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1",
  menuDropdownHeader: "px-4 py-2 border-b border-gray-100",
  menuDropdownLabel: "text-xs text-gray-500",
  menuDropdownValue: "text-sm font-medium text-gray-800 truncate",
  menuDropdownItem:
    "w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2",
  menuDropdownDeleteItem:
    "w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2",

  statusBadge:
    "flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full",
  statusDot: "w-2 h-2 rounded-full bg-green-500",

  actionsWrapper: "flex items-center gap-3",
  avatarsWrapper: "flex -space-x-2 mr-2",
  avatar:
    "w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs text-gray-600 font-medium overflow-hidden",
  avatarImage: "w-full h-full object-cover",
  avatarFallback:
    "w-full h-full flex items-center justify-center bg-blue-100 text-blue-600",
  avatarOverflow:
    "w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-medium",
  shareButton:
    "flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 text-sm hover:bg-gray-50 bg-white",
  createButton:
    "flex items-center gap-2 px-3 py-1.5 bg-blue-600 rounded-md text-white text-sm hover:bg-blue-700",
  createButtonChevron: "border-l border-blue-500 pl-1 ml-1 h-4 w-auto",

  toolbar:
    "px-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4",
  tabsWrapper: "flex items-center gap-6 overflow-x-auto no-scrollbar",
  tab: (isActive: boolean) =>
    `flex items-center gap-2 py-3 border-b-2 text-sm font-medium transition-colors ${
      isActive
        ? "border-gray-800 text-gray-800"
        : "border-transparent text-gray-500 hover:text-gray-700"
    }`,
  addTabButton:
    "flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm font-medium py-3 ml-2 cursor-pointer",

  toolsWrapper: "flex items-center gap-4 py-2",
  toolItem:
    "flex items-center gap-2 text-gray-500 hover:text-gray-700 cursor-pointer",
  toolText: "text-sm",
  toolDivider: "h-4 w-px bg-gray-300 mx-1",

  contentArea: "flex-1 p-6 bg-white overflow-x-auto",

  dashboardWrapper: "p-6",
  dashboardTitle: "text-lg font-semibold mb-4",
  membersGrid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
  memberCard:
    "flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm",
  memberAvatar:
    "w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden",
  memberName: "font-medium text-gray-900",
  memberRole: "text-xs text-gray-500",
};
