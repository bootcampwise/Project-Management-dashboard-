import { useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { useDispatch } from "react-redux";
import { checkSession, setUser } from "../../../store/slices/authSlice";
import type { AppDispatch } from "../../../store";

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
