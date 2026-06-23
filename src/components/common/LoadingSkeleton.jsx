import React from 'react';

export const LoadingSkeleton = ({ type = 'card', count = 1 }) => {
  const renderSkeleton = (key) => {
    switch (type) {
      case 'stat':
        return (
          <div key={key} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 animate-pulse">
            <div className="w-1/3 h-3 bg-slate-800 rounded mb-4"></div>
            <div className="w-2/3 h-8 bg-slate-800 rounded"></div>
          </div>
        );
      case 'table':
        return (
          <div key={key} className="space-y-3 animate-pulse">
            <div className="h-10 bg-slate-900 rounded-xl border border-slate-800"></div>
            <div className="h-12 bg-slate-900 rounded-xl border border-slate-800"></div>
            <div className="h-12 bg-slate-900 rounded-xl border border-slate-800"></div>
            <div className="h-12 bg-slate-900 rounded-xl border border-slate-800"></div>
          </div>
        );
      case 'card':
      default:
        return (
          <div key={key} className="glass-card border-slate-800 rounded-2xl p-5 animate-pulse space-y-4">
            <div className="flex justify-between items-center">
              <div className="w-24 h-4 bg-slate-800 rounded"></div>
              <div className="w-12 h-4 bg-slate-800 rounded"></div>
            </div>
            <div className="flex justify-between items-center gap-4">
              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="w-12 h-12 bg-slate-800 rounded-full"></div>
                <div className="w-16 h-3 bg-slate-800 rounded"></div>
              </div>
              <div className="w-8 h-4 bg-slate-800 rounded"></div>
              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="w-12 h-12 bg-slate-800 rounded-full"></div>
                <div className="w-16 h-3 bg-slate-800 rounded"></div>
              </div>
            </div>
            <div className="h-10 bg-slate-800 rounded-xl"></div>
          </div>
        );
    }
  };

  return (
    <div className={type === 'stat' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full' : 'space-y-4 w-full'}>
      {Array.from({ length: count }).map((_, idx) => renderSkeleton(idx))}
    </div>
  );
};

export default LoadingSkeleton;
