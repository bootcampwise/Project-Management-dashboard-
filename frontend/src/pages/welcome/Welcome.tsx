import React from "react";
import { useWelcome } from "./hooks/useWelcome";
import { welcomeStyles, welcomeClasses } from "./welcomeStyle";
import { Button } from "../../components/ui";
import { IMAGES } from "../../constants/images";

const WelcomeScreen: React.FC = () => {
  const { handleGetStarted, isLoading, shouldRedirect } = useWelcome();

  if (isLoading || shouldRedirect) {
    return (
      <div className={welcomeClasses.loadingWrapper}>
        <div className={welcomeClasses.loadingSpinner}></div>
      </div>
    );
  }

  return (
    <div className={welcomeClasses.container}>
      <div className={welcomeClasses.contentWrapper}>
        <img src={IMAGES.logo2} alt="Defcon Logo" style={welcomeStyles.logo} />
        <h1 style={welcomeStyles.title}>Welcome To Defcon</h1>

        <p style={welcomeStyles.description}>
          Welcome to your Project Management Dashboard
          <br />
          track progress, manage tasks, and keep your team aligned.
        </p>

        <Button
          variant="primary"
          style={welcomeStyles.button}
          className={welcomeClasses.button}
          onClick={handleGetStarted}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
