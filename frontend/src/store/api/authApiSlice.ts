import { apiSlice, clearAuthTokenCache } from "./apiSlice";
import { supabase } from "../../lib/supabase";
import type { User } from "../../types";
import { clearLastProjectId } from "../../utils/projectStorage";

// ============================================
// AUTH API ENDPOINTS
// ============================================
// This file handles all authentication:
// - Email/password login and registration
// - OAuth login (Google, GitHub)
// - Session management
// - Profile updates

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ----------------------------------------
    // LOGIN WITH EMAIL - Sign in with email and password
    // ----------------------------------------
    // Usage: const [login, { isLoading }] = useLoginMutation()
    login: builder.mutation<User, { email: string; password: string }>({
      queryFn: async ({ email, password }, _api, _options, fetchWithBQ) => {
        try {
          // Step 1: Sign in with Supabase
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;
          if (!data.user) throw new Error("No user data returned");

          // Step 2: Create/update profile in our backend
          await fetchWithBQ({
            url: "/users/profile",
            method: "POST",
            body: {
              name: data.user.user_metadata?.full_name,
              avatar: data.user.user_metadata?.avatar_url,
            },
          });

          // Step 3: Get the full user profile from backend
          const result = await fetchWithBQ({ url: "/users/profile" });
          const backendProfile = result.data as User;

          // Step 4: Build the user object
          const user: User = {
            id: data.user.id,
            email: data.user.email || "",
            name: backendProfile?.name || data.user.email || "User",
            avatar:
              backendProfile?.avatar || data.user.user_metadata?.avatar_url,
            jobTitle: backendProfile?.jobTitle,
            department: backendProfile?.department,
            hasCompletedOnboarding: backendProfile?.hasCompletedOnboarding,
            createdAt: data.user.created_at,
          };

          return { data: user };
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "Login failed";
          return { error: { status: 401, data: message } };
        }
      },
      invalidatesTags: ["User"],
    }),

    // ----------------------------------------
    // LOGIN WITH GOOGLE - OAuth redirect
    // ----------------------------------------
    // Usage: const [loginWithGoogle, { isLoading }] = useLoginWithGoogleMutation()
    loginWithGoogle: builder.mutation<void, void>({
      queryFn: async () => {
        try {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
              redirectTo: `${window.location.origin}/welcome`,
            },
          });

          if (error) throw error;

          // Note: This will redirect the browser, so we won't reach here
          return { data: undefined };
        } catch (err: unknown) {
          const message =
            err instanceof Error ? err.message : "Google login failed";
          return { error: { status: 401, data: message } };
        }
      },
    }),

    // ----------------------------------------
    // LOGIN WITH GITHUB - OAuth redirect
    // ----------------------------------------
    // Usage: const [loginWithGithub, { isLoading }] = useLoginWithGithubMutation()
    loginWithGithub: builder.mutation<void, void>({
      queryFn: async () => {
        try {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: "github",
            options: {
              redirectTo: `${window.location.origin}/welcome`,
            },
          });

          if (error) throw error;

          // Note: This will redirect the browser, so we won't reach here
          return { data: undefined };
        } catch (err: unknown) {
          const message =
            err instanceof Error ? err.message : "GitHub login failed";
          return { error: { status: 401, data: message } };
        }
      },
    }),

    // ----------------------------------------
    // REGISTER - Create a new account
    // ----------------------------------------
    // Usage: const [register, { isLoading }] = useRegisterMutation()
    register: builder.mutation<User, { email: string; password: string }>({
      queryFn: async ({ email, password }, _api, _options, fetchWithBQ) => {
        try {
          // Step 1: Create account with Supabase
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          });

          if (error) throw error;
          if (!data.user) throw new Error("No user data returned");

          // Step 2: Create profile in our backend
          await fetchWithBQ({
            url: "/users/profile",
            method: "POST",
            body: {
              name: data.user.user_metadata?.full_name || email.split("@")[0],
              avatar: data.user.user_metadata?.avatar_url,
              email: email,
            },
          });

          // Step 3: Get the full user profile from backend
          const result = await fetchWithBQ({ url: "/users/profile" });
          const backendProfile = result.data as User;

          // Step 4: Build the user object
          const user: User = {
            id: data.user.id,
            email: data.user.email || "",
            name: backendProfile?.name || data.user.email || "User",
            avatar:
              backendProfile?.avatar || data.user.user_metadata?.avatar_url,
            jobTitle: backendProfile?.jobTitle,
            department: backendProfile?.department,
            hasCompletedOnboarding: backendProfile?.hasCompletedOnboarding,
            createdAt: data.user.created_at,
          };

          return { data: user };
        } catch (err: unknown) {
          const message =
            err instanceof Error ? err.message : "Registration failed";
          return { error: { status: 400, data: message } };
        }
      },
      invalidatesTags: ["User"],
    }),

    // ----------------------------------------
    // LOGOUT - Sign out the user
    // ----------------------------------------
    // Usage: const [logout] = useLogoutMutation()
    logout: builder.mutation<null, void>({
      queryFn: async () => {
        try {
          // Clear cached auth token first for security
          clearAuthTokenCache();
          // Clear saved project ID
          clearLastProjectId();

          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          return { data: null };
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "Logout failed";
          return { error: { status: 500, data: message } };
        }
      },
      invalidatesTags: ["User", "Project", "Task", "Team"],
    }),

    // ----------------------------------------
    // GET SESSION - Check if user is logged in
    // ----------------------------------------
    // Usage: const { data: user, isLoading } = useGetSessionQuery()
    getSession: builder.query<User | null, void>({
      queryFn: async (_arg, _api, _options, fetchWithBQ) => {
        try {
          // Step 1: Check if we have a session in Supabase
          const { data: sessionData, error } = await supabase.auth.getSession();

          if (error) throw error;
          if (!sessionData.session?.user) return { data: null };

          const supabaseUser = sessionData.session.user;

          // Step 2: Get the backend profile
          const result = await fetchWithBQ({ url: "/users/profile" });
          const backendProfile = (result.data as User) || {};

          // Step 3: Build the user object
          const user: User = {
            id: supabaseUser.id,
            email: supabaseUser.email || "",
            name:
              backendProfile.name ||
              supabaseUser.user_metadata?.full_name ||
              supabaseUser.email ||
              "User",
            avatar:
              backendProfile.avatar || supabaseUser.user_metadata?.avatar_url,
            jobTitle: backendProfile.jobTitle,
            department: backendProfile.department,
            hasCompletedOnboarding: backendProfile.hasCompletedOnboarding,
            createdAt: supabaseUser.created_at,
          };

          return { data: user };
        } catch (err: unknown) {
          const message =
            err instanceof Error ? err.message : "Session check failed";
          return { error: { status: 401, data: message } };
        }
      },
      providesTags: ["User"],
    }),

    // ----------------------------------------
    // UPDATE PROFILE - Update user information
    // ----------------------------------------
    // Usage: const [updateProfile] = useUpdateProfileMutation()
    updateProfile: builder.mutation<User, Partial<User>>({
      query: (userData) => ({
        url: "/users/profile",
        method: "PATCH",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    // ----------------------------------------
    // GET ALL USERS - Fetch all registered users
    // ----------------------------------------
    // Usage: const { data: users } = useGetAllUsersQuery()
    getAllUsers: builder.query<User[], void>({
      query: () => "/users",
      providesTags: ["User"],
    }),
  }),
});

// ============================================
// EXPORT HOOKS
// ============================================
// React hooks for using these endpoints in components

export const {
  // Email/Password Auth
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,

  // OAuth Auth
  useLoginWithGoogleMutation,
  useLoginWithGithubMutation,

  // Session
  useGetSessionQuery,
  useLazyGetSessionQuery,

  // Profile
  useUpdateProfileMutation,

  // Users
  useGetAllUsersQuery,
} = authApiSlice;
