import React from 'react';
import { useLogin } from './hooks/useLogin';
import { loginStyles, loginClasses, loginMediaQuery } from './loginStyle';

const LoginPage: React.FC = () => {
  const {
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
    navigate
  } = useLogin();

  return (
    <>
      <style>{loginMediaQuery}</style>
      <div
        className={loginClasses.pageWrapper}
        style={loginStyles.pageContainer}
      >
        {/* Logo above container */}
        <div
          className={loginClasses.logoWrapper}
          style={loginStyles.logoContainer}
        >
          <img
            src="/logo.png"
            alt="Defcon Logo"
            style={loginStyles.logoImage}
          />
        </div>

        {/* Main Container */}
        <div
          className={loginClasses.mainContainer}
          style={loginStyles.loginContainer}
        >
          {/* LEFT PANEL */}
          <div
            className={loginClasses.leftPanel}
            style={loginStyles.leftPanel}
          >
            {/* Top Content Area */}
            <div>
              {/* Badge and Title */}
              <div className={loginClasses.badgeWrapper} style={{ marginBottom: '16px' }}>
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
                <span style={loginStyles.featureTitle}>
                  Reporting Dashboard
                </span>
              </div>

              {/* Description */}
              <p style={loginStyles.featureDescription}>
                Our all-new Reporting Dashboard lets you build custom
                reports and visualize project data with charts, KPIs,
                and real-time filters — giving you clearer insights to
                make smarter decisions.{' '}
                <a
                  href="#"
                  className="font-semibold hover:underline"
                  style={loginStyles.learnMoreLink}
                >
                  Learn more
                </a>
              </p>
            </div>

            {/* Bottom Area - Middle Container with White Box */}
            <div style={loginStyles.bottomBoxContainer}>
              <div style={loginStyles.bottomBoxOuter}>
                <div style={loginStyles.bottomBoxInner}></div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className={loginClasses.rightPanel}>
            <h2
              className={loginClasses.formTitle}
              style={loginStyles.formTitle}
            >
              Log in to your account
            </h2>

            <form className={loginClasses.form} onSubmit={handleSubmit}>
              {/* Email */}
              <div>
                <label
                  className={loginClasses.labelWrapper}
                  style={loginStyles.inputLabel}
                >
                  Email Address <span className="text-black">*</span>
                </label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={loginClasses.input}
                />
              </div>

              {/* Password */}
              <div>
                <div className={loginClasses.passwordHeader}>
                  <label
                    className="block"
                    style={loginStyles.passwordLabel}
                  >
                    Password <span className="text-black">*</span>
                  </label>
                  <a href="#" className={loginClasses.forgotPassword}>
                    Forgot password?
                  </a>
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={loginClasses.input}
                />
              </div>

              {/* Login Button */}
              {error && (
                <div className={loginClasses.error}>{error}</div>
              )}
              <button
                type="submit"
                disabled={isLoading}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={loginClasses.submitButton}
                style={loginStyles.loginButton(isHovered)}
              >
                {isLoading ? 'Logging in...' : 'Log in'}
              </button>

              {/* Social Login */}
              <div className={loginClasses.socialWrapper}>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className={loginClasses.socialButton}
                  style={loginStyles.socialButton}
                >
                  <img src="/google.png" alt="Google" className="w-5 h-5" />
                  Google
                </button>
                <div className={loginClasses.socialDivider}></div>
                <button
                  className={loginClasses.socialButton}
                  style={loginStyles.socialButton}
                >
                  <img src="/microsoft.png" alt="Microsoft" className="w-5 h-5" />
                  Microsoft
                </button>
              </div>

              {/* SSO Button */}
              <button
                type="button"
                className={loginClasses.ssoButton}
                style={loginStyles.ssoButton}
              >
                Sign in with your identity provider (SSO/SAML)
              </button>

              {/* Divider */}
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

              {/* Sign Up */}
              <div className={loginClasses.signUpWrapper}>
                <p style={loginStyles.signUpText}>
                  Don't have an account?
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className={loginClasses.signUpButton}
                  style={loginStyles.signUpButton}
                >
                  Sign up for free
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
