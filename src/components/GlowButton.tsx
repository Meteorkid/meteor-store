'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const GlowButton = forwardRef<HTMLButtonElement, GlowButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', children, ...props }, ref) => {
    const variantStyles = {
      primary: 'bg-gradient-to-r from-purple-6 to-pink-6 text-white',
      secondary: 'bg-secondary text-secondary-foreground',
      ghost: 'bg-transparent text-foreground border border-border',
    };

    const sizeStyles = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    return (
      <button
        ref={ref}
        className={`button-glow relative inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 hover:scale-105 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        <span className="relative z-10">{children}</span>
      </button>
    );
  }
);

GlowButton.displayName = 'GlowButton';

export default GlowButton;
