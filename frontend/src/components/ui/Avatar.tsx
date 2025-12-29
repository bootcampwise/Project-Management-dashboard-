import React from 'react';
import type { AvatarProps } from '../../types';

const sizeStyles: Record<string, { container: string; text: string }> = {
  xs: { container: 'w-5 h-5', text: 'text-[8px]' },
  sm: { container: 'w-6 h-6', text: 'text-[9px]' },
  md: { container: 'w-8 h-8', text: 'text-xs' },
  lg: { container: 'w-10 h-10', text: 'text-sm' },
  xl: { container: 'w-16 h-16', text: 'text-xl' },
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = '',
  size = 'md',
  className = '',
}) => {
  const initials = name
    ? name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
    : 'U';

  const styles = sizeStyles[size];

  return (
    <div
      className={`
        ${styles.container}
        rounded-full overflow-hidden flex items-center justify-center
        bg-blue-100 text-blue-600 font-bold border-2 border-white
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      title={name}
    >
      {src ? (
        <img
          src={src}
          alt={name || 'Avatar'}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Hide broken image and show initials
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : (
        <span className={styles.text}>{initials}</span>
      )}
    </div>
  );
};

Avatar.displayName = 'Avatar';
