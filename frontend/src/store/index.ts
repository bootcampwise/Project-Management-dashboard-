import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./slices/uiSlice";
import projectReducer from "./slices/projectSlice";
import taskReducer from "./slices/taskSlice";
import authReducer from "./slices/authSlice";
import teamReducer from "./slices/teamSlice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    project: projectReducer,
    task: taskReducer,
    auth: authReducer,
    team: teamReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
