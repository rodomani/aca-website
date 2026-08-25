import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-sans transition-colors duration-200 border';
  
  const variants = {
    primary: 'bg-[#1A3C2F] text-[#F4F1E9] border-[#1A3C2F] hover:bg-[#2C5243]',
    outline: 'bg-transparent text-[#1A3C2F] border-[#1A3C2F] hover:bg-[#1A3C2F] hover:text-[#F4F1E9]',
    ghost: 'bg-transparent text-[#2C2C2C] border-transparent hover:text-[#1A3C2F] hover:bg-[#E2DEC6]/30',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`.trim();

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
}