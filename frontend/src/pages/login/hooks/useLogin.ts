import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../../components/ui";
import {
  useLoginMutation,
  useLoginWithGoogleMutation,
} from "../../../store/api/authApiSlice";

export const useLogin = () => {
  const navigate = useNavigate();

  // RTK Query mutations for auth
  const [login, { isLoading: isEmailLoading, error: emailError }] =
    useLoginMutation();
  const [loginWithGoogle, { isLoading: isGoogleLoading }] =
    useLoginWithGoogleMutation();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  // Combined loading state
  const isLoading = isEmailLoading || isGoogleLoading;

  const handleGoogleSignIn = () => {
    loginWithGoogle();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password }).unwrap();
      showToast.success("Login successfully");
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      showToast.error("Login failed");
    }
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
  };
};
