import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setSidebarOpen, setSettingsOpen } from "../../../store/uiSlice";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useGetProjectsQuery } from "../../../store/api/projectApiSlice";
import { useGetTasksQuery } from "../../../store/api/taskApiSlice";
import { useGetTeamsQuery } from "../../../store/api/teamApiSlice";

export const useDashboard = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { sidebarOpen } = useAppSelector((state) => state.ui);

  // Prefetch core data on dashboard load - this populates the cache
  // so navigation to Projects, Tasks, and Team pages is instant
  useGetProjectsQuery();
  useGetTasksQuery();
  useGetTeamsQuery();

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
