import React from 'react';
import { useLogin } from './hooks/useLogin';
import { loginStyles, loginClasses, loginMediaQuery } from './loginStyle';
import { IMAGES } from '../../constants/images';
import { Button, Input } from '../../components/ui';

// Helper function to get error message from API errors
const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'data' in error) {
    const apiError = error as { data?: unknown };
    if (typeof apiError.data === 'string') {
      return apiError.data;
    }
    if (apiError.data && typeof apiError.data === 'object' && 'message' in apiError.data) {
      return String((apiError.data as { message: unknown }).message);
    }
  }
  return 'Login failed. Please try again.';
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
            src={IMAGES.logo}
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
                <span className={loginClasses.featureTitle} style={loginStyles.featureTitle}>
                  Reporting Dashboard
                </span>
              </div>

              {/* Description */}
              <p className={loginClasses.featureDescription} style={loginStyles.featureDescription}>
                Our all-new Reporting Dashboard lets you build custom
                reports and visualize project data with charts, KPIs,
                and real-time filters — giving you clearer insights to
                make smarter decisions.{' '}
                <a
                  href="#"
                  className={`font-semibold hover:underline ${loginClasses.learnMoreLink}`}
                >
                  Learn more
                </a>
              </p>
            </div>

            {/* Bottom Area - Middle Container with White Box */}
            <div style={loginStyles.bottomBoxContainer}>
              <div className={loginClasses.bottomBoxOuter} style={loginStyles.bottomBoxOuter}>
                <div className={loginClasses.bottomBoxInner} style={loginStyles.bottomBoxInner}></div>
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
              <Input
                type="email"
                label="Email Address"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={loginClasses.input}
              />

              {/* Password */}
              <div>
                <div className={loginClasses.passwordHeader}>
                  <span className="text-sm font-medium text-gray-700">Password <span className="text-black">*</span></span>
                  <a href="#" className={loginClasses.forgotPassword}>
                    Forgot password?
                  </a>
                </div>
                <Input
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
                <div className={loginClasses.error}>{getErrorMessage(error)}</div>
              )}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className={loginClasses.submitButton}
              >
                Log in
              </Button>

              {/* Social Login */}
              <div className={loginClasses.socialWrapper}>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className={loginClasses.socialButton}
                >
                  <img src={IMAGES.google} alt="Google" className="w-5 h-5" />
                  <span className="text-brand-orange">Google</span>
                </button>
                <div className={loginClasses.socialDivider}></div>
                <button
                  className={loginClasses.socialButton}
                >
                  <img src={IMAGES.microsoft} alt="Microsoft" className="w-5 h-5" />
                  <span className="text-brand-orange">Microsoft</span>
                </button>
              </div>

              {/* SSO Button */}
              <Button
                type="button"
                variant="secondary"
                className={loginClasses.ssoButton}
                style={loginStyles.ssoButton}
              >
                Sign in with your identity provider (SSO/SAML)
              </Button>

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
