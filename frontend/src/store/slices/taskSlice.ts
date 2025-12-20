import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { Task, TaskState, CreateTaskPayload } from "../../types";
import { apiClient } from "../../lib/apiClient";

export const updateTask = createAsyncThunk(
  "task/updateTask",
  async (
    { id, data }: { id: string; data: Partial<CreateTaskPayload> },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.patch<Task>(`/tasks/${id}`, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update task");
    }
  }
);

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
      // Use JSON body directly. Frontend (useCreateTaskModal) will handle file uploads to Supabase
      // and pass attachment metadata in taskData.attachments.
      const body = taskData;

      const response = await apiClient.post<Task>("/tasks", body);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create task");
    }
  }
);

export const getTaskDetails = createAsyncThunk(
  "task/getTaskDetails",
  async (taskId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<Task>(`/tasks/${taskId}`);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch task details");
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

    // Update Task
    builder.addCase(updateTask.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateTask.fulfilled, (state, action) => {
      state.isLoading = false;
      const index = state.tasks.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
      if (state.selectedTask?.id === action.payload.id) {
        state.selectedTask = action.payload;
      }
    });
    builder.addCase(updateTask.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Get Task Details
    builder.addCase(getTaskDetails.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getTaskDetails.fulfilled, (state, action) => {
      state.isLoading = false;
      const index = state.tasks.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      } else {
        state.tasks.push(action.payload);
      }
      state.selectedTask = action.payload;
    });
    builder.addCase(getTaskDetails.rejected, (state, action) => {
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
