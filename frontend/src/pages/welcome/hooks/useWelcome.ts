import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetSessionQuery,
  useUpdateProfileMutation,
} from "../../../store/api/authApiSlice";

export const useWelcome = () => {
  const navigate = useNavigate();

  // Get user from RTK Query instead of Redux state
  const { data: user, isLoading } = useGetSessionQuery();

  useEffect(() => {
    if (!user) return;

    // Scenario A: Completed Onboarding -> Dashboard (Skip Welcome)
    if (user.hasCompletedOnboarding) {
      navigate("/dashboard");
      return;
    }

    // Scenario C: Returning Incomplete User -> Dashboard + Settings (Skip Welcome)
    // Check if account created > 2 minutes ago
    if (user.createdAt) {
      const createdTime = new Date(user.createdAt).getTime();
      const now = Date.now();
      const isNewUser = now - createdTime < 2 * 60 * 1000; // 2 minutes

      if (!isNewUser) {
        navigate("/dashboard", { state: { openOnboarding: true } });
      }
    }
  }, [user, navigate]);

  const [updateProfile] = useUpdateProfileMutation();

  const handleGetStarted = () => {
    updateProfile({ hasCompletedOnboarding: true });
    navigate("/dashboard", { state: { openOnboarding: true } });
  };

  return {
    handleGetStarted,
    isLoading,
  };
};
