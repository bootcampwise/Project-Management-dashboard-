import React from "react";
import { useWelcome } from "../../hooks/useWelcome";

const WelcomeScreen: React.FC = () => {
    const { handleGetStarted, isLoading } = useWelcome();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 font-sans text-gray-900">

            {/* Content Wrapper */}
            <div className="w-full max-w-3xl flex flex-col items-center">

                {/* LOGO */}
                <img
                    src="/logo2.png"
                    alt="Defcon Logo"
                    style={{
                        width: "90.79px",
                        height: "90.79px",
                        objectFit: "contain",
                        marginBottom: "30.27px",
                    }}
                />

                {/* TITLE */}
                <h1
                    style={{
                        width: "100%",
                        maxWidth: "676px",
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 600,
                        fontSize: "48px",
                        lineHeight: "42px",
                        textAlign: "center",
                        marginBottom: "24px",
                    }}
                >
                    Welcome To Defcon
                </h1>

                {/* DESCRIPTION */}
                <p
                    style={{
                        width: "100%",
                        maxWidth: "676px",
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 500,
                        fontSize: "24px",
                        lineHeight: "35px",
                        textAlign: "center",
                        color: "#000000ff",
                        marginBottom: "40px",
                    }}
                >
                    Welcome to your Project Management Dashboard<br />
                    track progress, manage tasks, and keep your team aligned.
                </p>

                {/* BUTTON */}
                <button
                    style={{
                        width: "100%",
                        maxWidth: "400px",
                        height: "36px",
                        minWidth: "80px",
                        padding: "7px 16px",
                        borderWidth: "1px",
                        borderRadius: "4px",
                        backgroundColor: "#6696F5",
                        color: "white",
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 500,
                        fontSize: "16px",
                        lineHeight: "20px",
                        cursor: "pointer",
                    }}
                    className="hover:bg-blue-600 transition-all"
                    onClick={handleGetStarted}
                >
                    Get Started
                </button>
            </div>
        </div>
    );
};

export default WelcomeScreen;
