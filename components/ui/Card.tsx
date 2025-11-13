import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}

export default function Card({
  children,
  className = '',
  padding = true,
}: CardProps) {
  return (
    <div
      className={`bg-gray-900 border border-gray-800 rounded-xl ${
        padding ? 'p-6' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
