import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { signUpWithEmail } from '../../store/slices/authSlice';
import type { AppDispatch, RootState } from '../../store';
import { signupStyles, signupClasses, signupMediaQuery } from './signupStyle';

const Signup: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(signUpWithEmail({ email, password })).unwrap();
      toast.success("Your account has been created successfully");
      navigate('/login');
    } catch (err) {
      console.error('Signup failed:', err);
      toast.error("Signup failed. Please try again.");
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
                <div>
                  <label
                    className={signupClasses.labelWrapper}
                    style={signupStyles.inputLabel}
                  >
                    Email Address <span className="text-black">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={signupClasses.input}
                  />
                </div>

                {/* Password */}
                <div>
                  <div className={signupClasses.passwordHeader}>
                    <label
                      className="block"
                      style={signupStyles.passwordLabel}
                    >
                      Password <span className="text-black">*</span>
                    </label>
                  </div>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={signupClasses.input}
                  />
                </div>

                {/* Signup Button */}
                {error && (
                  <div className={signupClasses.error}>{error}</div>
                )}
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
