import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthButton from "../../components/AuthButton";
import { useDispatch } from "react-redux";
import { signInWithGoogle, signInWithGithub } from "../../store/slices/authSlice";
import type { AppDispatch } from "../../store";

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
            className="bg-white flex flex-col items-center justify-start overflow-x-hidden"
            style={{
                fontFamily: "Inter, sans-serif",
                width: "100%",
                maxWidth: "100%",
                minHeight: "100vh",
                padding: "32px 16px",
                margin: "0",
                boxSizing: "border-box",
            }}
        >
            <div
                className="flex flex-col items-center"
                style={{
                    width: "100%",
                    maxWidth: "400px",
                    minHeight: "836px",
                    boxSizing: "border-box",
                }}
            >
                {/* LOGO */}
                <div
                    className="flex items-center justify-center"
                    style={{ marginTop: "46px", marginBottom: "162px" }}
                >
                    <img
                        src="/logo.png"
                        alt="DEFCON Logo"
                        className="object-contain"
                        style={{ width: "173px", height: "42px" }}
                    />
                </div>

                {/* SIGN IN HEADER */}
                <h1
                    className="text-center text-gray-900"
                    style={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 500,
                        fontSize: "30px",
                        lineHeight: "38px",
                        marginBottom: "16px",
                        color: 'var(--color-gray-900)'
                    }}
                >
                    Sign in
                </h1>

                {/* SOCIAL AUTH BUTTONS */}
                <div
                    className="flex flex-col items-center w-full"
                    style={{ gap: "16px", marginBottom: "16px" }}
                >
                    <AuthButton icon="/google.png" text="Continue with Google" onClick={handleGoogleSignIn} />
                    <AuthButton icon="/github.png" text="Continue with Github" onClick={handleGithubSignIn} />
                    <AuthButton icon="/figma.png" text="Continue with Figma" />
                </div>

                {/* DIVIDER */}
                <div
                    className="flex items-center justify-center w-full"
                    style={{
                        maxWidth: "400px",
                        height: "8px",
                        marginBottom: "16px",
                        marginTop: "16px",
                    }}
                >
                    <div className="w-full" style={{ borderTop: `1px solid var(--color-gray-divider)` }}></div>
                </div>

                {/* EMAIL INPUT */}
                <div
                    className="flex flex-col w-full"
                    style={{ gap: "4px", marginBottom: "16px" }}
                >
                    <label
                        className="text-gray-500"
                        style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "14px",
                            fontWeight: 500,
                        }}
                    >
                        Email
                    </label>

                    <input
                        type="email"
                        placeholder="Enter your email address..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{
                            width: "100%",
                            maxWidth: "400px",
                            height: "36px",
                            padding: "7px 16px",
                            border: `1px solid var(--color-gray-border-input)`,
                            borderRadius: "4px",
                            fontFamily: "Inter, sans-serif",
                            fontSize: "14px",
                            boxSizing: "border-box",
                        }}
                    />

                    <p
                        style={{
                            width: "100%",
                            maxWidth: "400px",
                            height: "18px",
                            fontFamily: "Inter, sans-serif",
                            fontWeight: 400,
                            fontSize: "12px",
                            lineHeight: "18px",
                            color: 'var(--color-gray-text)',
                            opacity: 1,
                        }}
                    >
                        Use an organization email to easily collaborate with teammates.
                    </p>
                </div>

                {/* CONTINUE BUTTON */}
                <button
                    className="flex items-center justify-center w-full"
                    style={{
                        maxWidth: "400px",
                        height: "36px",
                        backgroundColor: 'var(--color-brand-blue)',
                        borderRadius: "4px",
                        padding: "7px 16px",
                        color: 'white', // Reverting to plain white or defining a white variable if strictly needed
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontWeight: 500,
                        lineHeight: "22px",
                        marginBottom: "16px",
                    }}
                >
                    Continue
                </button>

                <div className="flex gap-2 text-md text-gray-400 font-medium font-inter mb-[128px]">
                    Already have account?
                    <Link to="/login" className="text-blue-500 hover:text-blue-600">
                        Login
                    </Link>
                </div>

            </div>


            {/* FOOTER */}
            <footer
                className="flex justify-center gap-8 w-full"
                style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    color: 'var(--color-gray-text)',
                    marginTop: "32px",
                    paddingBottom: "32px"
                }}
            >
                <span className="whitespace-nowrap">© Defcon systems</span>
                <a href="#" className="whitespace-nowrap">Privacy</a>
                <a href="#" className="whitespace-nowrap">Support</a>
                <a href="#" className="whitespace-nowrap">Pricing</a>
                <a href="#" className="whitespace-nowrap">Log out</a>
            </footer>
        </div>
    );
};

export default Register;
