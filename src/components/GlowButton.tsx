/* eslint-disable @typescript-eslint/no-explicit-any -- polymorphic component needs any for prop spread */
'use client';

import { ButtonHTMLAttributes, AnchorHTMLAttributes, forwardRef } from 'react';

type GlowButtonBaseProps = {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
};

type GlowButtonAsButton = GlowButtonBaseProps & {
  renderAs?: 'button';
} & ButtonHTMLAttributes<HTMLButtonElement>;

type GlowButtonAsAnchor = GlowButtonBaseProps & {
  renderAs: 'a';
} & AnchorHTMLAttributes<HTMLAnchorElement>;

type GlowButtonProps = GlowButtonAsButton | GlowButtonAsAnchor;

const GlowButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, GlowButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', renderAs: Component = 'button', children, ...props }, ref) => {
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
      <Component
        ref={ref}
        className={`button-glow relative inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 hover:scale-105 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...(props as any)}
      >
        <span className="relative z-10">{children}</span>
      </Component>
    );
  }
);

GlowButton.displayName = 'GlowButton';

export default GlowButton;
