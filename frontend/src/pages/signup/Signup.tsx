import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { showToast, getErrorMessage, Input } from '../../components/ui';
import { useRegisterMutation } from '../../store/api/authApiSlice';
import { signupStyles, signupClasses, signupMediaQuery } from './signupStyle';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [register, { isLoading, error }] = useRegisterMutation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ email, password }).unwrap();
      showToast.success("Your account has been created successfully");
      navigate('/login');
    } catch (error) {
      showToast.error(`Failed to create account. ${getErrorMessage(error)}`);
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
                <span className={signupClasses.featureTitle} style={signupStyles.featureTitle}>
                  Reporting Dashboard
                </span>
              </div>

              {/* Description */}
              <p className={signupClasses.featureDescription} style={signupStyles.featureDescription}>
                Our all-new Reporting Dashboard lets you build custom
                reports and visualize project data with charts, KPIs,
                and real-time filters — giving you clearer insights to
                make smarter decisions.{' '}
                <a
                  href="#"
                  className={`font-semibold hover:underline ${signupClasses.learnMoreLink}`}
                >
                  Learn more
                </a>
              </p>
            </div>

            {/* Bottom Area - Middle Container with White Box */}
            <div style={signupStyles.bottomBoxContainer}>
              <div className={signupClasses.bottomBoxOuter} style={signupStyles.bottomBoxOuter}>
                <div className={signupClasses.bottomBoxInner} style={signupStyles.bottomBoxInner}></div>
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
                  className={signupClasses.submitButton}
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
