import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IMAGES } from "../../constants/images";
import { Button, AuthButton, Input } from "../../components/ui";
import { registerStyles, registerClasses } from "./registerStyle";
import { useRegister } from "./hooks/useRegister";

const Register: React.FC = () => {
  const {
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
    isLoading,
    handleContinue,
    handleBack,
    handleCreateAccount,
    handleGoogleSignIn,
    handleGithubSignIn,
  } = useRegister();

  return (
    <motion.div
      className={registerClasses.pageContainer}
      style={registerStyles.pageContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className={registerClasses.contentWrapper}
        style={registerStyles.contentWrapper}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <motion.div
          className={registerClasses.logoWrapper}
          style={registerStyles.logoWrapper}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className={registerClasses.logoBacklight} />
          <img
            src={IMAGES.logo}
            alt="DEFCON Logo"
            className={registerClasses.logoImage}
            style={registerStyles.logoImage}
          />
        </motion.div>

        <h1 className={registerClasses.header} style={registerStyles.header}>
          {step === "email" ? "Sign in" : "Create your account"}
        </h1>

        <AnimatePresence mode="wait">
          {step === "email" ? (
            <motion.div
              key="email-step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className={registerClasses.stepWrapper}
            >
              <div
                className={registerClasses.socialButtonsWrapper}
                style={registerStyles.socialButtonsWrapper}
              >
                <AuthButton
                  icon={IMAGES.google}
                  text={isGoogleLoading ? "Loading..." : "Continue with Google"}
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                />
                <AuthButton
                  icon={IMAGES.github}
                  text={isGithubLoading ? "Loading..." : "Continue with Github"}
                  onClick={handleGithubSignIn}
                  disabled={isLoading}
                />
                <AuthButton
                  icon={IMAGES.figma}
                  text="Continue with Figma"
                  disabled
                />
              </div>

              <div
                className={registerClasses.dividerWrapper}
                style={registerStyles.dividerWrapper}
              >
                <div
                  className={registerClasses.dividerLine}
                  style={registerStyles.dividerLine}
                ></div>
              </div>

              <Input
                type="email"
                label="Email"
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError("");
                }}
                error={emailError}
                helperText={
                  !emailError
                    ? "Use an organization email to easily collaborate with teammates."
                    : undefined
                }
                className={registerClasses.input}
              />

              <Button
                variant="primary"
                size="lg"
                onClick={handleContinue}
                disabled={isLoading}
                className={registerClasses.continueButton}
                style={registerStyles.continueButton}
              >
                Continue
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="password-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className={registerClasses.stepWrapper}
            >
              <div className={registerClasses.emailDisplay}>
                <span className={registerClasses.emailDisplayText}>
                  {email}
                </span>
                <button
                  type="button"
                  onClick={handleBack}
                  className={registerClasses.changeButton}
                >
                  Change
                </button>
              </div>

              <Input
                type="password"
                label="Password"
                placeholder="Enter your password..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError("");
                }}
                error={passwordError}
                className={registerClasses.inputWithMargin}
              />

              <Input
                type="password"
                label="Confirm Password"
                placeholder="Confirm your password..."
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (confirmPasswordError) setConfirmPasswordError("");
                }}
                error={confirmPasswordError}
                className={registerClasses.input}
              />

              <Button
                variant="primary"
                size="lg"
                onClick={handleCreateAccount}
                isLoading={isRegisterLoading}
                disabled={isLoading}
                className={registerClasses.createAccountButton}
                style={registerStyles.continueButton}
              >
                Create Account
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={registerClasses.loginLinkWrapper}>
          Already have account?
          <Link to="/login" className={registerClasses.loginLink}>
            Login
          </Link>
        </div>
      </motion.div>

      <motion.footer
        className={registerClasses.footer}
        style={registerStyles.footer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        <span className={registerClasses.footerItem}>© Defcon systems</span>
        <a href="#" className={registerClasses.footerItem}>
          Privacy
        </a>
        <a href="#" className={registerClasses.footerItem}>
          Support
        </a>
        <a href="#" className={registerClasses.footerItem}>
          Pricing
        </a>
        <a href="#" className={registerClasses.footerItem}>
          Log out
        </a>
      </motion.footer>
    </motion.div>
  );
};

export default Register;
