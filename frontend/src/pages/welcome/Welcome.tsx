import React from "react";
import { useWelcome } from "./hooks/useWelcome";
import { welcomeStyles, welcomeClasses } from "./welcomeStyle";

const WelcomeScreen: React.FC = () => {
  const { handleGetStarted, isLoading } = useWelcome();

  if (isLoading) {
    return (
      <div className={welcomeClasses.loadingWrapper}>
        <div className={welcomeClasses.loadingSpinner}></div>
      </div>
    );
  }

  return (
    <div className={welcomeClasses.container}>

      {/* Content Wrapper */}
      <div className={welcomeClasses.contentWrapper}>

        {/* LOGO */}
        <img
          src="/logo2.png"
          alt="Defcon Logo"
          style={welcomeStyles.logo}
        />

        {/* TITLE */}
        <h1 style={welcomeStyles.title}>
          Welcome To Defcon
        </h1>

        {/* DESCRIPTION */}
        <p style={welcomeStyles.description}>
          Welcome to your Project Management Dashboard<br />
          track progress, manage tasks, and keep your team aligned.
        </p>

        {/* BUTTON */}
        <button
          style={welcomeStyles.button}
          className={welcomeClasses.button}
          onClick={handleGetStarted}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
