export const sidebarClasses = {
  // Overlay
  overlay: "fixed inset-0 bg-black/40 z-40 md:hidden",

  // Sidebar Panel
  aside: (open: boolean) => `
    fixed md:static z-50
    top-0 left-0 h-full
    bg-sidebar border-r border-gray-200 flex flex-col
    transform transition-all duration-300 ease-in-out
    ${
      open
        ? "translate-x-0 w-[280px]"
        : "-translate-x-full w-0 md:translate-x-0 md:w-0 overflow-hidden"
    }
  `,

  // Header
  header: "h-14 px-4 flex items-center justify-between mb-2",

  logoWrapper:
    "flex items-center gap-2 cursor-pointer hover:bg-gray-200/50 p-1 rounded-md max-w-full",
  logoImage: "w-6 h-6 object-contain",
  logoText: "font-semibold text-gray-800 text-sm truncate",
  chevronIcon: "text-gray-500 flex-shrink-0",

  collapseButton:
    "text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-200/50",
  collapseImage: "w-8 h-8 object-contain opacity-60 hover:opacity-100",

  // Content
  scrollableContent: "flex-1 overflow-y-auto px-2 space-y-6",
  mainSection: "space-y-0.5",

  // Teamspaces
  teamspacesTitle: "px-4 text-xs font-semibold text-gray-400 mb-2",
  spacer: "h-2",

  // Footer
  footer: "p-2 border-t border-gray-200",
};
