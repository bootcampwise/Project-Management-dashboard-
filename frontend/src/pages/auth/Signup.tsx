import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { signUpWithEmail } from '../../store/slices/authSlice';
import type { AppDispatch, RootState } from '../../store';

const styles = {
  pageContainer: {
    width: '100%',
    minWidth: '320px',
    minHeight: '100vh',
    fontFamily: 'Inter, sans-serif',
    position: 'relative' as const,
    padding: '20px',
  },
  logoContainer: {
    top: '98px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '173px',
    height: '42px',
  },
  loginContainer: {
    width: '100%',
    maxWidth: '952px',
    height: 'auto',
    minHeight: '593px',
    marginTop: '20px',
    borderRadius: '8px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'var(--color-gray-border)',
  },
  leftPanel: {
    backgroundColor: 'var(--color-bg-off-white)',
    padding: '48px 36px 36px 36px',
    position: 'relative' as const,
  },
  newBadge: {
    backgroundColor: 'var(--color-brand-orange)',
    padding: '4px 10px',
    fontSize: '11px',
    fontWeight: 700
  },
  featureTitle: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--color-gray-900)',
    letterSpacing: '-0.01em'
  },
  featureDescription: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 400,
    fontSize: '14.9px',
    lineHeight: '21px',
    letterSpacing: '0%',
    color: 'var(--color-gray-900)',
    marginBottom: '0',
    maxWidth: '380px'
  },
  learnMoreLink: {
    color: 'var(--color-brand-orange)',
    textDecoration: 'none',
    fontWeight: 600
  },
  bottomBoxContainer: {
    width: '100%',
    maxWidth: '340px',
    position: 'absolute' as const,
    top: '220px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center'
  },
  bottomBoxOuter: {
    width: '100%',
    height: '180px',
    borderRadius: '8px',
    backgroundColor: 'var(--color-bg-off-white)',
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingBottom: '0',
    boxShadow: `0 2px 8px var(--shadow-light), 0 1px 3px var(--shadow-dark)`
  },
  bottomBoxInner: {
    width: '180px',
    height: '36px',
    backgroundColor: 'var(--color-bg-white-glow)',
    borderRadius: '2px',
    boxShadow: '0 10px 40px 20px rgba(241, 241, 241, 1), 0 6px 25px 12px rgba(209, 213, 219, 0.5), 0 2px 10px 5px rgba(0, 0, 0, 0.05)',
    position: 'absolute' as const,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1,
  },
  rightPanel: {
    minHeight: '593px'
  },
  formTitle: { fontSize: '24px', lineHeight: '35px' },
  inputLabel: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 500,
    fontSize: '13.2px',
    lineHeight: '22.5px',
    letterSpacing: '0%',
    color: 'var(--color-gray-900)'
  },
  passwordLabel: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 500,
    fontSize: '13.2px',
    lineHeight: '22.5px',
    letterSpacing: '0%',
    color: '#000000'
  }
};

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
      <style>{`
                @media (min-width: 768px) {
                    .login-container {
                        margin-top: 209px !important;
                    }
                }
            `}</style>
      <div
        className="bg-gray-50 flex justify-center items-start overflow-x-hidden"
        style={styles.pageContainer}
      >
        {/* Logo above container */}
        <div
          className="absolute hidden md:block"
          style={styles.logoContainer}
        >
          <img
            src="/logo.png"
            alt="Defcon Logo"
            style={{ width: '173px', height: '42px' }}
          />
        </div>

        {/* Main Container */}
        <div
          className="bg-white flex flex-col md:flex-row rounded-lg shadow-md overflow-hidden login-container"
          style={styles.loginContainer}
        >
          {/* LEFT PANEL */}
          <div
            className="hidden md:flex flex-col md:w-1/2"
            style={styles.leftPanel}
          >
            {/* Top Content Area */}
            <div>
              {/* Badge and Title */}
              <div className="flex items-center gap-2" style={{ marginBottom: '16px' }}>
                <span
                  className="inline-flex items-center gap-1 rounded-full text-xs font-bold text-white"
                  style={styles.newBadge}
                >
                  <svg
                    style={{ width: '10px', height: '10px' }}
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
                  style={styles.featureTitle}
                >
                  Reporting Dashboard
                </span>
              </div>

              {/* Description */}
              <p
                style={styles.featureDescription}
              >
                Our all-new Reporting Dashboard lets you build custom
                reports and visualize project data with charts, KPIs,
                and real-time filters — giving you clearer insights to
                make smarter decisions.{' '}
                <a
                  href="#"
                  className="font-semibold hover:underline"
                  style={styles.learnMoreLink}
                >
                  Learn more
                </a>
              </p>
            </div>

            {/* Bottom Area - Middle Container with White Box - positioned at bottom */}
            <div
              style={styles.bottomBoxContainer}
            >
              {/* Middle container - same color as outer */}
              <div
                style={styles.bottomBoxOuter}
              >
                {/* White box at bottom of middle container with soft glow */}
                <div
                  style={styles.bottomBoxInner}
                ></div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div
            className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center items-center"
            style={styles.rightPanel}
          >
            <div className="w-full" style={{ maxWidth: '400px' }}>
              <h2
                className="text-3xl font-semibold text-gray-900 mb-12 text-center"
                style={styles.formTitle}
              >
                Create an account
              </h2>

              <form className="space-y-12" onSubmit={handleSubmit}>
                {/* Email */}
                <div>
                  <label
                    className="block mb-2"
                    style={styles.inputLabel}
                  >
                    Email Address <span className="text-black">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none text-gray-700 placeholder-gray-400"
                  />
                </div>

                {/* Password */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label
                      className="block"
                      style={styles.passwordLabel}
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none text-gray-700 placeholder-gray-400"
                  />
                </div>

                {/* Signup Button */}
                {error && (
                  <div className="text-red-600 text-sm text-center">
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isLoading}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="w-full py-3 rounded-md text-white font-bold text-sm shadow-sm transition-colors disabled:opacity-50"
                  style={{
                    backgroundColor: isHovered
                      ? 'var(--color-blue-700)'
                      : 'var(--color-brand-blue-light)'
                  }}
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
