import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useLoginWithGoogleMutation,
  useLoginWithGithubMutation,
  useRegisterMutation,
  useLazyGetSessionQuery,
} from "../../../store/api/authApiSlice";
import { showToast, getErrorMessage } from "../../../components/ui";

type RegisterStep = "email" | "password";

export const useRegister = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState<RegisterStep>("email");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [loginWithGoogle, { isLoading: isGoogleLoading }] =
    useLoginWithGoogleMutation();
  const [loginWithGithub, { isLoading: isGithubLoading }] =
    useLoginWithGithubMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const [triggerGetSession] = useLazyGetSessionQuery();

  const isEmailValid = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleContinue = () => {
    setEmailError("");

    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }
    if (!isEmailValid(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setStep("password");
  };

  const handleBack = () => {
    setStep("email");
    setPassword("");
    setConfirmPassword("");
  };

  const handleCreateAccount = async () => {
    setPasswordError("");
    setConfirmPasswordError("");

    if (!password) {
      setPasswordError("Password is required");
      return;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }

    try {
      await register({ email, password }).unwrap();
      await triggerGetSession().unwrap();
      showToast.success("Account created successfully!");
      navigate("/welcome", { replace: true });
    } catch (error) {
      showToast.error(`Failed to create account. ${getErrorMessage(error)}`);
    }
  };

  const handleGoogleSignIn = () => {
    loginWithGoogle();
  };

  const handleGithubSignIn = () => {
    loginWithGithub();
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    step,
    emailError,
    setEmailError,
    passwordError,
    setPasswordError,
    confirmPasswordError,
    setConfirmPasswordError,
    isGoogleLoading,
    isGithubLoading,
    isRegisterLoading,
    isLoading: isGoogleLoading || isGithubLoading || isRegisterLoading,
    handleContinue,
    handleBack,
    handleCreateAccount,
    handleGoogleSignIn,
    handleGithubSignIn,
  };
};
