import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { supabase } from "../lib/supabase";
import { setUser, checkSession } from "../store/slices/authSlice";
import type { AppDispatch } from "../store";

export const useAuthListener = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Initial session check
    dispatch(checkSession());

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        // Fetch full profile from backend to ensure we have custom fields (jobTitle, department)
        // and the correct avatar, rather than relying on potentially stale Supabase metadata.
        dispatch(checkSession());
      } else {
        dispatch(setUser(null));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);
};
