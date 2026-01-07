import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetSessionQuery,
  useUpdateProfileMutation,
} from "../../../store/api/authApiSlice";

export const useWelcome = () => {
  const navigate = useNavigate();

  const { data: user, isLoading } = useGetSessionQuery();

  const shouldRedirect = (() => {
    if (!user) return false;
    if (user.hasCompletedOnboarding) return true;
    if (user.createdAt) {
      const createdTime = new Date(user.createdAt).getTime();
      const now = Date.now();
      const isNewUser = now - createdTime < 2 * 60 * 1000;
      if (!isNewUser) return true;
    }
    return false;
  })();

  useEffect(() => {
    if (shouldRedirect) {
      if (user?.hasCompletedOnboarding) {
        navigate("/dashboard");
      } else {
        navigate("/dashboard", { state: { openOnboarding: true } });
      }
    }
  }, [shouldRedirect, user, navigate]);

  const [updateProfile] = useUpdateProfileMutation();

  const handleGetStarted = () => {
    updateProfile({ hasCompletedOnboarding: true });
    navigate("/dashboard", { state: { openOnboarding: true } });
  };

  return {
    handleGetStarted,
    isLoading,
    shouldRedirect,
  };
};
