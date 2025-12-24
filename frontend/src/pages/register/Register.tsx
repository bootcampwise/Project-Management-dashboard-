import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthButton from "../../components/ui/AuthButton";
import { useDispatch } from "react-redux";
import { signInWithGoogle, signInWithGithub } from "../../store/slices/authSlice";
import type { AppDispatch } from "../../store";
import { registerStyles, registerClasses } from "./registerStyle";

const Register: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");

  const handleGoogleSignIn = () => {
    dispatch(signInWithGoogle());
  };

  const handleGithubSignIn = () => {
    dispatch(signInWithGithub());
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
          <AuthButton icon="/google.png" text="Continue with Google" onClick={handleGoogleSignIn} />
          <AuthButton icon="/github.png" text="Continue with Github" onClick={handleGithubSignIn} />
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
        <div
          className={registerClasses.emailSection}
          style={registerStyles.emailSection}
        >
          <label
            className={registerClasses.label}
            style={registerStyles.label}
          >
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email address..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={registerClasses.input}
            style={registerStyles.input}
          />

          <p style={registerStyles.helperText}>
            Use an organization email to easily collaborate with teammates.
          </p>
        </div>

        {/* CONTINUE BUTTON */}
        <button
          className={registerClasses.continueButton}
          style={registerStyles.continueButton}
        >
          Continue
        </button>

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
