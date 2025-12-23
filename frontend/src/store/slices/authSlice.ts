import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { supabase } from "../../lib/supabase";
import { apiClient } from "../../lib/apiClient";

import type { User, AuthState } from "../../types";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

export const signInWithGoogle = createAsyncThunk(
  "auth/signInWithGoogle",
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/welcome`,
        },
      });

      if (error) throw error;
      return data;
    } catch (err: unknown) {
      let message = "An unexpected error occurred";
      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === "string") {
        message = err;
      }
      return rejectWithValue(message);
    }
  }
);

export const signInWithGithub = createAsyncThunk(
  "auth/signInWithGithub",
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/welcome`,
        },
      });

      if (error) throw error;
      return data;
    } catch (err: unknown) {
      let message = "An unexpected error occurred";
      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === "string") {
        message = err;
      }
      return rejectWithValue(message);
    }
  }
);

export const signUpWithEmail = createAsyncThunk(
  "auth/signUpWithEmail",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // Create backend profile
      if (data.user) {
        // Initial create/ensure profile exists
        await apiClient.post("/users/profile", {
          name: data.user.user_metadata?.full_name || email.split("@")[0],
          avatar: data.user.user_metadata?.avatar_url,
          email: email,
        });

        // Now fetch full profile to get hasCompletedOnboarding
        const backendUser = await apiClient.get<User>("/users/profile");
        return {
          ...data.user,
          ...backendUser,
          id: data.user.id,
          email: data.user.email,
          createdAt: data.user.created_at,
        };
      }

      return data.user;
    } catch (err: unknown) {
      let message = "An unexpected error occurred";
      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === "string") {
        message = err;
      }
      return rejectWithValue(message);
    }
  }
);

export const signInWithEmail = createAsyncThunk(
  "auth/signInWithEmail",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Create/get backend profile
      if (data.user) {
        // Initial create/ensure profile exists
        await apiClient.post("/users/profile", {
          name: data.user.user_metadata?.full_name,
          avatar: data.user.user_metadata?.avatar_url,
        });

        // Now fetch full profile to get hasCompletedOnboarding
        const backendUser = await apiClient.get<User>("/users/profile");
        return {
          ...data.user,
          ...backendUser,
          id: data.user.id,
          email: data.user.email,
          createdAt: data.user.created_at,
        };
      }

      return data.user;
    } catch (err: unknown) {
      let message = "An unexpected error occurred";
      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === "string") {
        message = err;
      }
      return rejectWithValue(message);
    }
  }
);

export const createBackendProfile = createAsyncThunk(
  "auth/createBackendProfile",
  async (_, { rejectWithValue }) => {
    try {
      const user = await apiClient.post("/users/profile", {});
      return user;
    } catch (err: unknown) {
      let message = "An unexpected error occurred";
      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === "string") {
        message = err;
      }
      return rejectWithValue(message);
    }
  }
);

export const checkSession = createAsyncThunk(
  "auth/checkSession",
  async (_, { rejectWithValue }) => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) throw error;

      if (!session?.user) return null;

      try {
        // Fetch backend profile to get full user data including hasCompletedOnboarding
        const response = await apiClient.get<User>("/users/profile");
        const backendUser = response;

        return {
          ...session.user,
          ...backendUser,
          id: session.user.id,
          email: session.user.email,
          createdAt: session.user.created_at,
        };
      } catch (err) {
        // Fallback if backend profile fetch fails
        return {
          id: session.user.id,
          email: session.user.email,
          name:
            session.user.user_metadata?.full_name ||
            session.user.email ||
            "User",
          avatar: session.user.user_metadata?.avatar_url,
          createdAt: session.user.created_at,
        };
      }
    } catch (err: unknown) {
      let message = "An unexpected error occurred";
      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === "string") {
        message = err;
      }
      return rejectWithValue(message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (userData: Partial<User>, { rejectWithValue }) => {
    try {
      const data = await apiClient.patch<User>("/users/profile", userData);
      return data;
    } catch (err: unknown) {
      let message = "An unexpected error occurred";
      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === "string") {
        message = err;
      }
      return rejectWithValue(message);
    }
  }
);

export const signOut = createAsyncThunk(
  "auth/signOut",
  async (_, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (err: unknown) {
      let message = "An unexpected error occurred";
      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === "string") {
        message = err;
      }
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isLoading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Sign In with Google
      .addCase(signInWithGoogle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInWithGoogle.fulfilled, (state) => {
        state.isLoading = false;
        // Note: Actual user state is set via onAuthStateChange listener
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Sign In with Github
      .addCase(signInWithGithub.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInWithGithub.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(signInWithGithub.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Check Session
      .addCase(checkSession.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkSession.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          // payload is now the merged user object
          state.user = {
            id: action.payload.id,
            email: action.payload.email || "",
            name: action.payload.name || action.payload.email || "User",
            avatar: action.payload.avatar,
            jobTitle:
              "jobTitle" in action.payload
                ? action.payload.jobTitle
                : undefined,
            department:
              "department" in action.payload
                ? action.payload.department
                : undefined,
            hasCompletedOnboarding:
              "hasCompletedOnboarding" in action.payload
                ? action.payload.hasCompletedOnboarding
                : undefined,
            createdAt: action.payload.createdAt,
          };
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(checkSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update User Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.user) {
          state.user = { ...state.user, ...action.payload };
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Sign Out
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      // Sign Up with Email
      .addCase(signUpWithEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUpWithEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          const user = action.payload;
          state.user = {
            id: user.id,
            email: user.email || "",
            name: user.user_metadata?.full_name || user.email || "User",
            avatar: user.user_metadata?.avatar_url,
          };
          state.isAuthenticated = true;
        }
      })
      .addCase(signUpWithEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Sign In with Email
      .addCase(signInWithEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInWithEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = {
            id: action.payload.id,
            email: action.payload.email || "",
            name: action.payload.name || action.payload.email || "User",
            avatar: action.payload.avatar,
            jobTitle: action.payload.jobTitle,
            department: action.payload.department,
            hasCompletedOnboarding: action.payload.hasCompletedOnboarding,
            createdAt: action.payload.createdAt,
          };
          state.isAuthenticated = true;
        }
      })
      .addCase(signInWithEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUser, setLoading } = authSlice.actions;

export default authSlice.reducer;
