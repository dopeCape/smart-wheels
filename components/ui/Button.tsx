import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses =
    'font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group';

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-white to-gray-100 text-black hover:from-gray-50 hover:to-white hover:shadow-lg hover:shadow-white/20 hover:scale-105 active:scale-95',
    secondary:
      'glass text-white hover:bg-white/10 hover:shadow-lg hover:shadow-white/10 border border-white/20 hover:border-white/30',
    danger:
      'bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-500 hover:to-red-600 hover:shadow-lg hover:shadow-red-500/50 hover:scale-105 active:scale-95',
    ghost:
      'bg-transparent text-gray-300 hover:bg-white/5 hover:text-white active:bg-white/10',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 -z-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
    </button>
  );
}
