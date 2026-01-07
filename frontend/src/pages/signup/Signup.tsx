import React from "react";
import { motion } from "framer-motion";
import { IMAGES } from "../../constants/images";
import { getErrorMessage, Input } from "../../components/ui";
import { signupStyles, signupClasses, signupMediaQuery } from "./signupStyle";
import { useSignup } from "./hooks/useSignup";

const Signup: React.FC = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    error,
    handleSubmit,
  } = useSignup();

  return (
    <>
      <style>{signupMediaQuery}</style>
      <motion.div
        className={signupClasses.pageWrapper}
        style={signupStyles.pageContainer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className={signupClasses.logoWrapper}
          style={signupStyles.logoContainer}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[100px] bg-white/80 blur-[45px] rounded-full dark:block hidden pointer-events-none" />
          <img
            src={IMAGES.logo}
            alt="Defcon Logo"
            style={signupStyles.logoImage}
          />
        </motion.div>

        <motion.div
          className={signupClasses.mainContainer}
          style={signupStyles.loginContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div
            className={signupClasses.leftPanel}
            style={signupStyles.leftPanel}
          >
            <div>
              <div
                className={signupClasses.badgeWrapper}
                style={signupStyles.badgeWrapperStyle}
              >
                <span
                  className={signupClasses.badge}
                  style={signupStyles.newBadge}
                >
                  <svg
                    style={signupStyles.badgeIcon}
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
                  className={signupClasses.featureTitle}
                  style={signupStyles.featureTitle}
                >
                  Reporting Dashboard
                </span>
              </div>

              <p
                className={signupClasses.featureDescription}
                style={signupStyles.featureDescription}
              >
                Our all-new Reporting Dashboard lets you build custom reports
                and visualize project data with charts, KPIs, and real-time
                filters — giving you clearer insights to make smarter decisions.{" "}
                <a
                  href="#"
                  className={`font-semibold hover:underline ${signupClasses.learnMoreLink}`}
                >
                  Learn more
                </a>
              </p>
            </div>

            <div style={signupStyles.bottomBoxContainer}>
              <div
                className={signupClasses.bottomBoxOuter}
                style={signupStyles.bottomBoxOuter}
              >
                <div
                  className={signupClasses.bottomBoxInner}
                  style={signupStyles.bottomBoxInner}
                ></div>
              </div>
            </div>
          </div>

          <div
            className={signupClasses.rightPanel}
            style={signupStyles.rightPanel}
          >
            <div
              className={signupClasses.formWrapper}
              style={signupStyles.formWrapper}
            >
              <h2
                className={signupClasses.formTitle}
                style={signupStyles.formTitle}
              >
                Create an account
              </h2>

              <form className={signupClasses.form} onSubmit={handleSubmit}>
                <Input
                  type="email"
                  label="Email Address"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={signupClasses.input}
                />

                <Input
                  type="password"
                  label="Password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={signupClasses.input}
                />

                {error && (
                  <div className={signupClasses.error}>
                    {getErrorMessage(error)}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className={signupClasses.submitButton}
                >
                  {isLoading ? "Creating Account..." : "Sign Up"}
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default Signup;
