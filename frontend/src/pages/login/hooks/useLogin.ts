import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { showToast, getErrorMessage } from "../../../components/ui";
import {
  useLoginMutation,
  useLoginWithGoogleMutation,
} from "../../../store/api/authApiSlice";

type AuthView = "login" | "forgot-password";

export const useLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const accountDeleted = localStorage.getItem("accountDeleted");
    if (accountDeleted === "true") {
      localStorage.removeItem("accountDeleted");
      showToast.success("Account deleted successfully");
    }
  }, []);

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ||
    "/dashboard";

  const [login, { isLoading: isEmailLoading, error: emailError }] =
    useLoginMutation();
  const [loginWithGoogle, { isLoading: isGoogleLoading }] =
    useLoginWithGoogleMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [view, setView] = useState<AuthView>("login");
  const isLoading = isEmailLoading || isGoogleLoading;

  const handleGoogleSignIn = () => {
    loginWithGoogle();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await login({ email, password }).unwrap();
      showToast.success("Login successfully");

      if (!user.hasCompletedOnboarding) {
        navigate("/welcome", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (error) {
      showToast.error(`Failed to login. ${getErrorMessage(error)}`);
    }
  };

  const handleForgotPassword = () => {
    setView("forgot-password");
  };
  const handleBackToLogin = () => {
    setView("login");
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    error: emailError,
    isHovered,
    setIsHovered,
    handleGoogleSignIn,
    handleSubmit,
    navigate,
    authView: view,
    setAuthView: setView,
    handleForgotPassword,
    handleBackToLogin,
  };
};
