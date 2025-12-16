import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Task, BoardColumn, TaskState } from "../../types";

// Initial Mock Data
const initialColumns: BoardColumn[] = [
  {
    id: "todo",
    title: "To-Do",
    color: "#3B82F6",
    tasks: [
      {
        id: 1,
        name: "Design Landing Page",
        title: "Design Landing Page", // Alias for compatibility
        description: "Create responsive layout for homepage with CTA and p...",
        assignees: [
          "https://i.pravatar.cc/150?u=1",
          "https://i.pravatar.cc/150?u=2",
        ],
        dueDate: "Aug 15,2025",
        startDate: "Aug 15,2025",
        endDate: "Aug 15,2025",
        priority: "High",
        status: "To-Do",
        subtasks: 3,
        comments: 7,
        attachments: 5,
        project: "Workix",
      },
      // ... (preserving other tasks implementation would go here, simplified for brevity but user can add more)
      {
        id: 2,
        name: "Prepare Project Timeline",
        title: "Prepare Project Timeline",
        description: "Define milestones and deadlines for the Q4 roadmap.",
        assignees: ["https://i.pravatar.cc/150?u=3"],
        dueDate: "Aug 7,2025",
        startDate: "Aug 7,2025",
        endDate: "Aug 7,2025",
        priority: "Medium",
        status: "To-Do",
        subtasks: 5,
        comments: 3,
        attachments: 5,
        project: "Pragma",
      },
    ],
  },
  {
    id: "inprogress",
    title: "In Progress",
    color: "#F59E0B",
    tasks: [
      {
        id: 4,
        name: "Write Onboarding Emails",
        title: "Write Onboarding Emails",
        description: "Craft a 3-step welcome sequence for new users.",
        assignees: ["https://i.pravatar.cc/150?u=5"],
        dueDate: "Aug 3,2025",
        startDate: "Aug 3,2025",
        endDate: "Aug 3,2025",
        priority: "Medium",
        status: "In Progress",
        subtasks: 3,
        comments: 1,
        attachments: 7,
        project: "PrimeWire",
      },
    ],
  },
  {
    id: "completed",
    title: "Completed",
    color: "#10B981",
    tasks: [],
  },
  {
    id: "cancelled",
    title: "Cancelled",
    color: "#EF4444",
    tasks: [],
  },
];

const initialState: TaskState = {
  activeView: "kanban",
  columns: initialColumns,
  selectedTask: null,
  isCreateTaskModalOpen: false,
  modalInitialStatus: undefined,
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setActiveView: (state, action: PayloadAction<"kanban" | "list">) => {
      state.activeView = action.payload;
    },
    setSelectedTask: (state, action: PayloadAction<Task | null>) => {
      state.selectedTask = action.payload;
    },
    setCreateTaskModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isCreateTaskModalOpen = action.payload;
    },
    setModalInitialStatus: (
      state,
      action: PayloadAction<string | undefined>
    ) => {
      state.modalInitialStatus = action.payload;
    },
    addTask: (
      state,
      action: PayloadAction<{ columnId: string; task: Task }>
    ) => {
      const column = state.columns.find(
        (c) => c.id === action.payload.columnId
      );
      if (column) {
        column.tasks.push(action.payload.task);
      }
    },
  },
});

export const {
  setActiveView,
  setSelectedTask,
  setCreateTaskModalOpen,
  setModalInitialStatus,
  addTask,
} = taskSlice.actions;

export default taskSlice.reducer;
