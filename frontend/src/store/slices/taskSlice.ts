import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type {
  Task,
  BoardColumn,
  TaskState,
  CreateTaskPayload,
} from "../../types";
import { apiClient } from "../../lib/apiClient";

export const fetchTasks = createAsyncThunk(
  "task/fetchTasks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<Task[]>("/tasks");
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch tasks");
    }
  }
);

export const createTask = createAsyncThunk(
  "task/createTask",
  async (taskData: CreateTaskPayload, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<Task>("/tasks", taskData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create task");
    }
  }
);

const initialState: TaskState & {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
} = {
  activeView: "kanban",
  columns: [],
  tasks: [],
  selectedTask: null,
  isCreateTaskModalOpen: false,
  modalInitialStatus: undefined,
  isLoading: false,
  error: null,
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
  },
  extraReducers: (builder) => {
    // Fetch Tasks
    builder.addCase(fetchTasks.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.isLoading = false;
      state.tasks = action.payload;
    });
    builder.addCase(fetchTasks.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Create Task
    builder.addCase(createTask.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createTask.fulfilled, (state, action) => {
      state.isLoading = false;
      state.tasks.push(action.payload);
    });
    builder.addCase(createTask.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const {
  setActiveView,
  setSelectedTask,
  setCreateTaskModalOpen,
  setModalInitialStatus,
} = taskSlice.actions;

export default taskSlice.reducer;
