import React, { useState } from "react";
import AuthButton from "../../components/AuthButton";

const SignIn: React.FC = () => {
    const [email, setEmail] = useState("");

    return (
        <div
            className="bg-white flex justify-center items-start overflow-x-hidden"
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
                    }}
                >
                    Sign in
                </h1>

                {/* SOCIAL AUTH BUTTONS */}
                <div
                    className="flex flex-col items-center w-full"
                    style={{ gap: "16px", marginBottom: "16px" }}
                >
                    <AuthButton icon="/google.png" text="Continue with Google" />
                    <AuthButton icon="/github.png" text="Continue with Github" />
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
                    <div className="w-full" style={{ borderTop: "1px solid #ECEDF0" }}></div>
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
                            border: "1px solid #D1D5DB",
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
                            color: "#8F929C",
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
                        backgroundColor: "#6696F5",
                        borderRadius: "4px",
                        padding: "7px 16px",
                        color: "#FFFFFF",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontWeight: 500,
                        lineHeight: "22px",
                        marginBottom: "162px",
                    }}
                >
                    Continue
                </button>

                {/* FOOTER */}
                <footer
                    className="flex justify-center flex-wrap gap-4 md:gap-8"
                    style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        color: "#8F929C",
                    }}
                >
                    <span>© Defcon systems</span>
                    <a href="#">Privacy</a>
                    <a href="#">Support</a>
                    <a href="#">Pricing</a>
                    <a href="#">Log out</a>
                </footer>
            </div>
        </div>
    );
};

export default SignIn;
