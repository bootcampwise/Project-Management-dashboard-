import React from 'react';
import type { AuthButtonProps } from '../types';



const AuthButton: React.FC<AuthButtonProps> = ({ icon, text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-3 w-full px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <img src={icon} alt={text} className="w-6 h-6" />
      <span className="text-gray-700 font-medium">{text}</span>
    </button>
  );
};

export default AuthButton;
