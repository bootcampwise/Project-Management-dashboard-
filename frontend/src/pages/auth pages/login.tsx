import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { signInWithGoogle, signInWithEmail } from '../../store/slices/authSlice';
import type { AppDispatch, RootState } from '../../store';

const LoginPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { isLoading, error } = useSelector((state: RootState) => state.auth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isHovered, setIsHovered] = useState(false);

    const handleGoogleSignIn = () => {
        dispatch(signInWithGoogle());
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(signInWithEmail({ email, password })).unwrap();
            toast.success('Login successfully');
            navigate('/dashboard');
        } catch (err) {
            console.error('Login failed:', err);
            toast.error('Login failed');
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
                style={{
                    width: '100%',
                    minWidth: '320px',
                    minHeight: '100vh',
                    fontFamily: 'Inter, sans-serif',
                    position: 'relative',
                    padding: '20px',
                }}
            >
                {/* Logo above container */}
                <div
                    className="absolute hidden md:block"
                    style={{
                        top: '98px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '173px',
                        height: '42px',
                    }}
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
                    style={{
                        width: '100%',
                        maxWidth: '952px',
                        height: 'auto',
                        minHeight: '593px',
                        marginTop: '20px',
                        borderRadius: '8px',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: 'var(--color-gray-border)',
                    }}
                >
                    {/* LEFT PANEL */}
                    <div
                        className="hidden md:flex flex-col md:w-1/2"
                        style={{
                            backgroundColor: 'var(--color-bg-off-white)',
                            padding: '48px 36px 36px 36px',
                            position: 'relative'
                        }}
                    >
                        {/* Top Content Area */}
                        <div>
                            {/* Badge and Title */}
                            <div className="flex items-center gap-2" style={{ marginBottom: '16px' }}>
                                <span
                                    className="inline-flex items-center gap-1 rounded-full text-xs font-bold text-white"
                                    style={{
                                        backgroundColor: 'var(--color-brand-orange)',
                                        padding: '4px 10px',
                                        fontSize: '11px',
                                        fontWeight: 700
                                    }}
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
                                    style={{
                                        fontFamily: 'Inter, sans-serif',
                                        fontSize: '18px',
                                        fontWeight: 700,
                                        color: 'var(--color-gray-900)',
                                        letterSpacing: '-0.01em'
                                    }}
                                >
                                    Reporting Dashboard
                                </span>
                            </div>

                            {/* Description */}
                            <p
                                style={{
                                    fontFamily: 'Inter, sans-serif',
                                    fontWeight: 400,
                                    fontSize: '14.9px',
                                    lineHeight: '21px',
                                    letterSpacing: '0%',
                                    color: 'var(--color-gray-900)',
                                    marginBottom: '0',
                                    maxWidth: '380px'
                                }}
                            >
                                Our all-new Reporting Dashboard lets you build custom
                                reports and visualize project data with charts, KPIs,
                                and real-time filters — giving you clearer insights to
                                make smarter decisions.{' '}
                                <a
                                    href="#"
                                    className="font-semibold hover:underline"
                                    style={{
                                        color: 'var(--color-brand-orange)',
                                        textDecoration: 'none',
                                        fontWeight: 600
                                    }}
                                >
                                    Learn more
                                </a>
                            </p>
                        </div>

                        {/* Bottom Area - Middle Container with White Box - positioned at bottom */}
                        <div
                            style={{
                                width: '100%',
                                maxWidth: '340px',
                                position: 'absolute',
                                top: '220px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}
                        >
                            {/* Middle container - same color as outer */}
                            <div
                                style={{
                                    width: '100%',
                                    height: '180px',
                                    borderRadius: '8px',
                                    backgroundColor: 'var(--color-bg-off-white)',
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    justifyContent: 'center',
                                    paddingBottom: '0',
                                    boxShadow: `0 2px 8px var(--shadow-light), 0 1px 3px var(--shadow-dark)`
                                }}
                            >
                                {/* White box at bottom of middle container with soft glow */}
                                <div
                                    style={{
                                        width: '180px',
                                        height: '36px',
                                        backgroundColor: 'var(--color-bg-white-glow)',
                                        borderRadius: '2px',
                                        boxShadow: '0 10px 40px 20px rgba(241, 241, 241, 1), 0 6px 25px 12px rgba(209, 213, 219, 0.5), 0 2px 10px 5px rgba(0, 0, 0, 0.05)',
                                        position: 'absolute',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        zIndex: 1,
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL */}
                    <div
                        className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-start mt-0"
                    >
                        <h2
                            className="text-3xl font-semibold text-gray-900 mb-4 text-center"
                            style={{ fontSize: '24px', lineHeight: '35px' }}
                        >
                            Log in to your account
                        </h2>

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {/* Email */}
                            <div>
                                <label
                                    className="block mb-2"
                                    style={{
                                        fontFamily: 'Inter, sans-serif',
                                        fontWeight: 500,
                                        fontSize: '13.2px',
                                        lineHeight: '22.5px',
                                        letterSpacing: '0%',
                                        color: 'var(--color-gray-900)'
                                    }}
                                >
                                    Email Address <span className="text-black">*</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="name@company.com"
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
                                        style={{
                                            fontFamily: 'Inter, sans-serif',
                                            fontWeight: 500,
                                            fontSize: '13.2px',
                                            lineHeight: '22.5px',
                                            letterSpacing: '0%',
                                            color: '#000000'
                                        }}
                                    >
                                        Password <span className="text-black">*</span>
                                    </label>
                                    <a
                                        href="#"
                                        className="text-sm text-blue-500 hover:text-blue-600 font-medium"
                                    >
                                        Forgot password?
                                    </a>
                                </div>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none text-gray-700 placeholder-gray-400"
                                />
                            </div>

                            {/* Login Button */}
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
                                style={{ backgroundColor: isHovered ? 'var(--color-blue-700)' : 'var(--color-brand-blue-light)' }}
                            >
                                {isLoading ? 'Logging in...' : 'Log in'}
                            </button>

                            {/* Social Login */}
                            <div className="flex items-center justify-center gap-8 py-2">
                                <button
                                    type="button"
                                    onClick={handleGoogleSignIn}
                                    className="flex items-center gap-2 hover:text-gray-900 text-sm font-medium"
                                    style={{ color: 'var(--color-brand-orange)' }}
                                >
                                    <img src="/google.png" alt="Google" className="w-5 h-5" />
                                    Google
                                </button>
                                <div className="h-5 w-px bg-gray-300"></div>
                                <button
                                    className="flex items-center gap-2 hover:text-gray-900 text-sm font-medium"
                                    style={{ color: 'var(--color-brand-orange)' }}
                                >
                                    <img src="/microsoft.png" alt="Microsoft" className="w-5 h-5" />
                                    Microsoft
                                </button>
                            </div>

                            {/* SSO Button */}
                            <button
                                type="button"
                                className="w-full py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                style={{
                                    fontFamily: 'Inter, sans-serif',
                                    fontWeight: 500,
                                    fontSize: '14px',
                                    lineHeight: '100%',
                                    letterSpacing: '0%',
                                    textAlign: 'center',
                                    color: 'var(--color-gray-900)'
                                }}
                            >
                                Sign in with your identity provider (SSO/SAML)
                            </button>

                            {/* Divider */}
                            <div className="relative flex py-2 items-center">
                                <div className="flex-grow border-t border-gray-200"></div>
                                <span
                                    className="flex-shrink-0 mx-4 uppercase"
                                    style={{
                                        fontFamily: 'Inter, sans-serif',
                                        fontWeight: 600,
                                        fontSize: '11px',
                                        lineHeight: '16.5px',
                                        letterSpacing: '0%',
                                        textAlign: 'center',
                                        color: 'var(--color-gray-900)'
                                    }}
                                >
                                    OR
                                </span>
                                <div className="flex-grow border-t border-gray-200"></div>
                            </div>

                            {/* Sign Up */}
                            <div className="text-center space-y-2">
                                <p
                                    style={{
                                        fontFamily: 'Inter, sans-serif',
                                        fontWeight: 400,
                                        fontSize: '15px',
                                        lineHeight: '22.5px',
                                        letterSpacing: '0%',
                                        textAlign: 'center',
                                        color: 'var(--color-gray-900)'
                                    }}
                                >
                                    Don't have an account?
                                </p>
                                <button
                                    type="button"
                                    onClick={() => navigate('/signup')}
                                    className="w-auto px-8 py-3 border-2 rounded-md font-bold text-sm transition-colors"
                                    style={{ borderColor: 'var(--color-gray-border-light)', color: 'var(--color-brand-orange)' }}
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
