import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
  hover?: boolean;
}

export default function Card({
  children,
  className = '',
  padding = true,
  hover = false,
}: CardProps) {
  return (
    <div
      className={`glass rounded-xl ${
        padding ? 'p-6' : ''
      } ${
        hover ? 'hover:glass-strong hover:scale-[1.02] transition-all duration-300 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
