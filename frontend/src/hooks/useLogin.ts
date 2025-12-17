import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { signInWithGoogle, signInWithEmail } from "../store/slices/authSlice";
import type { AppDispatch, RootState } from "../store";

export const useLogin = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const handleGoogleSignIn = () => {
    dispatch(signInWithGoogle());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(signInWithEmail({ email, password })).unwrap();
      toast.success("Login successfully");
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      toast.error("Login failed");
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    error,
    isHovered,
    setIsHovered,
    handleGoogleSignIn,
    handleSubmit,
    navigate, // exposing if needed, though mostly handled internally
  };
};
