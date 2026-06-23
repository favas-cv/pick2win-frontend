import React from 'react';
import { AlertCircle } from 'lucide-react';

export const EmptyState = ({ 
  icon: Icon = AlertCircle, 
  title = 'No Data Found', 
  description = 'There is currently no information available here.',
  actionLabel,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center glass-card border-slate-800 rounded-2xl p-8">
      <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-850 mb-4 text-sports-gray">
        <Icon className="w-6 h-6 text-sports-green" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-sports-gray max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-sports-green hover:bg-sports-greenDark text-black text-xs font-extrabold px-5 py-2.5 rounded-xl transition shadow-lg shadow-sports-green/10 active:scale-95"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
