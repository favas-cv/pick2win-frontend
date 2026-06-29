import React from 'react';
import { ArrowUpRight, TrendingUp } from 'lucide-react';

export const AnalyticsCard = ({ title, metric, description, type = 'line', data = [] }) => {
  return (
    <div className="glass-card border-slate-200 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between hover:border-slate-300/80 transition duration-300">
      <div>
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-bold text-sports-gray tracking-wider uppercase">{title}</span>
          <span className="text-[10px] text-sports-green bg-sports-green/10 px-2 py-0.5 rounded-lg flex items-center gap-0.5 font-bold">
            <ArrowUpRight className="w-3 h-3" /> +12%
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-black text-slate-900">{metric}</h3>
          <span className="text-[10px] text-sports-gray font-medium">{description}</span>
        </div>
      </div>

      {/* SVG Vector Chart Display */}
      <div className="mt-6 h-28 w-full flex items-end">
        {type === 'line' ? (
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGradient2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <line x1="0" y1="5" x2="100" y2="5" stroke="#1E293B" strokeWidth="0.2" strokeDasharray="2,2" />
            <line x1="0" y1="15" x2="100" y2="15" stroke="#1E293B" strokeWidth="0.2" strokeDasharray="2,2" />
            <line x1="0" y1="25" x2="100" y2="25" stroke="#1E293B" strokeWidth="0.2" strokeDasharray="2,2" />
            
            <path
              d="M 0 30 L 0 20 L 15 15 L 30 22 L 45 10 L 60 18 L 75 8 L 90 12 L 100 5 L 100 30 Z"
              fill="url(#chartGradient2)"
            />
            <path
              d="M 0 20 L 15 15 L 30 22 L 45 10 L 60 18 L 75 8 L 90 12 L 100 5"
              fill="none"
              stroke="#10B981"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="100" cy="5" r="1.2" fill="#39FF14" className="animate-pulse" />
          </svg>
        ) : (
          <div className="flex justify-between items-end h-full w-full gap-2 px-1">
            {data.length ? data.map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div 
                  style={{ height: `${val}%` }} 
                  className="w-full sports-gradient rounded-t-md min-h-[4px] hover:brightness-110 transition-all duration-300 relative group"
                >
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-50 border border-slate-200 text-[8px] font-bold text-slate-900 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none">
                    {val}%
                  </span>
                </div>
              </div>
            )) : (
              [40, 60, 45, 75, 50, 90, 85].map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div 
                    style={{ height: `${val}%` }} 
                    className="w-full bg-slate-100 hover:bg-sports-green/80 rounded-t-md min-h-[4px] transition-all duration-300"
                  ></div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[9px] text-sports-gray font-bold uppercase tracking-wider">
        <span className="flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5 text-sports-green" /> 7d active activity
        </span>
        <span>Updated just now</span>
      </div>
    </div>
  );
};

export default AnalyticsCard;
