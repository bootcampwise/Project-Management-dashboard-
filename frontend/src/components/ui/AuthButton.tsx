import React from "react";
import type { AuthButtonProps } from "../../types";

import { Button } from "./Button";

const AuthButton: React.FC<AuthButtonProps> = ({
  icon,
  text,
  onClick,
  disabled,
}) => {
  return (
    <Button
      variant="secondary"
      onClick={onClick}
      disabled={disabled}
      className="w-full justify-start gap-4 h-12 text-base"
      leftIcon={<img src={icon} alt={text} className="w-6 h-6" />}
    >
      <span className="text-gray-700 dark:text-gray-200 font-bold">{text}</span>
    </Button>
  );
};

export default AuthButton;
