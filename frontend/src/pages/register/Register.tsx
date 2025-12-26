import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Button, AuthButton, Input } from "../../components/ui";
import {
  useLoginWithGoogleMutation,
  useLoginWithGithubMutation,
} from "../../store/api/authApiSlice";
import { registerStyles, registerClasses } from "./registerStyle";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");

  // OAuth mutations from RTK Query
  const [loginWithGoogle, { isLoading: isGoogleLoading }] =
    useLoginWithGoogleMutation();
  const [loginWithGithub, { isLoading: isGithubLoading }] =
    useLoginWithGithubMutation();

  const handleGoogleSignIn = () => {
    loginWithGoogle();
  };

  const handleGithubSignIn = () => {
    loginWithGithub();
  };

  return (
    <div
      className={registerClasses.pageContainer}
      style={registerStyles.pageContainer}
    >
      <div
        className={registerClasses.contentWrapper}
        style={registerStyles.contentWrapper}
      >
        {/* LOGO */}
        <div
          className={registerClasses.logoWrapper}
          style={registerStyles.logoWrapper}
        >
          <img
            src="/logo.png"
            alt="DEFCON Logo"
            className={registerClasses.logoImage}
            style={registerStyles.logoImage}
          />
        </div>

        {/* SIGN IN HEADER */}
        <h1
          className={registerClasses.header}
          style={registerStyles.header}
        >
          Sign in
        </h1>

        {/* SOCIAL AUTH BUTTONS */}
        <div
          className={registerClasses.socialButtonsWrapper}
          style={registerStyles.socialButtonsWrapper}
        >
          <AuthButton
            icon="/google.png"
            text={isGoogleLoading ? "Loading..." : "Continue with Google"}
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isGithubLoading}
          />
          <AuthButton
            icon="/github.png"
            text={isGithubLoading ? "Loading..." : "Continue with Github"}
            onClick={handleGithubSignIn}
            disabled={isGoogleLoading || isGithubLoading}
          />
          <AuthButton icon="/figma.png" text="Continue with Figma" />
        </div>

        {/* DIVIDER */}
        <div
          className={registerClasses.dividerWrapper}
          style={registerStyles.dividerWrapper}
        >
          <div className={registerClasses.dividerLine} style={registerStyles.dividerLine}></div>
        </div>

        {/* EMAIL INPUT */}
        <Input
          type="email"
          label="Email"
          placeholder="Enter your email address..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          helperText="Use an organization email to easily collaborate with teammates."
          className={registerClasses.input}
        />

        {/* CONTINUE BUTTON */}
        <Button
          variant="primary"
          size="lg"
          className={`${registerClasses.continueButton} bg-brand-blue text-white hover:bg-blue-600`}
          style={registerStyles.continueButton}
        >
          Continue
        </Button>

        <div className={registerClasses.loginLinkWrapper}>
          Already have account?
          <Link to="/login" className={registerClasses.loginLink}>
            Login
          </Link>
        </div>

      </div>


      {/* FOOTER */}
      <footer
        className={registerClasses.footer}
        style={registerStyles.footer}
      >
        <span className={registerClasses.footerItem}>© Defcon systems</span>
        <a href="#" className={registerClasses.footerItem}>Privacy</a>
        <a href="#" className={registerClasses.footerItem}>Support</a>
        <a href="#" className={registerClasses.footerItem}>Pricing</a>
        <a href="#" className={registerClasses.footerItem}>Log out</a>
      </footer>
    </div>
  );
};

export default Register;
