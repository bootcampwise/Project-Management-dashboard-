import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../../store/api/authApiSlice";
import { showToast, getErrorMessage } from "../../../components/ui";

export const useSignup = () => {
  const navigate = useNavigate();
  const [register, { isLoading, error }] = useRegisterMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ email, password }).unwrap();
      showToast.success("Your account has been created successfully");
      navigate("/welcome");
    } catch (error) {
      showToast.error(`Failed to create account. ${getErrorMessage(error)}`);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    error,
    handleSubmit,
  };
};
