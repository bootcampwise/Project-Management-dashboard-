import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setSidebarOpen } from "../store/slices/uiSlice";

export const useDashboard = () => {
  const dispatch = useAppDispatch();
  const { sidebarOpen } = useAppSelector((state) => state.ui);

  return {
    sidebarOpen,
    setSidebarOpen: (open: boolean) => dispatch(setSidebarOpen(open)),
  };
};
