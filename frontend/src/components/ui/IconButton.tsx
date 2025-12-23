import React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  text: string;
  variant?: 'outline' | 'filled';
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  text,
  variant = 'outline',
  className = '',
  ...props
}) => {
  const variantStyles = {
    outline: 'bg-white border border-gray-300 hover:bg-gray-50',
    filled: 'bg-gray-100 border border-gray-200 hover:bg-gray-200',
  };

  return (
    <button
      className={`
        flex items-center justify-center gap-3 w-full px-6 py-3 
        rounded-lg transition-colors
        ${variantStyles[variant]}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      {...props}
    >
      <img src={icon} alt={text} className="w-6 h-6" />
      <span className="text-gray-700 font-medium">{text}</span>
    </button>
  );
};

IconButton.displayName = 'IconButton';
