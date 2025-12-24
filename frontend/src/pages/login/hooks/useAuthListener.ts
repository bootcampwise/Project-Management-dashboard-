import { useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { useLazyGetSessionQuery } from "../../../store/api/authApiSlice";
import { apiSlice } from "../../../store/api/apiSlice";
import { useAppDispatch } from "../../../store/hooks";

/**
 * Auth Listener Hook
 *
 * Listens for Supabase auth state changes and syncs with RTK Query cache.
 * - On app load: checks for existing session
 * - On login: refetches user data
 * - On logout: invalidates RTK Query cache
 */
export const useAuthListener = () => {
  const dispatch = useAppDispatch();
  const [getSession] = useLazyGetSessionQuery();

  useEffect(() => {
    // Initial session check on app load
    getSession();

    // Listen for auth state changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        // User logged in - refetch session data
        getSession();
      } else {
        // User logged out - invalidate all cached data
        dispatch(apiSlice.util.resetApiState());
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch, getSession]);
};
