import React from 'react';

export const StatCard = ({ title, value, icon: Icon, trend, color = 'green' }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'red':
        return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'blue':
        return 'text-sports-blue bg-sports-blue/10 border-sports-blue/20';
      case 'yellow':
        return 'text-sports-yellow bg-sports-yellow/10 border-sports-yellow/20';
      case 'green':
      default:
        return 'text-sports-green bg-sports-green/10 border-sports-green/20';
    }
  };

  return (
    <div className="glass-card border-slate-800 rounded-2xl p-6 relative overflow-hidden flex justify-between items-center group hover:border-slate-700 transition duration-300">
      <div className="space-y-1">
        <span className="text-xs font-bold text-sports-gray tracking-wider uppercase">{title}</span>
        <h3 className="text-3xl font-extrabold text-white leading-none tracking-tight">{value}</h3>
        {trend && (
          <div className="text-[10px] text-sports-green font-bold pt-1">
            {trend}
          </div>
        )}
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${getColorClasses()} transition-transform duration-300 group-hover:scale-105 shadow-md`}>
        {Icon && <Icon className="w-5 h-5" />}
      </div>
    </div>
  );
};

export default StatCard;
