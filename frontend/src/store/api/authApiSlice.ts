import { apiSlice, clearAuthTokenCache } from "./apiSlice";
import { supabase } from "../../lib/supabase";
import type { User } from "../../types";
import { clearLastProjectId } from "../../utils/projectStorage";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<User, { email: string; password: string }>({
      queryFn: async ({ email, password }, _api, _options, fetchWithBQ) => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;
          if (!data.user) throw new Error("No user data returned");

          await fetchWithBQ({
            url: "/users/profile",
            method: "POST",
            body: {
              name: data.user.user_metadata?.full_name,
              avatar: data.user.user_metadata?.avatar_url,
            },
          });

          const result = await fetchWithBQ({ url: "/users/profile" });
          const backendProfile = result.data as User;

          const user: User = {
            id: data.user.id,
            email: data.user.email || "",
            name: backendProfile?.name || data.user.email || "User",
            avatar: backendProfile?.avatar,
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

    loginWithGoogle: builder.mutation<void, void>({
      queryFn: async () => {
        try {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
              redirectTo: `${window.location.origin}/dashboard`,
            },
          });

          if (error) throw error;

          return { data: undefined };
        } catch (err: unknown) {
          const message =
            err instanceof Error ? err.message : "Google login failed";
          return { error: { status: 401, data: message } };
        }
      },
    }),

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

          return { data: undefined };
        } catch (err: unknown) {
          const message =
            err instanceof Error ? err.message : "GitHub login failed";
          return { error: { status: 401, data: message } };
        }
      },
    }),

    register: builder.mutation<User, { email: string; password: string }>({
      queryFn: async ({ email, password }, _api, _options, fetchWithBQ) => {
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          });

          if (error) throw error;
          if (!data.user) throw new Error("No user data returned");

          await fetchWithBQ({
            url: "/users/profile",
            method: "POST",
            body: {
              name: data.user.user_metadata?.full_name || email.split("@")[0],
              avatar: undefined,
              email: email,
            },
          });

          const result = await fetchWithBQ({ url: "/users/profile" });
          const backendProfile = result.data as User;

          const user: User = {
            id: data.user.id,
            email: data.user.email || "",
            name: backendProfile?.name || data.user.email || "User",
            avatar: backendProfile?.avatar,
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

    logout: builder.mutation<null, void>({
      queryFn: async () => {
        try {
          clearAuthTokenCache();
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
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(apiSlice.util.resetApiState());
      },
    }),

    getSession: builder.query<User | null, void>({
      queryFn: async (_arg, _api, _options, fetchWithBQ) => {
        try {
          const { data: sessionData, error } = await supabase.auth.getSession();

          if (error) throw error;
          if (!sessionData.session?.user) return { data: null };

          const supabaseUser = sessionData.session.user;

          const result = await fetchWithBQ({ url: "/users/profile" });
          const backendProfile = (result.data as User) || {};

          const user: User = {
            id: supabaseUser.id,
            email: supabaseUser.email || "",
            name:
              backendProfile.name ||
              supabaseUser.user_metadata?.full_name ||
              supabaseUser.email ||
              "User",
            avatar: backendProfile.avatar,
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
    updateProfile: builder.mutation<User, Partial<User>>({
      query: (userData) => ({
        url: "/users/profile",
        method: "PATCH",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    getAllUsers: builder.query<User[], void>({
      query: () => "/users",
      providesTags: ["User"],
    }),
    deleteAccount: builder.mutation<void, void>({
      query: () => ({
        url: "/users/profile",
        method: "DELETE",
      }),
      invalidatesTags: ["User", "Project", "Task", "Team"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useLoginWithGoogleMutation,
  useLoginWithGithubMutation,
  useGetSessionQuery,
  useLazyGetSessionQuery,
  useUpdateProfileMutation,
  useGetAllUsersQuery,
  useDeleteAccountMutation,
} = authApiSlice;
