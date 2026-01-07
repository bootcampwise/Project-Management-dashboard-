import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  toggleSidebar,
  setSidebarOpen,
  toggleSidebarSection,
  setSettingsOpen,
} from "../../../store/uiSlice";

export const useSidebar = () => {
  const dispatch = useAppDispatch();
  const { sidebarOpen, isSettingsOpen, sidebarSections } = useAppSelector(
    (state) => state.ui,
  );
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        dispatch(setSidebarOpen(false));
      } else {
        dispatch(setSidebarOpen(true));
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  return {
    open: sidebarOpen,
    sidebarOpen,
    isSettingsOpen,
    sections: sidebarSections,
    onClose: () => dispatch(setSidebarOpen(false)),
    toggleSidebar: () => dispatch(toggleSidebar()),
    setSidebarOpen: (open: boolean) => dispatch(setSidebarOpen(open)),
    setIsSettingsOpen: (open: boolean) => dispatch(setSettingsOpen(open)),
    toggleSection: (key: keyof typeof sidebarSections) =>
      dispatch(toggleSidebarSection(key)),
  };
};
