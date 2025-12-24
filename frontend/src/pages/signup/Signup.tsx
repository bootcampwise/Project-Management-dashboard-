import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { showToast, Badge, Input } from '../../components/ui';
import { useRegisterMutation } from '../../store/api/authApiSlice';
import { signupStyles, signupClasses, signupMediaQuery } from './signupStyle';

// Helper function to get error message from API errors
// Makes error handling simple and readable
const getErrorMessage = (error: unknown): string => {
  // Check if error has a data property (API error)
  if (error && typeof error === 'object' && 'data' in error) {
    const apiError = error as { data?: unknown };
    if (typeof apiError.data === 'string') {
      return apiError.data;
    }
    if (apiError.data && typeof apiError.data === 'object' && 'message' in apiError.data) {
      return String((apiError.data as { message: unknown }).message);
    }
  }
  // Default error message
  return 'Registration failed. Please try again.';
};

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [register, { isLoading, error }] = useRegisterMutation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ email, password }).unwrap();
      showToast.success("Your account has been created successfully");
      navigate('/login');
    } catch (err) {
      console.error('Signup failed:', err);
      showToast.error("Signup failed. Please try again.");
    }
  };

  return (
    <>
      <style>{signupMediaQuery}</style>
      <div
        className={signupClasses.pageWrapper}
        style={signupStyles.pageContainer}
      >
        {/* Logo above container */}
        <div
          className={signupClasses.logoWrapper}
          style={signupStyles.logoContainer}
        >
          <img
            src="/logo.png"
            alt="Defcon Logo"
            style={signupStyles.logoImage}
          />
        </div>

        {/* Main Container */}
        <div
          className={signupClasses.mainContainer}
          style={signupStyles.loginContainer}
        >
          {/* LEFT PANEL */}
          <div
            className={signupClasses.leftPanel}
            style={signupStyles.leftPanel}
          >
            {/* Top Content Area */}
            <div>
              {/* Badge and Title */}
              <div className={signupClasses.badgeWrapper} style={{ marginBottom: '16px' }}>
                <Badge
                  className="bg-[var(--color-brand-orange)] text-white border-none gap-1 font-bold"
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
                </Badge>
                <span style={signupStyles.featureTitle}>
                  Reporting Dashboard
                </span>
              </div>

              {/* Description */}
              <p style={signupStyles.featureDescription}>
                Our all-new Reporting Dashboard lets you build custom
                reports and visualize project data with charts, KPIs,
                and real-time filters — giving you clearer insights to
                make smarter decisions.{' '}
                <a
                  href="#"
                  className="font-semibold hover:underline"
                  style={signupStyles.learnMoreLink}
                >
                  Learn more
                </a>
              </p>
            </div>

            {/* Bottom Area - Middle Container with White Box */}
            <div style={signupStyles.bottomBoxContainer}>
              <div style={signupStyles.bottomBoxOuter}>
                <div style={signupStyles.bottomBoxInner}></div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div
            className={signupClasses.rightPanel}
            style={signupStyles.rightPanel}
          >
            <div className={signupClasses.formWrapper} style={signupStyles.formWrapper}>
              <h2
                className={signupClasses.formTitle}
                style={signupStyles.formTitle}
              >
                Create an account
              </h2>

              <form className={signupClasses.form} onSubmit={handleSubmit}>
                {/* Email */}
                <Input
                  type="email"
                  label="Email Address"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={signupClasses.input}
                />

                {/* Password */}
                <Input
                  type="password"
                  label="Password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={signupClasses.input}
                />

                {/* Error Message */}
                {error && (
                  <div className={signupClasses.error}>
                    {getErrorMessage(error)}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className={signupClasses.submitButton}
                  style={signupStyles.submitButton(isHovered)}
                >
                  {isLoading ? 'Creating Account...' : 'Sign Up'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
