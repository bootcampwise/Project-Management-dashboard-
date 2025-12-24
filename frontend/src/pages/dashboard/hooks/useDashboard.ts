import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setSidebarOpen, setSettingsOpen } from "../../../store/uiSlice";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useDashboard = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { sidebarOpen } = useAppSelector((state) => state.ui);

  useEffect(() => {
    if (location.state?.openOnboarding) {
      dispatch(setSettingsOpen(true));
      // Clear state so it doesn't reopen on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location, dispatch]);

  return {
    sidebarOpen,
    setSidebarOpen: (open: boolean) => dispatch(setSidebarOpen(open)),
  };
};
