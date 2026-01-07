import React from "react";
import { useLogin } from "./hooks/useLogin";
import { loginStyles, loginClasses, loginMediaQuery } from "./loginStyle";
import { IMAGES } from "../../constants/images";
import { Button, Input } from "../../components/ui";
import { AnimatePresence, motion } from "framer-motion";
import ForgotPassword from "../forgetPassword/ForgotPassword";

const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === "object" && "data" in error) {
    const apiError = error as { data?: unknown };
    if (typeof apiError.data === "string") {
      return apiError.data;
    }
    if (
      apiError.data &&
      typeof apiError.data === "object" &&
      "message" in apiError.data
    ) {
      return String((apiError.data as { message: unknown }).message);
    }
  }
  return "Login failed. Please try again.";
};

const LoginPage: React.FC = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    error,
    handleGoogleSignIn,
    handleSubmit,
    navigate,
    authView,
    handleForgotPassword,
    handleBackToLogin,
  } = useLogin();

  return (
    <>
      <style>{loginMediaQuery}</style>
      <div
        className={loginClasses.pageWrapper}
        style={loginStyles.pageContainer}
      >
        <div
          className={loginClasses.logoWrapper}
          style={loginStyles.logoContainer}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[100px] bg-white/80 blur-[45px] rounded-full dark:block hidden pointer-events-none" />
          <img
            src={IMAGES.logo}
            alt="Defcon Logo"
            style={loginStyles.logoImage}
          />
        </div>

        <div
          className={loginClasses.mainContainer}
          style={loginStyles.loginContainer}
        >
          <div className={loginClasses.leftPanel} style={loginStyles.leftPanel}>
            <div>
              <div
                className={loginClasses.badgeWrapper}
                style={loginStyles.badgeWrapperStyle}
              >
                <span
                  className={loginClasses.badge}
                  style={loginStyles.newBadge}
                >
                  <svg
                    style={loginStyles.badgeIcon}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  NEW
                </span>
                <span
                  className={loginClasses.featureTitle}
                  style={loginStyles.featureTitle}
                >
                  Reporting Dashboard
                </span>
              </div>

              <p
                className={loginClasses.featureDescription}
                style={loginStyles.featureDescription}
              >
                Our all-new Reporting Dashboard lets you build custom reports
                and visualize project data with charts, KPIs, and real-time
                filters — giving you clearer insights to make smarter decisions.{" "}
                <a
                  href="#"
                  className={`font-semibold hover:underline ${loginClasses.learnMoreLink}`}
                >
                  Learn more
                </a>
              </p>
            </div>

            <div style={loginStyles.bottomBoxContainer}>
              <div
                className={loginClasses.bottomBoxOuter}
                style={loginStyles.bottomBoxOuter}
              >
                <div
                  className={loginClasses.bottomBoxInner}
                  style={loginStyles.bottomBoxInner}
                ></div>
              </div>
            </div>
          </div>

          <div className={loginClasses.rightPanel}>
            <AnimatePresence mode="wait">
              {authView === "login" ? (
                <motion.div
                  key="login-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2
                    className={loginClasses.formTitle}
                    style={loginStyles.formTitle}
                  >
                    Log in to your account
                  </h2>

                  <form className={loginClasses.form} onSubmit={handleSubmit}>
                    <Input
                      type="email"
                      label="Email Address"
                      required
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={loginClasses.input}
                      data-cy="email-input"
                    />

                    <div>
                      <div className={loginClasses.passwordHeader}>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Password{" "}
                          <span className="text-black dark:text-white">*</span>
                        </span>
                        <button
                          type="button"
                          onClick={handleForgotPassword}
                          className={loginClasses.forgotPassword}
                        >
                          Forgot password?
                        </button>
                      </div>
                      <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={loginClasses.input}
                        data-cy="password-input"
                      />
                    </div>

                    {error && (
                      <div className={loginClasses.error}>
                        {getErrorMessage(error)}
                      </div>
                    )}
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      isLoading={isLoading}
                      className={loginClasses.submitButton}
                      data-cy="login-button"
                    >
                      Log in
                    </Button>

                    <div className={loginClasses.socialWrapper}>
                      <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        className={loginClasses.socialButton}
                      >
                        <img
                          src={IMAGES.google}
                          alt="Google"
                          className="w-5 h-5"
                        />
                        <span className="text-brand-orange">Google</span>
                      </button>
                      <div className={loginClasses.socialDivider}></div>
                      <button
                        className={`${loginClasses.socialButton} opacity-50 cursor-not-allowed`}
                        disabled
                      >
                        <img
                          src={IMAGES.microsoft}
                          alt="Microsoft"
                          className="w-5 h-5"
                        />
                        <span className="text-brand-orange">Microsoft</span>
                      </button>
                    </div>

                    <Button
                      type="button"
                      variant="secondary"
                      className={loginClasses.ssoButton}
                      style={loginStyles.ssoButton}
                    >
                      Sign in with your identity provider (SSO/SAML)
                    </Button>

                    <div className={loginClasses.dividerWrapper}>
                      <div className={loginClasses.dividerLine}></div>
                      <span
                        className={loginClasses.dividerText}
                        style={loginStyles.dividerText}
                      >
                        OR
                      </span>
                      <div className={loginClasses.dividerLine}></div>
                    </div>

                    <div className={loginClasses.signUpWrapper}>
                      <p style={loginStyles.signUpText}>
                        Don't have an account?
                      </p>
                      <button
                        type="button"
                        onClick={() => navigate("/signup")}
                        className={loginClasses.signUpButton}
                      >
                        Sign up for free
                      </button>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="forgot-password"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <ForgotPassword
                    initialEmail={email}
                    onBack={handleBackToLogin}
                    onSuccess={handleBackToLogin}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
