import { useState, useEffect, useCallback, useRef } from "react";
import { showToast, getErrorMessage } from "../../../components/ui";
import { supabase } from "../../../lib/supabase";

type ForgotPasswordView = "email" | "otp" | "reset-password";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const useForgotPassword = (
  initialEmail: string = "",
  onSuccess: () => void,
) => {
  const [view, setView] = useState<ForgotPasswordView>("email");
  const [resetEmail, setResetEmail] = useState(initialEmail);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (initialEmail) setResetEmail(initialEmail);
  }, [initialEmail]);
  useEffect(() => {
    if (countdown > 0) {
      timerRef.current = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [countdown]);

  useEffect(() => {
    return () => {
      setOtp(["", "", "", "", "", ""]);
      setNewPassword("");
      setConfirmPassword("");
    };
  }, []);

  const clearSensitiveData = () => {
    setOtp(["", "", "", "", "", ""]);
    setNewPassword("");
    setConfirmPassword("");
  };

  const resetState = useCallback(() => {
    clearSensitiveData();
    setCountdown(0);
    setView("email");
  }, []);

  const handleSendOtp = useCallback(async () => {
    if (!resetEmail.trim()) {
      showToast.error("Please enter your email address");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail)) {
      showToast.error("Please enter a valid email address");
      return;
    }

    setIsSendingOtp(true);
    try {
      const res = await fetch(`${API_URL}/users/check-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        const errorMsg =
          errorData?.error || errorData?.message || res.statusText;
        throw new Error(errorMsg);
      }

      const { exists } = await res.json();
      if (!exists) {
        showToast.error("User not exists");
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail);
      if (error) {
        showToast.error(`Failed to send code. ${error.message}`);
        return;
      }

      showToast.success("Verification code sent to your email");
      setCountdown(60);
      setView("otp");
    } catch (error) {
      showToast.error(`Failed to send code. ${getErrorMessage(error)}`);
    } finally {
      setIsSendingOtp(false);
    }
  }, [resetEmail]);

  const handleResendOtp = useCallback(async () => {
    if (countdown > 0) return;
    await handleSendOtp();
  }, [countdown, handleSendOtp]);
  const handleOtpChange = useCallback((index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setOtp((prev) => {
      const newOtp = [...prev];
      newOtp[index] = digit;
      return newOtp;
    });
    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  }, []);

  const handleOtpKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        otpInputRefs.current[index - 1]?.focus();
      }
    },
    [otp],
  );

  const handleOtpPaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const newOtp = ["", "", "", "", "", ""];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    otpInputRefs.current[Math.min(pasted.length, 5)]?.focus();
  }, []);

  const handleVerifyOtp = useCallback(async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      showToast.error("Please enter the complete 6-digit code");
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: resetEmail,
        token: otpCode,
        type: "recovery",
      });

      if (error) {
        showToast.error(`Verification failed. ${error.message}`);
        return;
      }

      showToast.success("Code verified successfully");
      setView("reset-password");
    } catch (error) {
      showToast.error(`Verification failed. ${getErrorMessage(error)}`);
    } finally {
      setIsVerifyingOtp(false);
    }
  }, [otp, resetEmail]);

  const handlePasswordReset = useCallback(async () => {
    if (!newPassword.trim()) {
      showToast.error("Please enter a new password");
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      showToast.error(
        "Password must be 8+ chars with uppercase, lowercase, number & special character",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast.error("Passwords do not match");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        if (error.message.includes("session")) {
          showToast.error("Session expired. Please restart the process.");
          resetState();
          return;
        }
        showToast.error(`Failed to update password. ${error.message}`);
        return;
      }

      showToast.success(
        "Password updated! Please log in with your new password.",
      );
      clearSensitiveData();
      await supabase.auth.signOut();
      onSuccess();
    } catch (error) {
      showToast.error(`Failed to update password. ${getErrorMessage(error)}`);
    } finally {
      setIsUpdatingPassword(false);
    }
  }, [newPassword, confirmPassword, resetState, onSuccess]);

  const handleBackToEmail = useCallback(() => {
    setOtp(["", "", "", "", "", ""]);
    setCountdown(0);
    setView("email");
  }, []);

  return {
    view,
    resetEmail,
    setResetEmail,
    isSendingOtp,
    handleSendOtp,
    otp,
    otpInputRefs,
    handleOtpChange,
    handleOtpKeyDown,
    handleOtpPaste,
    isVerifyingOtp,
    handleVerifyOtp,
    countdown,
    handleResendOtp,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    isUpdatingPassword,
    handlePasswordReset,
    handleBackToEmail,
    resetState,
  };
};
