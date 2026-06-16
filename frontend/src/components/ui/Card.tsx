import React from 'react';

type CardVariant = 'default' | 'highlighted';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
  hover?: boolean;
  className?: string;
  onClick?: () => void;
}

const paddingClasses: Record<CardPadding, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  className = '',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-xl transition-all duration-200
        ${variant === 'highlighted' ? 'gradient-border' : 'bg-slate-800/50 backdrop-blur-xl border border-slate-700/50'}
        ${hover ? 'hover:border-slate-600/50 hover:shadow-lg hover:shadow-indigo-500/5 hover:scale-[1.02] cursor-pointer' : ''}
        ${paddingClasses[padding]}
        ${className}
      `}
    >
      {variant === 'highlighted' ? (
        <div className={`relative z-10 ${paddingClasses[padding]}`}>{children}</div>
      ) : (
        children
      )}
    </div>
  );
};

export default Card;
