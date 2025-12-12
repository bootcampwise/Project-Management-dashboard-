import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setActiveView } from "../store/slices/taskSlice";
import { setSidebarOpen } from "../store/slices/uiSlice";

export const useTasks = () => {
  const dispatch = useAppDispatch();

  // Selectors
  const { activeView, columns } = useAppSelector((state) => state.task);
  const { sidebarOpen } = useAppSelector((state) => state.ui);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-600";
      case "Medium":
        return "bg-yellow-100 text-yellow-600";
      case "Low":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return {
    // States
    sidebarOpen,
    setSidebarOpen: (open: boolean) => dispatch(setSidebarOpen(open)),
    activeView,
    setActiveView: (view: "kanban" | "list") => dispatch(setActiveView(view)),

    // Data
    columns,

    // Helpers
    getPriorityColor,
  };
};
