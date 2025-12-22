import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  toggleSidebar,
  setSidebarOpen,
  toggleSidebarSection,
  setSettingsOpen,
} from "../../store/slices/uiSlice";

export const useSidebar = () => {
  const dispatch = useAppDispatch();
  const { sidebarOpen, isSettingsOpen, sidebarSections } = useAppSelector(
    (state) => state.ui
  );

  // Centralized Resize Logic
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        dispatch(setSidebarOpen(false));
      } else {
        dispatch(setSidebarOpen(true));
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  return {
    // State
    open: sidebarOpen, // Mapping sidebarOpen to 'open' to match existing usage in Sidebar component if needed, or just expose sidebarOpen
    sidebarOpen,
    isSettingsOpen,
    sections: sidebarSections,

    // Actions
    onClose: () => dispatch(setSidebarOpen(false)), // Helper for simple close
    toggleSidebar: () => dispatch(toggleSidebar()),
    setSidebarOpen: (open: boolean) => dispatch(setSidebarOpen(open)),
    setIsSettingsOpen: (open: boolean) => dispatch(setSettingsOpen(open)),
    toggleSection: (key: keyof typeof sidebarSections) =>
      dispatch(toggleSidebarSection(key)),
  };
};
