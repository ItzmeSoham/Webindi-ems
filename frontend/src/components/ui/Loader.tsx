import React from 'react';

type LoaderSize = 'sm' | 'md' | 'lg';

interface LoaderProps {
  fullPage?: boolean;
  size?: LoaderSize;
  text?: string;
}

const sizeClasses: Record<LoaderSize, string> = {
  sm: 'w-6 h-6 border-2',
  md: 'w-10 h-10 border-3',
  lg: 'w-14 h-14 border-4',
};

const Loader: React.FC<LoaderProps> = ({ fullPage = false, size = 'md', text }) => {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizeClasses[size]} border-slate-700 border-t-indigo-500 rounded-full animate-spin`}
        style={{ borderTopColor: '#6366f1' }}
      />
      {text && <p className="text-sm text-slate-400">{text}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm z-50">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      {spinner}
    </div>
  );
};

export default Loader;
