import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { supabase } from "../../lib/supabase";
import { apiClient } from "../../lib/apiClient";

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

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
          redirectTo: `${window.location.origin}/login2`,
        },
      });

      if (error) throw error;
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
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
          redirectTo: `${window.location.origin}/login2`,
        },
      });

      if (error) throw error;
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
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
      return data.user;
    } catch (error: any) {
      return rejectWithValue(error.message);
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
        await apiClient.post("/users/profile", {
          name: data.user.user_metadata?.full_name,
          avatar: data.user.user_metadata?.avatar_url,
        });
      }

      return data.user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createBackendProfile = createAsyncThunk(
  "auth/createBackendProfile",
  async (_, { rejectWithValue }) => {
    try {
      const user = await apiClient.post("/users/profile", {});
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message);
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
      return session?.user || null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const signOut = createAsyncThunk(
  "auth/signOut",
  async (_, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      return rejectWithValue(error.message);
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
          const user = action.payload;
          state.user = {
            id: user.id,
            email: user.email || "",
            name: user.user_metadata?.full_name || user.email || "User",
            avatar: user.user_metadata?.avatar_url,
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
      .addCase(signInWithEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUser, setLoading } = authSlice.actions;

export default authSlice.reducer;
