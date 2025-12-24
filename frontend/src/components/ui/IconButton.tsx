import React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  text?: string;
  variant?: 'outline' | 'filled' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  text,
  variant = 'ghost',
  size = 'md',
  className = '',
  ...props
}) => {
  const variantStyles = {
    outline: 'bg-white border border-gray-300 hover:bg-gray-50',
    filled: 'bg-gray-100 border border-gray-200 hover:bg-gray-200',
    ghost: 'hover:bg-gray-100',
  };

  const sizeStyles = {
    sm: 'p-1',
    md: 'p-1.5',
    lg: 'p-2',
  };

  const iconSizeStyles = {
    sm: '[&>svg]:w-4 [&>svg]:h-4',
    md: '[&>svg]:w-5 [&>svg]:h-5',
    lg: '[&>svg]:w-6 [&>svg]:h-6',
  };

  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        rounded-md transition-colors text-gray-600
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${iconSizeStyles[size]}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      {...props}
    >
      {icon}
      {text && <span className="text-sm font-medium">{text}</span>}
    </button>
  );
};

IconButton.displayName = 'IconButton';
