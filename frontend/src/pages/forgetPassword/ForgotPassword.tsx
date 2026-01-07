import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useForgotPassword } from "./hooks/useForgotPassword";
import {
  forgotPasswordStyles,
  forgotPasswordClasses,
} from "./forgotPasswordStyle";
import { loginClasses } from "../login/loginStyle";
import { Button, Input } from "../../components/ui";
import type { ForgotPasswordProps } from "../../types";

const ForgotPassword: React.FC<ForgotPasswordProps> = ({
  initialEmail = "",
  onBack,
  onSuccess,
}) => {
  const {
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
  } = useForgotPassword(initialEmail, onSuccess);

  return (
    <div className={forgotPasswordClasses.container}>
      <AnimatePresence mode="wait">
        {view === "email" && (
          <motion.div
            key="email-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <h2
              className={forgotPasswordClasses.title}
              style={forgotPasswordStyles.title}
            >
              Reset Password
            </h2>
            <p
              className={forgotPasswordClasses.subtitle}
              style={forgotPasswordStyles.subtitle}
            >
              Enter your email address and we'll send you a verification code.
            </p>

            <div className={forgotPasswordClasses.passwordForm}>
              <Input
                type="email"
                label="Email Address"
                required
                placeholder="name@company.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className={forgotPasswordClasses.input}
              />
            </div>

            <Button
              type="button"
              variant="primary"
              size="lg"
              isLoading={isSendingOtp}
              className={forgotPasswordClasses.submitButton}
              onClick={handleSendOtp}
            >
              Send Verification Code
            </Button>

            <div className={forgotPasswordClasses.backWrapper}>
              <button
                type="button"
                onClick={onBack}
                className={forgotPasswordClasses.backButton}
              >
                Back to Login
              </button>
            </div>
          </motion.div>
        )}

        {view === "otp" && (
          <motion.div
            key="otp-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <h2
              className={forgotPasswordClasses.title}
              style={forgotPasswordStyles.title}
            >
              Verify Code
            </h2>
            <p
              className={forgotPasswordClasses.subtitle}
              style={forgotPasswordStyles.subtitle}
            >
              Enter the 6-digit code sent to
              <span
                className={forgotPasswordClasses.emailHighlight}
                style={forgotPasswordStyles.emailDisplay}
              >
                {resetEmail}
              </span>
            </p>

            <div
              className={forgotPasswordClasses.otpContainer}
              style={forgotPasswordStyles.otpContainer}
            >
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    otpInputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onPaste={handleOtpPaste}
                  className={`${forgotPasswordClasses.otpInput} ${
                    digit ? forgotPasswordClasses.otpInputFilled : ""
                  }`}
                  style={forgotPasswordStyles.otpInput}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <Button
              type="button"
              variant="primary"
              size="lg"
              isLoading={isVerifyingOtp}
              className={forgotPasswordClasses.submitButton}
              onClick={handleVerifyOtp}
            >
              Verify Code
            </Button>

            <div
              className={forgotPasswordClasses.countdownWrapper}
              style={forgotPasswordStyles.countdownText}
            >
              {countdown > 0 ? (
                <span className={forgotPasswordClasses.countdownText}>
                  Resend code in{" "}
                  <span className="font-semibold text-brand-blue">
                    {countdown}s
                  </span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className={forgotPasswordClasses.resendButton}
                  style={forgotPasswordStyles.resendButton}
                >
                  Resend Code
                </button>
              )}
            </div>

            <div className={forgotPasswordClasses.backWrapper}>
              <button
                type="button"
                onClick={handleBackToEmail}
                className={forgotPasswordClasses.backButton}
              >
                Change Email
              </button>
            </div>
          </motion.div>
        )}

        {view === "reset-password" && (
          <motion.div
            key="reset-password-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <h2
              className={forgotPasswordClasses.title}
              style={forgotPasswordStyles.title}
            >
              Create New Password
            </h2>
            <p
              className={forgotPasswordClasses.subtitle}
              style={forgotPasswordStyles.subtitle}
            >
              Your new password must be different from previously used
              passwords.
            </p>

            <div
              className={forgotPasswordClasses.passwordForm}
              style={forgotPasswordStyles.passwordForm}
            >
              <Input
                type="password"
                label="New Password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className={loginClasses.input}
              />
              <Input
                type="password"
                label="Confirm Password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={loginClasses.input}
              />
            </div>

            <Button
              type="button"
              variant="primary"
              size="lg"
              isLoading={isUpdatingPassword}
              className={forgotPasswordClasses.submitButton}
              onClick={handlePasswordReset}
            >
              Update Password
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ForgotPassword;
